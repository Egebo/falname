import {
  addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, setDoc,
} from 'firebase/firestore';
import { db, ensureSignedIn } from './firebase';

export type FortuneType = 'el' | 'kahve' | 'burc' | 'harita';

export interface FortuneRecord {
  id: string;
  type: FortuneType;
  emoji: string;
  title: string;
  summary: string;
  content: string;
  createdAt: number;
}

type NewFortune = Omit<FortuneRecord, 'id' | 'createdAt'>;

async function fortunesCollection() {
  const user = await ensureSignedIn();
  return collection(db, 'users', user.uid, 'fortunes');
}

// dedupeKey verilirse aynı anahtarla tekrar kaydetmek üzerine yazar
// (örn. haftalık burç falının her açılışta yeni kayıt üretmemesi için).
export async function saveFortune(data: NewFortune, dedupeKey?: string): Promise<void> {
  const col = await fortunesCollection();
  const record = { ...data, createdAt: Date.now() };
  if (dedupeKey) {
    await setDoc(doc(col, dedupeKey), record);
  } else {
    await addDoc(col, record);
  }
}

export async function loadFortunes(max = 50): Promise<FortuneRecord[]> {
  const col = await fortunesCollection();
  const snap = await getDocs(query(col, orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<FortuneRecord, 'id'>) }));
}

export async function deleteFortune(id: string): Promise<void> {
  const col = await fortunesCollection();
  await deleteDoc(doc(col, id));
}

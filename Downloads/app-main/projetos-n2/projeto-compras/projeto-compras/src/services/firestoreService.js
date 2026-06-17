import { db } from '../../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';

export const salvarItem = async (userId, item) => {
  try {
    const docRef = await addDoc(collection(db, 'compras'), { ...item, userId, criadoEm: new Date() });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Escuta em tempo real apenas os itens do usuário logado.
// Retorna a função de unsubscribe.
export const escutarItens = (userId, callback) => {
  const q = query(collection(db, 'compras'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const itens = [];
    snapshot.forEach((d) => itens.push({ id: d.id, ...d.data() }));
    callback(itens);
  });
};

export const atualizarItem = async (id, dados) => {
  try {
    await updateDoc(doc(db, 'compras', id), dados);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deletarItem = async (id) => {
  try {
    await deleteDoc(doc(db, 'compras', id));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  where,
  query,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseCrudService {
  private firestore = inject(Firestore);

  obterTodos<T>(colecaoNome: string): Observable<T[]> {
    console.log(`🔍 Buscando todos os documentos de: ${colecaoNome}`);
    try {
      const colecaoRef = collection(this.firestore, colecaoNome);
      return collectionData(colecaoRef, { idField: 'id' }) as Observable<T[]>;
    } catch (error) {
      console.error(`❌ Erro em obterTodos para ${colecaoNome}:`, error);
      throw error;
    }
  }

  obterPorId<T>(colecaoNome: string, id: string): Observable<T> {
    const docRef = doc(this.firestore, `${colecaoNome}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<T>;
  }

  obterComFiltro<T>(
    colecaoNome: string,
    campo: string,
    valor: any
  ): Observable<T[]> {
    const colecaoRef = collection(this.firestore, colecaoNome);
    const q = query(colecaoRef, where(campo, '==', valor));
    return collectionData(q, { idField: 'id' }) as Observable<T[]>;
  }

  async adicionar(colecaoNome: string, dados: any): Promise<string> {
    console.log(`➕ Adicionando documento em ${colecaoNome}:`, dados);
    try {
      const colecaoRef = collection(this.firestore, colecaoNome);
      const docRef = await addDoc(colecaoRef, dados);
      console.log(`✅ Documento adicionado com ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error(`❌ Erro ao adicionar documento em ${colecaoNome}:`, error);
      throw error;
    }
  }

  async atualizar(colecaoNome: string, id: string, dados: any): Promise<void> {
    const docRef = doc(this.firestore, `${colecaoNome}/${id}`);
    await updateDoc(docRef, dados);
  }

  async excluir(colecaoNome: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, `${colecaoNome}/${id}`);
    await deleteDoc(docRef);
  }
}

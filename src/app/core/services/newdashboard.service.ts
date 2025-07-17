import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private firestore: AngularFirestore) { }

  getProducts(): Observable<any[]> {
    return this.firestore.collection('products').valueChanges();
  }

  addProduct(product: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('products').doc(id).set(product);
  }
}

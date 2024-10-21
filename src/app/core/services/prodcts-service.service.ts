import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, doc, getDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Iproduct } from '../interfaces/iproduct';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdctsService {

  private prodctsCollection = collection(this.firestore, 'prodcts');  // مجموعة المنتجات

  constructor(private firestore: Firestore, private storage: Storage) { }

  // إضافة المنتج مع الصورة الرئيسية والصور الثانوية
  addProduct(product: Iproduct, mainImage: File , secondaryImages: File[]): Observable<any> {
    const mainImageRef = ref(this.storage, `products/main/${mainImage.name}`);

    // رفع الصورة الرئيسية إلى Firebase Storage
    const mainImageTask = uploadBytes(mainImageRef, mainImage).then((snapshot) => {
      return getDownloadURL(snapshot.ref);
    });

    // رفع الصور الثانوية إلى Firebase Storage
    const secondaryImageTasks = secondaryImages.map((file) => {
      const secondaryImageRef = ref(this.storage, `products/secondary/${file.name}`);
      return uploadBytes(secondaryImageRef, file).then((snapshot) => {
        return getDownloadURL(snapshot.ref);
      });
    });

    // بعد رفع جميع الصور، إضافة المنتج إلى Firestore
    return from(Promise.all([mainImageTask, ...secondaryImageTasks]).then((downloadURLs) => {
      product.image = downloadURLs[0];  // الصورة الرئيسية
      product.secondaryImages = downloadURLs.slice(1);  // الصور الثانوية

      // إضافة المنتج إلى Firestore
      return addDoc(this.prodctsCollection, product);
    }));
  }

  // حذف المنتج
  removeProduct(productId: string): Observable<void> {
    const docRef = doc(this.firestore, 'prodcts/' + productId);

    return from(
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const productData = docSnap.data() as Iproduct;

          // حذف الصورة الرئيسية من Firebase Storage
          const mainImageRef = ref(this.storage, productData.image);
          const mainImageDeleteTask = deleteObject(mainImageRef);

          // حذف الصور الثانوية من Firebase Storage
          const secondaryImageDeleteTasks = productData.secondaryImages.map((imageUrl: string) => {
            const secondaryImageRef = ref(this.storage, imageUrl);
            return deleteObject(secondaryImageRef);
          });

          // حذف الصور من Firebase ثم حذف المنتج من Firestore
          return Promise.all([mainImageDeleteTask, ...secondaryImageDeleteTasks]).then(() => {
            return deleteDoc(docRef);
          });
        } else {
          throw new Error('Product not found');
        }
      })
    );
  }

  // استرجاع المنتجات
  getprodcts(): Observable<Iproduct[]> {
    return collectionData(this.prodctsCollection, {
      idField: 'id'
    }) as Observable<Iproduct[]>;
  }

  // استرجاع منتج محدد بناءً على معرف المنتج
  getSpacificProduct(productId: string): Observable<Iproduct | undefined> {
    const docRef = doc(this.firestore, 'prodcts/' + productId);

    // الحصول على وثيقة المنتج من Firestore
    return from(
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          return docSnap.data() as Iproduct;
        } else {
          throw new Error('Product not found');
        }
      })
    );
  }
}

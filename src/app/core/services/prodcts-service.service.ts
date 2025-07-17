import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, forkJoin } from 'rxjs';
import { map, catchError, throwError } from 'rxjs';
import { Iproduct } from '../interfaces/iproduct';
import { Firestore, addDoc, collection, doc, getDoc, deleteDoc, collectionData } from '@angular/fire/firestore';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProdctsService {
  private cloudinaryUrl = `https://api.cloudinary.com/v1_1/${environment.cloudName}/upload`;
  private cloudinaryPreset = 'ml_default'; // قم بتحديد Upload Preset في Cloudinary
  private prodctsCollection = collection(this.firestore, 'prodcts');

  constructor(private firestore: Firestore, private http: HttpClient) {}

  // رفع صورة إلى Cloudinary
  private uploadToCloudinary(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.cloudinaryPreset);
    return this.http.post(this.cloudinaryUrl, formData).pipe(
      catchError((error) => {
        console.error('Error uploading image to Cloudinary:', error);
        return throwError(() => new Error('Failed to upload image.'));
      })
    );
  }

  // إضافة المنتج مع رفع الصور إلى Cloudinary
  addProduct(product: Iproduct, mainImage: File, secondaryImages: File[]): Observable<any> {
    const mainImageTask$ = this.uploadToCloudinary(mainImage);

    // رفع الصور الثانوية
    const secondaryImageTasks$ = secondaryImages?.length 
      ? secondaryImages.map((file) => this.uploadToCloudinary(file)) 
      : [];

    // استخدام forkJoin لتجميع جميع عمليات رفع الصور
    return forkJoin([mainImageTask$, ...secondaryImageTasks$]).pipe(
      map((responses) => {
        const mainImageUrl = responses[0].secure_url;
        const secondaryImageUrls = responses.slice(1).map((res: any) => res.secure_url);

        // إضافة الصور إلى المنتج
        product.image = mainImageUrl;
        product.secondaryImages = secondaryImageUrls;

        // إضافة المنتج إلى Firestore
        return addDoc(this.prodctsCollection, product);
      }),
      catchError((error) => {
        console.error('Error while adding product:', error);
        return throwError(() => new Error('Failed to add product.'));
      })
    );
  }

  // حذف المنتج
  removeProduct(productId: string): Observable<void> {
    const docRef = doc(this.firestore, 'prodcts/' + productId);

    return from(
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          const productData = docSnap.data() as Iproduct;

          // حذف الصور من Cloudinary
          const deleteTasks = [
            productData.image ? this.deleteFromCloudinary(productData.image) : Promise.resolve(),
            ...(productData.secondaryImages?.map((url: string) => this.deleteFromCloudinary(url)) || []),
          ];

          // حذف الصور من Cloudinary ثم حذف المنتج من Firestore
          return Promise.all(deleteTasks).then(() => {
            return deleteDoc(docRef);
          });
        } else {
          throw new Error('Product not found');
        }
      })
    ).pipe(
      catchError((error) => {
        console.error('Error while deleting product:', error);
        return throwError(() => new Error('Failed to delete product.'));
      })
    );
  }

  // حذف صورة من Cloudinary
  private deleteFromCloudinary(imageUrl: string): Promise<void> {
    // استخرج `public_id` من URL الصورة
    const publicId = imageUrl.split('/').pop()?.split('.')[0];
    const deleteUrl = `https://api.cloudinary.com/v1_1/${environment.cloudName}/resources/image/upload/${publicId}`;

    return this.http
      .delete(deleteUrl, {
        headers: {
          Authorization: `Basic ${btoa(`${environment.apiKey}:${environment.apiSecret}`)}`,
        },
      })
      .toPromise()
      .then(() => {})
      .catch((error) => {
        console.error('Error deleting image from Cloudinary:', error);
        throw new Error('Failed to delete image.');
      });
  }

  // استرجاع المنتجات
  getprodcts(): Observable<Iproduct[]> {
    return collectionData(this.prodctsCollection, {
      idField: 'id',
    }) as Observable<Iproduct[]>;
  }

  // استرجاع منتج محدد
  getSpacificProduct(productId: string): Observable<Iproduct | undefined> {
    const docRef = doc(this.firestore, 'prodcts/' + productId);

    return from(
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          return docSnap.data() as Iproduct;
        } else {
          throw new Error('Product not found');
        }
      })
    ).pipe(
      catchError((error) => {
        console.error('Error while fetching specific product:', error);
        return throwError(() => new Error('Failed to fetch product.'));
      })
    );
  }
}

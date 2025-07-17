// user-auth.service.ts
import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  constructor(private auth: Auth) { }

  // تسجيل مستخدم جديد باستخدام البريد الإلكتروني وكلمة المرور
  signUp(email: string, password: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password).then((userCredential) => userCredential.user));
  }

  // تسجيل الدخول للمستخدم
  signIn(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => userCredential.user));
  }

  // تسجيل الخروج
  signOut(): Observable<void> {
    return from(this.auth.signOut());
  }

  // الحصول على المستخدم الحالي
  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      this.auth.onAuthStateChanged((user) => {
        observer.next(user);
      });
    });
  }
}

import { isPlatformBrowser } from '@angular/common';
import { Inject, inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const dashGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const _PLATFORM_ID = inject(PLATFORM_ID);

  // تحقق مما إذا كانت قيمة 'admin' موجودة في localStorage
  const isAdmin = localStorage.getItem('admin') === 'true';
  if (isPlatformBrowser(_PLATFORM_ID)) {
    if (isAdmin) {
      return true;
    } else {
      // إذا لم يكن المستخدم مسؤولاً، توجيههم إلى الصفحة الرئيسية
      router.navigate(['/home']);
      return false;
    }
  } else {
    return false
  }

  // إذا كان المستخدم هو المسؤول، سمح له بالوصول

};

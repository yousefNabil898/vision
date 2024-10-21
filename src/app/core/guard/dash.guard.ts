import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const dashGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router)
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('admin') !== null) {
      return true;
    } else {
      _Router.navigate(['/home']);
      return false;
    }
  } else {
    return false
  }

};

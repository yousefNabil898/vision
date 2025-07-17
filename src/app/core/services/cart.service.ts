import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'shoppingCart'; 
  private _ToastrService = inject(ToastrService);
  private platformId = inject(PLATFORM_ID); 

  constructor() {}

  addToCart(productId: string): string {
    if (isPlatformBrowser(this.platformId)) {  
      const cart = this.getCart();
      if (cart.includes(productId)) {
        this._ToastrService.info('هذا المنتج مضاف بالفعل في السلة !');
        return 'هذا المنتج مضاف بالفعل في السلة';
      } else {
        cart.push(productId);
        localStorage.setItem(this.cartKey, JSON.stringify(cart));
        this._ToastrService.info('تمت إضافة المنتج إلى السلة بنجاح ');
        return 'تمت إضافة المنتج إلى السلة بنجاح';
      }
    }
    return 'غير مدعوم في هذه البيئة'; 
  }

  removeFromCart(productId: string): void {
    if (isPlatformBrowser(this.platformId)) {  
      const cart = this.getCart().filter(id => id !== productId);
      localStorage.setItem(this.cartKey, JSON.stringify(cart));
    }
  }

  getCart(): string[] {
    if (isPlatformBrowser(this.platformId)) {  
      const cart = localStorage.getItem(this.cartKey);
      return cart ? JSON.parse(cart) : [];
    }
    return [];
  }

  clearCart(): void {
    if (isPlatformBrowser(this.platformId)) { 
      localStorage.removeItem(this.cartKey);
    }
  }
}

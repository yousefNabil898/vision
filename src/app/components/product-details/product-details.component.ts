import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdctsService } from '../../core/services/prodcts-service.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Iproduct } from '../../core/interfaces/iproduct';
import { NgwWowService } from 'ngx-wow';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CarouselModule, TranslateModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _productservice = inject(ProdctsService);
  private readonly _NgwWowService = inject(NgwWowService);
  private readonly _CartService = inject(CartService);
  cartID: string[] = []
  // تحويل detailesProduct إلى Signal
  detailesProduct: Iproduct | undefined = {} as Iproduct;
  customOptionsDetailes: OwlOptions = {
    loop: true,
    rtl: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false
  };

  private subscriptions: Subscription = new Subscription(); // لإدارة الاشتراكات

  ngOnInit(): void {
    // الاشتراك في ActivatedRoute للحصول على معرف المنتج
    const routeSub = this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        const idProduct: string = p.get('id')!;
        // جلب تفاصيل المنتج بناءً على المعرّف
        const productSub = this._productservice.getSpacificProduct(idProduct).subscribe((product) => {
          this.detailesProduct = product; // تعيين المنتج في الـ Signal
        });

        // إضافة اشتراك الخدمة إلى subscriptions
        this.subscriptions.add(productSub);
      }
    });

    // إضافة اشتراك المعرّف إلى subscriptions
    this.subscriptions.add(routeSub);

    // تفعيل تأثيرات wow.js
    this._NgwWowService.init();
  this.cartID =  this._CartService.getCart()
  console.log(this.cartID);
  
  }

  ngOnDestroy(): void {
    // إلغاء الاشتراكات عند تدمير المكون
    this.subscriptions.unsubscribe();
  }
}



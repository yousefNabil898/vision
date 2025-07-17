import { Iproduct } from './../../core/interfaces/iproduct';
import { CartService } from './../../core/services/cart.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ProdctsService } from '../../core/services/prodcts-service.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CategoryPipe } from '../../core/pipes/category.pipe';
import { SubcatigoryPipe } from '../../core/pipes/subcatigory.pipe';
import { TruncatePipe } from '../../core/pipes/truncate';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, CategoryPipe, SubcatigoryPipe, TruncatePipe,TranslateModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  private CartService = inject(CartService)
  // تحويل القوائم والخصائص التي تتغير باستمرار إلى Signals
  productsList : Iproduct[] = []; // قائمة المنتجات
  mainValue = signal<string>(''); // الفئة الرئيسية المختارة
  subValue = signal<string>(''); // الفئة الفرعية المختارة
  cartItems: string[] = [];

  mainOptions = [
    { value: "", label: "All Categories" },
    { value: "Coating & decorations colours", label: "Coating & decorations colours" },
    { value: "Decal", label: "Decal" },
    { value: "Porcelain", label: "Porcelain" },
    { value: 'Glass', label: 'Glass' }
  ];

  supOption = [
    { value: "", label: "All Categories" },
    { value: "Glass & Ceramic colours", label: "Glass & Ceramic colours" },
    { value: "Organic Colours", label: "Organic Colours" },
    { value: "Luster", label: "Luster" },
    { value: "Materials", label: "Materials" },
    { value: "Pattern", label: "Pattern" },
    { value: "Plain", label: "Plain" },
    { value: "Decorated", label: "Decorated" }
  ];

ngOnInit(): void {
  this.productsList = [
  {
    id: '1',
    name: 'Golden Coating',
    Details: 'High quality golden coating for ceramics and glass surfaces.',
    image: '../../../assets/Frame 6.png',
    mainCatigory: 'Coating & decorations colours',
    subCatigory: 'Organic Colours',
    subCatigoryDetailes: 'Eco-friendly and durable coating for decorative purposes.',
    secondaryImages: [
      'assets/products/golden-coating-1.jpg',
      'assets/products/golden-coating-2.jpg'
    ]
  },
  {
    id: '2',
    name: 'Floral Decal Set',
    Details: 'A beautiful set of floral decals for porcelain decoration.',
    image: '../../../assets/vases.jpg',
    mainCatigory: 'Decal',
    subCatigory: 'Pattern',
    subCatigoryDetailes: 'Includes various floral patterns in different sizes.',
    secondaryImages: [
      'assets/products/floral-decal-1.jpg',
      'assets/products/floral-decal-2.jpg'
    ]
  },
  {
    id: '3',
    name: 'Porcelain Plate',
    Details: 'High durability porcelain plate with a smooth finish.',
    image: '../../../assets/about1.jpg',
    mainCatigory: 'Porcelain',
    subCatigory: 'Plain',
    subCatigoryDetailes: 'Minimalist design porcelain plate.',
    secondaryImages: [
      'assets/products/porcelain-plate-1.jpg',
      'assets/products/porcelain-plate-2.jpg'
    ]
  },
  {
    id: '4',
    name: 'Glass Vase',
    Details: 'Handcrafted glass vase with decorated patterns.',
    image: '../../../assets/about2.jpg',
    mainCatigory: 'Glass',
    subCatigory: 'Decorated',
    subCatigoryDetailes: 'Decorated with premium handmade patterns.',
    secondaryImages: [
      'assets/products/glass-vase-1.jpg',
      'assets/products/glass-vase-2.jpg'
    ]
  },
  {
    id: '5',
    name: 'Ceramic Color Set',
    Details: 'Complete set of ceramic and glass colours for professionals.',
    image: '../../../assets/about-3.jpg',
    mainCatigory: 'Coating & decorations colours',
    subCatigory: 'Glass & Ceramic colours',
    subCatigoryDetailes: 'Various colors suitable for ceramic and glass artworks.',
    secondaryImages: [
      'assets/products/ceramic-colors-1.jpg',
      'assets/products/ceramic-colors-2.jpg'
    ]
  },
  {
    id: '6',
    name: 'Luster Gold Paint',
    Details: 'Premium luster gold paint for luxury designs.',
    image: '../../../assets/Frame 6.png',
    mainCatigory: 'Coating & decorations colours',
    subCatigory: 'Luster',
    subCatigoryDetailes: 'Lustrous gold paint with a shiny finish.',
    secondaryImages: [
      'assets/products/luster-gold-1.jpg',
      'assets/products/luster-gold-2.jpg'
    ]
  },
  {
    id: '7',
    name: 'Organic Decal Set',
    Details: 'Organic decal set for eco-friendly porcelain designs.',
    image: '../../../assets/vases.jpg',
    mainCatigory: 'Decal',
    subCatigory: 'Organic Colours',
    subCatigoryDetailes: 'Organic ink-based decals.',
    secondaryImages: [
      'assets/products/organic-decal-1.jpg',
      'assets/products/organic-decal-2.jpg'
    ]
  },
  {
    id: '8',
    name: 'Patterned Porcelain Cup',
    Details: 'Patterned porcelain cup with detailed artwork.',
    image: '../../../assets/about-3.jpg',
    mainCatigory: 'Porcelain',
    subCatigory: 'Pattern',
    subCatigoryDetailes: 'Cup with traditional patterns.',
    secondaryImages: [
      'assets/products/patterned-cup-1.jpg',
      'assets/products/patterned-cup-2.jpg'
    ]
  }
];
}
  // استرجاع المنتجات عند التهيئة



}

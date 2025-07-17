import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, signal, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProdctsService } from '../../core/services/prodcts-service.service';
import { Iproduct } from '../../core/interfaces/iproduct';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../core/pipes/truncate';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, TruncatePipe, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private prodctsService = inject(ProdctsService);
  private toastrService = inject(ToastrService);
  private renderer = inject(Renderer2);

  editMode = signal(false); // تفعيل وضع التعديل
  currentProductId = signal<string | null>(null); // تحديد المنتج الحالي في حالة التعديل

  @ViewChild('submitButton', { static: false }) submitButton!: ElementRef;

  // بيانات المنتجات
  products = signal<Iproduct[]>([]);
  selectedFile = signal<File | null>(null); // الصورة الرئيسية
  selectedFiles = signal<File[]>([]); // الصور الثانوية

  private subscriptions = new Subscription();

  // تحميل المنتجات عند بدء المكون
  ngOnInit(): void {
    const productsSub = this.prodctsService.getprodcts().subscribe({
      next: (res) => this.products.set(res),
      error: () => this.toastrService.error('Failed to load products.')
    });

    this.subscriptions.add(productsSub);
  }

  // إضافة منتج
  addProduct(form: any): void {
    const productData: Iproduct = form.value;

    // التحقق من المدخلات والصور
    if (!productData.name || !productData.mainCatigory || !productData.subCatigory || !productData.Details) {
      this.toastrService.info('Please fill all required fields.');
      return;
    }

    if (!this.selectedFile() || !this.selectedFiles().length) {
      this.toastrService.info('Please select all required images.');
      return;
    }

    // تعطيل الزر أثناء العملية
    this.renderer.addClass(this.submitButton.nativeElement, 'disabled');

    this.prodctsService.addProduct(productData, this.selectedFile()!, this.selectedFiles()).subscribe({
      next: () => {
        this.toastrService.success('Product added successfully!');
        this.resetForm(form);
      },
      error: () => this.toastrService.error('Failed to add product.'),
      complete: () => this.renderer.removeClass(this.submitButton.nativeElement, 'disabled')
    });
  }

  // تفعيل وضع التعديل
  setEditMode(product: Iproduct): void {
    this.editMode.set(true);
    this.currentProductId.set(product.id);
    // إعداد الصور والنموذج للمنتج المحدد
    this.selectedFile.set(null);
    this.selectedFiles.set([]);
  }

  // إزالة منتج
  removeProduct(productId: string): void {
    this.prodctsService.removeProduct(productId).subscribe({
      next: () => {
        this.products.set(this.products().filter(product => product.id !== productId));
        this.toastrService.success('Product removed successfully!');
      },
      error: () => this.toastrService.error('Failed to remove product.')
    });
  }

  // تحديد الصورة الرئيسية
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile.set(input.files[0]);
    }
  }

  // تحديد الصور الثانوية
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles.set(Array.from(input.files));
    }
  }

  // إعادة تعيين النموذج
  resetForm(form: any): void {
    form.resetForm();
    this.selectedFile.set(null);
    this.selectedFiles.set([]);
    this.editMode.set(false);
    this.currentProductId.set(null);
  }

  // إلغاء الاشتراكات عند تدمير المكون
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

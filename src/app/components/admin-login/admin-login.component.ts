import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  private router = inject(Router);
  private _ToastrService = inject(ToastrService);
  showLoginForm = false;
  email: string = '';
  password: string = '';

  // الاستماع لأزرار Ctrl + D لفتح النموذج
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === '~') {
      this.showLoginForm = true;
    }
  }

  // إغلاق النموذج عند الضغط على زر الإغلاق
  closeLoginForm() {
    this.showLoginForm = false;
  }

  // التعامل مع عملية تسجيل الدخول
  onSubmit() {
    if (this.email === 'yousef' && this.password === '123') {
      this._ToastrService.success('Login successful');
      localStorage.setItem('admin', 'true');
      this.router.navigate(['/dashboard']);
      this.closeLoginForm();
    } else {
      this._ToastrService.error('Invalid email or password');
    }
  }
}

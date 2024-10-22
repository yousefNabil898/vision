import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MyTranslateService {
  private readonly _TranslateService = inject(TranslateService);
  private readonly _platId = inject(PLATFORM_ID);
  isLeft: WritableSignal<boolean> = signal(true);

  constructor() {
    // Check if the platform is a browser
    if (isPlatformBrowser(this._platId)) {
      let lang = localStorage.getItem('lang');  // Get stored language
      this._TranslateService.setDefaultLang('en');  // Set default language as English

      // If a language is stored, use it
      if (lang !== null) {
        this._TranslateService.use(lang);
      }

      // Adjust the direction of the layout
      this.changeDirection();
    }
  }

  // Method to change the direction of the layout (LTR/RTL) based on the language
  changeDirection(): void {
    let savedTranslations = localStorage.getItem('lang');
    if (savedTranslations === 'en') {
      document.documentElement.dir = 'ltr';  // Set direction to LTR
      this.isLeft.set(true);  // Update signal to reflect LTR
    } else if (savedTranslations === 'ar') {
      document.documentElement.dir = 'rtl';  // Set direction to RTL
      this.isLeft.set(false);  // Update signal to reflect RTL
    }    
  }

  // Method to change the language and adjust direction accordingly
  changeLang(lang: string): void {
    if (isPlatformBrowser(this._platId)) {
      localStorage.setItem('lang', lang);  // Store the new language in localStorage
      this._TranslateService.use(lang);  // Use the new language for translations
      this.changeDirection();  // Change direction after changing language
    }
  }
}

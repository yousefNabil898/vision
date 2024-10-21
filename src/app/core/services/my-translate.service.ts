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
    if (isPlatformBrowser(this._platId)) {
      let lang = localStorage.getItem("lang");
      this._TranslateService.setDefaultLang("en");

      if (lang !== null) {
        this._TranslateService.use(lang);
      }

      this.changeDirection();
    }
  }

  changeDirection(): void {
    let savedTranslations = localStorage.getItem('lang');
    if (savedTranslations === 'en') {
      document.documentElement.dir = "ltr";
      this.isLeft.set(true);
    } else if (savedTranslations === 'ar') {
      document.documentElement.dir = "rtl";
      this.isLeft.set(false);
    }    
  }
  changeLang(lang: string) {
    if (isPlatformBrowser(this._platId)) {
      localStorage.setItem("lang", lang)
      this._TranslateService.use(lang)
      this.changeDirection()
    }
  }
}

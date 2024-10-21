import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, HostListener, Inject, inject, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MyTranslateService } from '../../core/services/my-translate.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isAdmin: boolean = false
  private readonly _MyTranslateService = inject(MyTranslateService)
  change(lang: string): void {
    this._MyTranslateService.changeLang(lang)
  }
  ngOnInit(): void {


    this.isadminCheck()

  }
  isScrolled = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = document.documentElement.scrollTop;
    this.isScrolled = scrollOffset > 25;
  }
  isadminCheck() {
    if (isPlatformBrowser(this.platformId)) {
      const adminStatus = localStorage.getItem('admin');
      this.isAdmin = (adminStatus === 'true');
    }
  }

}

import { NgClass } from '@angular/common';
import { Component, HostListener, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('admin') == 'true') {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
  }

}
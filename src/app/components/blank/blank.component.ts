import { RouterOutlet, Routes } from '@angular/router';
import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { AdminLoginComponent } from "../admin-login/admin-login.component";

@Component({
  selector: 'app-blank',
  standalone: true,
  imports: [RouterOutlet, AdminLoginComponent],
  templateUrl: './blank.component.html',
  styleUrl: './blank.component.scss'
})
export class BlankComponent {

}

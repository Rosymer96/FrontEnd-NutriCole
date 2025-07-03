import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponentComponent } from './components/layout/navbar/navbar-component.component';
import { FooterComponentComponent } from './components/layout/footer/footer-component.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponentComponent, FooterComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'nutri-cole';
}

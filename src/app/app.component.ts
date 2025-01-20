import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Configuration } from './shared/configuration';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-flexible-layout';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, FlexLayoutModule,
       NavbarComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    public config: Configuration,
    public auth: AuthService
  ) {
  }

}

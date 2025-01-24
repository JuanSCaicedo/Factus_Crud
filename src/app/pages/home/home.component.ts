import { Component } from '@angular/core';
import { AuthService } from '../auth/service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
  ) { }

  logout() {
    this.authService.logout();
  }
}

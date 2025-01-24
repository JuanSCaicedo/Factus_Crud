import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading$: any;

  email!: string;
  password!: string;
  code_user!: string;

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    public activatedRoute: ActivatedRoute,
    public router: Router,
  ) { }

  ngOnInit(): void {

    this.isLoading$ = this.authService.isLoading$;

    if (this.authService.token && this.authService.user) {
      window.location.href = "/";
      return;
    }

    // Realiza scroll hacia la parte superior de la página
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll suave hacia arriba
      }
    }, 0);
  }

  login() {
    if (!this.email || !this.password) {
      this.toastr.error("Validación", "Necesitas ingresar todos los campos");
      return;
    }
    this.authService.login(this.email, this.password).subscribe((resp: any) => {
      console.log(resp);

      if (resp.status == 429) {
        this.toastr.error("Error", 'Has excedido el límite de solicitudes. Por favor, intenta de nuevo en un minuto');
        return;
      }

      if (resp.error && resp.error.error) {
        this.toastr.error("Error", 'Verifica tus credenciales');
        return;
      }

      if (resp == true) {
        this.toastr.success("Éxito", 'Bienvenido');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 500);
        
      }
    }, (error) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    })
  }

  logout() {
    this.authService.logout();
  }
}

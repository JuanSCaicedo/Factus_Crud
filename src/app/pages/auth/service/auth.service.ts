import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CLIENT_ID, CLIENT_SECRET, URL_API, URL_SERVICIOS } from '../../../config/config';
import { catchError, BehaviorSubject, Observable, finalize, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  token!: string;
  user!: any;

  constructor(
    public http: HttpClient,
    public router: Router,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.initAuth();
  }

  initAuth() {
    if (localStorage.getItem("token")) {
      this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ?? '') : null;
      this.token = localStorage.getItem("token") + "";
    }
  }

  login(email: string, password: string) {
    this.isLoadingSubject.next(true);

    const URL = URL_API + "/oauth/token";

    // Crear el cuerpo de la solicitud en formato x-www-form-urlencoded
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', CLIENT_ID); // Reemplaza por tu client_id
    body.set('client_secret', CLIENT_SECRET); // Reemplaza por tu client_secret
    body.set('username', email); // El servidor espera "username", no "email"
    body.set('password', password);

    // Enviar la solicitud HTTP
    return this.http.post(URL, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).pipe(
      map((resp: any) => {
        console.log(resp);
        const result = this.saveLocalStorage(resp); // Guardar la respuesta en el almacenamiento local
        return result;
      }),
      catchError((err: any) => {
        console.error(err);
        return of(err);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  saveLocalStorage(resp: any) {
    if (resp && resp.access_token) {
      localStorage.setItem("token", resp.access_token);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem("token");
    this.user = null;
    this.token = '';

    setTimeout(() => {
      this.router.navigateByUrl("/login");
    }, 500);
  }
}
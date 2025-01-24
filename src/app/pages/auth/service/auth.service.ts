import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from '../../../config/config';
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

    let URL = URL_SERVICIOS + "/auth/login_ecommerce";

    return this.http.post(URL, { email, password }).pipe(
      map((resp: any) => {
        console.log(resp);
        const result = this.saveLocalStorage(resp);
        return result;
      }),
      catchError((err: any) => {
        console.log(err);
        return of(err);
      }),

      finalize(() => this.isLoadingSubject.next(false))
    )
  }

  saveLocalStorage(resp: any) {
    if (resp && resp.access_token) {
      localStorage.setItem("token", resp.access_token);
      localStorage.setItem("user", JSON.stringify(resp.user));
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.user = null;
    this.token = '';

    setTimeout(() => {
      this.router.navigateByUrl("/login");
    }, 500);
  }
}
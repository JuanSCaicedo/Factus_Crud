import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { URL_API } from '../../../config/config';
import { catchError, BehaviorSubject, Observable, finalize, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient,
    private authservice: AuthService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // Listar Facturas
  listarFacturas(page: number, perPage: number, filters: any = {}) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });

    let queryParams = `?page=${page}&per_page=${perPage}`;

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        queryParams += `&filter[${key}]=${value}`;
      }
    }

    const URL = `${URL_API}/v1/bills${queryParams}`;
    return this.http.get(URL, { headers: headers });
  }

  // Crear Factura
  createFactura(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let url = URL_API + '/v1/bills/validate';
    return this.http.post(url, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  // // Descargar Factura
  descargarFactura(number: any) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let url = URL_API + '/v1/bills/download-pdf/' + number;
    return this.http.get(url, {
      headers: headers,
    });
  }

  verFacturaDian(number: any) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let url = URL_API + '/v1/bills/show/' + number;
    return this.http.get(url, {
      headers: headers,
    });
  }
}
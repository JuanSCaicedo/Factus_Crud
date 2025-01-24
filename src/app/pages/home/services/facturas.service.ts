import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { URL_API } from '../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  private apiUrl = URL_API;
  private token = ''; // Inicialmente vacío, se obtiene al iniciar sesión.

  constructor(private http: HttpClient,
    private authservice: AuthService
  ) { }

  // Listar Facturas
  // listarFacturas() {
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  //   return this.http.get(`${this.apiUrl}/v1/bills`, { headers });
  // }

  listarFacturas(page: number, perPage: number, filters: any = {}) {
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });

    let queryParams = `?page=${page}&per_page=${perPage}`;

    // Agregar los filtros a la URL si están presentes
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        queryParams += `&filter[${key}]=${value}`;
      }
    }

    const URL = `${URL_API}/v1/bills${queryParams}`;
    return this.http.get(URL, { headers: headers });
  }

  // Crear Factura
  // crearFactura(factura: any) {
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  //   return this.http.post(`${this.apiUrl}/facturas`, factura, { headers });
  // }

  // // Editar Factura
  // editarFactura(id: string, factura: any) {
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  //   return this.http.put(`${this.apiUrl}/facturas/${id}`, factura, { headers });
  // }

  // // Eliminar Factura
  // eliminarFactura(id: string) {
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  //   return this.http.delete(`${this.apiUrl}/facturas/${id}`, { headers });
  // }

  // // Descargar Factura
  // descargarFactura(id: string) {
  //   const headers = new HttpHeaders({ Authorization: `Bearer ${this.token}` });
  //   return this.http.get(`${this.apiUrl}/facturas/${id}/descargar`, {
  //     headers,
  //     responseType: 'blob' // Descargar como archivo
  //   });
  // }
}
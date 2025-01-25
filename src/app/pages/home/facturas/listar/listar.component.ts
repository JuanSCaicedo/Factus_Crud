import { Component } from '@angular/core';
import { FacturasService } from '../../services/facturas.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/service/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-listar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar.component.html',
  styleUrl: './listar.component.css'
})
export class ListarComponent {
  facturas: any[] = [];
  currentPage = 1; // Página actual
  perPage = 10; // Cantidad de registros por página
  totalRecords = 0; // Total de registros
  totalPages: number = 0; // Total de páginas
  searchTerm: string = '';  // Esta variable guardará el texto de búsqueda
  selectedFilter: string = 'names';

  constructor(private facturasService: FacturasService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.listFacturas();
  }

  searchFacturas() {
    const filters = {
      [this.selectedFilter]: this.searchTerm
    };
    this.listFacturas(1, filters);
  }

  onFilterChange() {
    // Reiniciar el campo de búsqueda cuando cambie el filtro
    this.searchFacturas();
  }

  listFacturas(page = 1, filters: any = {}) {
    this.facturasService.listarFacturas(page, this.perPage, filters).subscribe((data: any) => {
      this.facturas = data.data.data;
      this.totalRecords = data.data.pagination.total;
      this.totalPages = Math.ceil(this.totalRecords / this.perPage);
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.listFacturas(newPage);
  }

  limpiarBusqueda() {
    this.searchTerm = '';
    this.listFacturas();
  }

  logout() {
    this.authService.logout();
  }

  descargarFactura(number: string) {
    this.facturasService.descargarFactura(number).subscribe(
      (response: any) => {
        if (response.status === 'OK' && response.data.pdf_base_64_encoded) {
          // Decodificar base64
          const base64Data = response.data.pdf_base_64_encoded;
          const fileName = response.data.file_name;

          // Decodificar el string base64
          const byteCharacters = atob(base64Data);
          const byteArrays = [];

          for (let i = 0; i < byteCharacters.length; i++) {
            byteArrays.push(byteCharacters.charCodeAt(i));
          }

          // Crear el blob con los datos del PDF
          const blob = new Blob([new Uint8Array(byteArrays)], { type: 'application/pdf' });

          // Crear un enlace de descarga
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = fileName;
          link.click();

          Swal.fire({
            title: "Descarga exitosa",
            icon: "success",
            draggable: true
          });
        } else {
          this.toastr.error('Error al descargar el archivo PDF', 'Error');
        }
      },
      (error: any) => {
        console.error(error);
        this.toastr.error('Ocurrió un error al descargar la factura', 'Error');
      }
    );
  }
}

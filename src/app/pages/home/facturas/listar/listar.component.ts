import { Component } from '@angular/core';
import { FacturasService } from '../../services/facturas.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/service/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
}

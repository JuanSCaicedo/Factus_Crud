import { Component } from '@angular/core';
import { FacturasService } from '../../services/facturas.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/service/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private facturasService: FacturasService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.listFacturas();
  }

  searchFacturas() {
    // Llamar al servicio con el término de búsqueda
    this.listFacturas(1, { names: this.searchTerm });
  }

  listFacturas(page = 1, filters: any = {}) {
    this.facturasService.listarFacturas(page, this.perPage, filters).subscribe((data: any) => {
      this.facturas = data.data.data;
      this.totalRecords = data.data.pagination.total; // Total de registros
      this.totalPages = Math.ceil(this.totalRecords / this.perPage);
      console.log(this.totalRecords);
    });
  }

  changePage(newPage: number) {
    this.currentPage = newPage;
    this.listFacturas(newPage);
  }

  logout() {
    this.authService.logout();
  }
}

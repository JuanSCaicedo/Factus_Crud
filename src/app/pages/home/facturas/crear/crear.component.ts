import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2'
import { FacturasService } from '../../services/facturas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent {

  // Arreglo de productos ficticios con nombres reales
  productos = [
    {
      code_reference: "00001",
      name: "Arroz",
      quantity: 5,
      discount: 1000,
      discount_rate: 5,
      price: 20000,
      tax_rate: "19.00",
      unit_measure_id: 70,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [
        { code: "06", withholding_tax_rate: "7.00" },
        { code: "05", withholding_tax_rate: "15.00" }
      ],
      selected: false // Agregar propiedad de selección
    },
    {
      code_reference: "00002",
      name: "Zapatos",
      quantity: 2,
      discount: 5000,
      discount_rate: 10,
      price: 150000,
      tax_rate: "19.00",
      unit_measure_id: 71,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [
        { code: "06", withholding_tax_rate: "5.00" },
        { code: "05", withholding_tax_rate: "10.00" }
      ],
      selected: false // Agregar propiedad de selección
    },
    {
      code_reference: "00003",
      name: "Camisa",
      quantity: 3,
      discount: 3000,
      discount_rate: 10,
      price: 50000,
      tax_rate: "19.00",
      unit_measure_id: 72,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [
        { code: "06", withholding_tax_rate: "4.00" },
        { code: "05", withholding_tax_rate: "12.00" }
      ],
      selected: false // Agregar propiedad de selección
    },
    {
      code_reference: "00004",
      name: "Pantalón",
      quantity: 2,
      discount: 4000,
      discount_rate: 5,
      price: 80000,
      tax_rate: "19.00",
      unit_measure_id: 73,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [
        { code: "06", withholding_tax_rate: "6.00" },
        { code: "05", withholding_tax_rate: "10.00" }
      ],
      selected: false // Agregar propiedad de selección
    },
    {
      code_reference: "00005",
      name: "Leche",
      quantity: 10,
      discount: 0,
      discount_rate: 0,
      price: 2000,
      tax_rate: "5.00",
      unit_measure_id: 74,
      standard_code_id: 1,
      is_excluded: 1,
      tribute_id: 1,
      withholding_taxes: [],
      selected: false // Agregar propiedad de selección
    },
    {
      code_reference: "00006",
      name: "Pan",
      quantity: 20,
      discount: 500,
      discount_rate: 5,
      price: 1000,
      tax_rate: "19.00",
      unit_measure_id: 75,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [],
      selected: false // Agregar propiedad de selección
    },
    {
      code_reference: "00007",
      name: "Azúcar",
      quantity: 4,
      discount: 800,
      discount_rate: 10,
      price: 8000,
      tax_rate: "19.00",
      unit_measure_id: 76,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [
        { code: "06", withholding_tax_rate: "3.00" }
      ],
      selected: false // Agregar propiedad de selección
    },
    {
      code_reference: "00008",
      name: "Aceite",
      quantity: 6,
      discount: 1500,
      discount_rate: 5,
      price: 12000,
      tax_rate: "19.00",
      unit_measure_id: 77,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [],
      selected: false // Agregar propiedad de selección
    },
    {
      code_reference: "00009",
      name: "Jabón",
      quantity: 15,
      discount: 2000,
      discount_rate: 10,
      price: 5000,
      tax_rate: "19.00",
      unit_measure_id: 78,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [],
      selected: false // Agregar propiedad de selección
    },
    {
      code_reference: "00010",
      name: "Detergente",
      quantity: 7,
      discount: 3500,
      discount_rate: 7,
      price: 25000,
      tax_rate: "19.00",
      unit_measure_id: 79,
      standard_code_id: 1,
      is_excluded: 0,
      tribute_id: 1,
      withholding_taxes: [],
      selected: false // Agregar propiedad de selección
    }
  ];

  reference_code: any;
  observation: any;
  customer_identification: any;
  customer_company: any;
  customer_type: any;
  customer_names: any;
  customer_address: any;
  customer_email: any;
  customer_phone: any;
  payment_method: any;

  constructor(private authService: AuthService,
    private facturasService: FacturasService,
    private toastr: ToastrService,
  ) { }

  getSelectedProducts() {
    return this.productos.filter(product => product.selected);
  }

  onSubmit() {
    if (!this.reference_code || !this.observation || !this.customer_identification || !this.customer_company || !this.customer_type || !this.customer_names || !this.customer_address || !this.customer_email || !this.customer_phone || !this.payment_method) {
      Swal.fire({
        icon: "error",
        title: "Validación...",
        text: "Necesitas ingresar todos los campos!",
      });
      return;
    }

    let data = {
      document: "01",  // Cambié de número a string
      numbering_range_id: 8,
      reference_code: this.reference_code,
      observation: this.observation,
      payment_method_code: this.payment_method,
      customer: {
        identification: this.customer_identification,  // Asegúrate de que sea una cadena
        dv: "3",  // Asegúrate de que el valor sea una cadena
        company: this.customer_company || "",  // Si es opcional, se debe enviar como string vacío si está vacío
        trade_name: "",  // Si está vacío, debe ser un string vacío
        identification_document_id: this.customer_type,  // Asegúrate de que este valor también sea una cadena
        names: this.customer_names,
        address: this.customer_address,
        email: this.customer_email,
        phone: this.customer_phone,
        legal_organization_id: "2",  // Asegúrate de que sea cadena
        tribute_id: "21",  // Asegúrate de que sea cadena
        municipality_id: "980",  // Asegúrate de que sea cadena
      },
      items: [
        ...this.getSelectedProducts()  // Asegúrate de que `getSelectedProducts()` devuelva un arreglo de productos con la estructura correcta
      ]
    };

    console.log('Datos a enviar:', data);

    this.facturasService.createBrands(data).subscribe((resp: any) => {
      console.log(resp);

      this.reference_code = "";
      this.observation = "";
      this.customer_identification = "";
      this.customer_company = "";
      this.customer_type = "";
      this.customer_names = "";
      this.customer_address = "";
      this.customer_email = "";
      this.customer_phone = "";
      this.payment_method = "";
      this.getSelectedProducts().forEach(product => product.selected = false);

      Swal.fire({
        title: resp.message,
        icon: "success",
        draggable: true
      });
    }, (error: any) => {
      console.log(error);
      this.toastr.error('API Response - Comuniquese con el desarrollador', error.error.message || error.message);
    });
  }

  logout() {
    this.authService.logout();
  }
}

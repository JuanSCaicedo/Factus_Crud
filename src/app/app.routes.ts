import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard } from './pages/auth/service/auth.guard';
import { CrearComponent } from './pages/home/facturas/crear/crear.component';
import { ListarComponent } from './pages/home/facturas/listar/listar.component';
import { EditarComponent } from './pages/home/facturas/editar/editar.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'ver-facturas',
        canActivate: [authGuard],
        component: ListarComponent
    },
    {
        path: 'crear-factura',
        canActivate: [authGuard],
        component: CrearComponent
    },
    {
        path: 'editar-factura/:id',
        canActivate: [authGuard],
        component: EditarComponent
    }
];

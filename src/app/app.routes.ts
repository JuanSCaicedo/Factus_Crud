import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { authGuard } from './pages/auth/service/auth.guard';

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
];

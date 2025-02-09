import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class PermisionAuth {

    constructor(
        public authService: AuthService,
        public router: Router,
    ) { }

    canActivate(): boolean {

        if (!this.authService.token) {
            this.router.navigateByUrl("/login");
            return false;
        }

        let token = this.authService.token;

        let expiration = (JSON.parse(atob(token.split('.')[1]))).exp;

        if (Math.floor(Date.now() / 1000) >= expiration) {
            this.authService.logout();
            return false;
        }

        return true;
    }
}

export const authGuard: CanActivateFn = (route, state) => {
    return inject(PermisionAuth).canActivate();
};
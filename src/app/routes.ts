import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CandidatosComponent } from './components/candidatos/candidatos.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminConsoleComponent } from './components/admin-console/admin-console.component';
import { CertificateComponent } from './components/certificate/certificate.component';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin/admin.guard';

const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'ingresar', component: IngresarComponent },
    { path: 'certificate', component: CertificateComponent, canActivate: [ AuthGuard ] },
    { path: 'candidatos', component: CandidatosComponent, canActivate: [ AuthGuard ] },
    { path: 'resultados', component: ResultadosComponent, canActivate: [ AuthGuard ] },
    { path: 'console', component: AdminConsoleComponent, canActivate: [ AdminGuard ] },
    { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);

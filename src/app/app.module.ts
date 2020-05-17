import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CandidatosComponent } from './components/candidatos/candidatos.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminConsoleComponent } from './components/admin-console/admin-console.component';

import { APP_ROUTING } from './routes';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common'

// Services
import { HttpClientModule } from '@angular/common/http';
import { BallotService } from './services/ballot/ballot.service';
import { CertificateComponent } from './components/certificate/certificate.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    CandidatosComponent,
    ResultadosComponent,
    IngresarComponent,
    AdminComponent,
    AdminConsoleComponent,
    CertificateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    APP_ROUTING
  ],
  providers: [BallotService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

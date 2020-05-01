import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CandidatosComponent } from './components/candidatos/candidatos.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { IngresarComponent } from './components/ingresar/ingresar.component';
import { VotarComponent } from './components/votar/votar.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddCandidatesComponent } from './components/add-candidates/add-candidates.component';
import { AdminConsoleComponent } from './components/admin-console/admin-console.component';

import { APP_ROUTING } from './routes';
import { FormsModule } from '@angular/forms';

// Services
import { HttpClientModule } from '@angular/common/http';
import { BallotService } from './services/ballot/ballot.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    CandidatosComponent,
    RegistroComponent,
    ResultadosComponent,
    IngresarComponent,
    VotarComponent,
    AdminComponent,
    AddCandidatesComponent,
    AdminConsoleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    APP_ROUTING
  ],
  providers: [BallotService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { APP_ROUTING } from './routes';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CandidatosComponent } from './components/candidatos/candidatos.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { HerramientaComponent } from './components/herramienta/herramienta.component';

// Services
import { BallotService } from './services/ballot/ballot.service';
import { IngresarComponent } from './components/ingresar/ingresar.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VotarComponent } from './components/votar/votar.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    CandidatosComponent,
    RegistroComponent,
    ResultadosComponent,
    HerramientaComponent,
    IngresarComponent,
    VotarComponent
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

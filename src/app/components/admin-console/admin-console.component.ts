import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';
import { BallotModel } from '../../models/ballot.model';
import { AuthService } from '../../services/auth/auth.service';
import { BallotService } from '../../services/ballot/ballot.service';
import { Router } from '@angular/router';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnInit {

  steps = 1;
  stepsToken: any;

  ballotObject: BallotModel = new BallotModel();
  candidate: string;
  ballotTime: number;

  candidates = [];

  constructor(private auth: AuthService,
    private ballot: BallotService,
    private router: Router) {
    this.ballot.getAccount();
    this.leerToken();
  }

  ngOnInit() {
  }

  async onCreateBallot(form: NgForm) {

    if (form.invalid) {
      return;
    }

    this.ballot.getAccount();

    Swal.fire({
      title: 'Creando votación',
      text: 'Espere un momento...',
    });

    Swal.showLoading();
    await this.ballot.createBallot(this.ballotObject.name, this.ballotObject.proposal)
      .then((ballot) => {
        console.log(ballot);
        Swal.close();
        this.steps++;
        localStorage.setItem('steps', this.steps + '');
      })
      .catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error en la creación del contrato'
        });
        console.log(error);
      });

  }

  onLoadVoters() {
    Swal.fire({
      title: 'Cargando usuarios',
      text: 'Espere un momento...',
    });

    Swal.showLoading();

    setTimeout(() => {
      this.auth.register();
      Swal.close();
    }, 1000);
    this.steps++;
    localStorage.setItem('steps', this.steps + '');
  }

  async onCreateCandidate(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.ballot.getAccount();

    Swal.fire({
      title: 'Creando candidato',
      text: 'Espere un momento...',
    });

    Swal.showLoading();

    await this.ballot.addCandidate(this.candidate)
      .then((candidate) => {
        console.log(candidate);
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Candidato creado',
          text: 'Candidato [' + this.candidate.toUpperCase() + '] creado con éxito'
        });
        this.candidates.push(this.candidate);
        console.log(this.candidates.length);

      }).catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error creando candidato'
        });
        console.log(error);
      });
  }

  finishCandidates() {
    if (this.candidates.length > 1) {
      console.log(this.candidates.length);
      this.steps++;
      localStorage.setItem('steps', this.steps + '');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Pocos candidatos',
        text: 'Necesita al menos dos candidatos en la lista'
      });
    }
  }

  async onStartBallot(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.ballot.getAccount();
    Swal.fire({
      title: 'Iniciando votación',
      text: 'Espere un momento...',
    });

    this.steps++;
    localStorage.setItem('steps', this.steps + '');

    await this.ballot.startBallot(this.ballotTime)
      .then((ballot) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Votación inicializada',
          text: 'Votación iniciada con [' + this.ballotTime + '] minutos'
        });
      }).catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error inicializando la votación...'
        });
      });


  }

  async onEndBallot() {

    this.ballot.getAccount();

    Swal.fire({
      title: 'Finalizando votación',
      text: 'Espere un momento...',
    });

    setTimeout(() => {
      Swal.showLoading();
      this.steps++;
      localStorage.setItem('steps', this.steps + '');
    }, 2000);

    await this.ballot.endBallot()
      .then((finish) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Votación inicializada',
          text: 'Votación Finalizada'
        });


      }).catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error inicializando la votación...'
        });
        console.log(error);
      });


  }

  async onShowBallotResults() {

    this.ballot.getAccount();

    Swal.fire({
      title: 'Haciendo conteo',
      text: 'Obteniendo reultado de la votación...',
    });

    Swal.showLoading();

    await this.ballot.getFinalResult()
      .then((result) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Resultados obtendios',
          text: 'Puede ver los resultados de la votación ahora mismo'
        });
        this.steps++;
        localStorage.setItem('steps', this.steps + '');
      })
      .catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener los resultados...'
        });
        console.log(error);
      });

  }

  async onShowBallotWinner() {

    this.ballot.getAccount();

    Swal.fire({
      title: 'Obteniendo ganador',
      text: 'Obteniendo ganador de la votación...',
    });

    Swal.showLoading();

    await this.ballot.getFinalResult()
      .then((result) => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Ganador',
          text: 'Puede ver el/la ganador de la votación ahora mismo'
        });
        this.steps++;
        localStorage.setItem('steps', this.steps + '');
      })
      .catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener el ganador...'
        });
        console.log(error);
      });

  }

  logout() {
    if (this.stepsToken > 5) {
      this.auth.logout();
      localStorage.removeItem('steps');

      this.router.navigateByUrl('/admin');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: 'Debe finalizar la configuración de la jornada electoral'
      });
    }
  }

  stepState(): number {
    return this.steps;
  }

  async deposit(value) {
    await this.ballot.depositBalance(value);
  }

  async withdraw() {
    await this.ballot.withdraw();
  }

  async getContractBalance() {

    const balance = await this.ballot.getContractBalance();
    Swal.fire({
      title: 'Balance del contrato',
      text: balance + ''
    });
  }


  leerToken() {
    if (localStorage.getItem('steps')) {
      this.stepsToken = localStorage.getItem('steps');
      this.steps = this.stepsToken;
    } else {
      this.stepsToken = '';
      this.steps = 1;
    }
    return this.stepsToken;
  }
}

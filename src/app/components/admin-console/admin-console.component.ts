import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BallotModel } from '../../models/ballot.model';
import { AuthService } from '../../services/auth/auth.service';
import { BallotService } from '../../services/ballot/ballot.service';
import { VotersService } from '../../services/voters/voters.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnInit {

  ballotObject: BallotModel = new BallotModel();
  steps = 1;
  stepsToken: any;
  timeToken: any;
  time = 0;
  ballotTime: number;

  ballotEndTime: Date;
  allowToEnd: boolean;

  candidates = [];
  resultados = [];
  showResults: boolean;

  candidate: string;
  totalVoters: number;
  totalDoneVotes: number;

  constructor(private auth: AuthService,
    private ballot: BallotService,
    private router: Router,
    private voterService: VotersService) {

    this.leerToken();
    this.leerTokenTime();
  }

  ngOnInit() {
  }

  async onCreateBallot(form: NgForm) {

    if (form.invalid) {
      return;
    }

    // this.ballot.getAccount();

    Swal.fire({
      title: 'Creando votación',
      text: 'Espere un momento...',
    });

    Swal.showLoading();
    await this.ballot.createBallot(this.ballotObject.name, this.ballotObject.proposal)
      .then(() => {
        Swal.close();
        this.steps++;
        localStorage.setItem('steps', this.steps + '');
        this.voterService.postSetupStep(this.steps);
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
    this.voterService.postSetupStep(this.steps);
  }

  async onCreateCandidate(form: NgForm) {
    if (form.invalid) {
      return;
    }

    for (let i = 0; i < this.candidates.length; i++) {
      if (this.candidate.toUpperCase() === this.candidates[i]) {
        Swal.fire({
          icon: 'error',
          title: 'Se encontró una coincidencia',
          text: 'No puede cargar dos candidatos con el mismo nombre'
        });
        return;
      }
    }

    Swal.fire({
      title: 'Creando candidato',
      text: 'Espere un momento...',
    });

    Swal.showLoading();

    await this.ballot.addCandidate(this.candidate.toUpperCase())
      .then(() => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Candidato creado',
          text: 'Candidato [' + this.candidate + '] creado con éxito'
        });
        this.candidates.push(this.candidate.toUpperCase());

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
      this.steps++;
      localStorage.setItem('steps', this.steps + '');
      this.voterService.postSetupStep(this.steps);
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

    // this.ballot.getAccount();
    Swal.fire({
      title: 'Iniciando votación',
      text: 'Espere un momento...',
    });

    Swal.showLoading();

    await this.ballot.startBallot(this.ballotTime)
      .then(() => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Votación inicializada',
          text: 'Votación iniciada con [ ' + this.ballotTime + ' minutos ]'
        });
        this.steps++;
        localStorage.setItem('steps', this.steps + '');
        this.voterService.postSetupStep(this.steps);
        this.showBallotEndTime();

      }).catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error inicializando la votación...'
        });
      });
  }

  showBallotEndTime() {

    this.ballotEndTime = new Date();
    this.ballotEndTime.setTime(this.ballotEndTime.getTime() + (this.ballotTime * 60000));

    const day = this.ballotEndTime.getDate();
    const month = this.ballotEndTime.getMonth() + 1;
    const year = this.ballotEndTime.getFullYear();
    const hours = this.ballotEndTime.getHours();
    const minutes = this.ballotEndTime.getMinutes();
    const seconds = this.ballotEndTime.getSeconds();

    const formatDate = `Termina el día: ${day}-${month}-${year} a las ${hours}:${minutes}:${seconds}`;

    Swal.fire({
      icon: 'success',
      title: 'Finalización de la votación',
      text: formatDate
    });

    localStorage.setItem('time', this.ballotEndTime.getTime() + '');
    this.time = this.ballotEndTime.getTime();
    this.voterService.postBallotLeftTime(this.ballotEndTime.getTime());

  }

  verifyEndTime() {

    const currentDate = new Date();
    const currentDateMilliseconds = currentDate.getTime();

    if (localStorage.getItem('time')) {

      const difference = this.time - currentDateMilliseconds;

      if (difference > 0) {

        const timeMessage = 'Aun quedan ' + Math.ceil(difference / 60000) + ' minutos de votación';
        Swal.fire({
          icon: 'info',
          title: 'Espera un momento',
          text: timeMessage + ''
        });

      } else {
        this.allowToEnd = true;
      }
    }

  }

  async onEndBallot() {

    Swal.fire({
      title: 'Finalizando votación',
      text: 'Espere un momento...',
    });

    Swal.showLoading();

    await this.ballot.endBallot()
      .then(() => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Fin de la jornada',
          text: 'Votación Finalizada'
        });
        this.steps++;
        localStorage.setItem('steps', this.steps + '');
        this.voterService.postSetupStep(this.steps);
        this.voterService.postBallotEndConfirm();

      }).catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error finalizando la votación...'
        });
        console.log(error);
      });
  }

  async onShowBallotResults() {

    Swal.fire({
      title: 'Haciendo conteo',
      text: 'Obteniendo reultado de la votación...',
    });
    Swal.showLoading();

    await this.ballot.getTotalVoters()
      .then((totalVoter) => {
        this.totalVoters = totalVoter.toNumber();
      }).catch((err) => {
        console.error(err);
      });

    await this.ballot.getTotalDoneVotes()
      .then((votesDone) => {
        this.totalDoneVotes = votesDone.toNumber();
      }).catch((err) => {
        console.error(err);
      });

    await this.ballot.getCandidates()
      .then((result: any[]) => {
        this.resultados = result;
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Resultados obtendios',
          text: 'Puede ver los resultados de la votación ahora mismo'
        });
        this.showResults = true;

        this.steps++;
        localStorage.setItem('steps', this.steps + '');
        this.voterService.postSetupStep(this.steps);
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

  logout() {
    if (this.steps >= 5) {

      Swal.fire({
        icon: 'warning',
        title: 'Resetear consola',
        text: 'Una vez hayas salido se reiniciará el Contrato de votaciones',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, salir'
      }).then(async (result) => {
        if (result.value) {
          this.auth.logout();
          this.router.navigateByUrl('/admin');
          localStorage.removeItem('steps');
          localStorage.removeItem('time');
          this.voterService.postSetupStep(1);
        }
      });

    } else if (this.steps < 5) {
      Swal.fire({
        icon: 'info',
        title: 'Vuelve pronto',
        text: 'Recuerda que debes seguir configurando el proceso electoral hasta su finalización'
      });
      this.auth.logout();
      this.router.navigateByUrl('/admin');

    } else {
      Swal.fire({
        icon: 'error',
        title: 'ERROR',
        text: 'Debe finalizar la configuración de la jornada electoral'
      });
    }
  }

  stepState() {
    return this.steps;
  }

  leerToken() {
    if (localStorage.getItem('steps')) {
      this.stepsToken = localStorage.getItem('steps');
      this.steps = this.stepsToken;

    } else if (!localStorage.getItem('steps')) {

      this.voterService.getSetupStep()
      .subscribe((steps: number) => {
        this.steps = steps;
      }, (error) => console.log(error));

    } else {
      this.stepsToken = '';
      this.steps = 1;
    }
    return this.steps;
  }

  leerTokenTime() {
    if (localStorage.getItem('time')) {
      this.timeToken = localStorage.getItem('time');
      this.time = this.timeToken;
    } else {
      this.timeToken = '';
      this.time = 0;
    }
    return this.timeToken;
  }

}

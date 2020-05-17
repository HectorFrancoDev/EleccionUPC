import { Component, OnInit } from '@angular/core';
import { BallotService } from '../../services/ballot/ballot.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { VotersService } from '../../services/voters/voters.service';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent implements OnInit {

  private candidates: Candidato[] = [];
  private estado: boolean;
  private voteFirst = 'false';
  private voteTime = false;
  private canVote = false;
  private dateEnd: Date;
  private time;

  constructor(private ballot: BallotService,
    private auth: AuthService,
    private router: Router,
    private voterService: VotersService) {

    this.getVoter();

    this.voterService.getBallotLeftTime()
      .subscribe((resp: any) => {
        this.time = resp;
        this.dateEnd = new Date();
        this.dateEnd.setTime(this.time);
        this.verifyEndTime(this.time);
      }, (error) => {
        Swal.fire({
          icon: 'warning',
          title: 'Espera',
          text: 'Espera hasta que la votación inicie'
        });
      });

    if (this.leerToken() === 'true') {
      Swal.fire({
        icon: 'warning',
        title: 'Ya votaste',
        text: 'Ya realizaste tu voto, no puedes volver a votar.....'
      });
    }

  }

  ngOnInit() { }

  verifyEndTime(time: number) {

    const currentDate = new Date();
    const currentDateMilliseconds = currentDate.getTime();
    const difference = time - currentDateMilliseconds;

    if (this.voteFirst === 'true') {

      Swal.fire({
        icon: 'warning',
        title: 'Ya votaste',
        text: 'Ya realizaste tu voto, no puedes volver a votar.....'
      });

    } else if (difference > 30000) {

      const timeMessage = 'Tienes ' + Math.ceil(difference / 60000) + ' minutos para votar';
      Swal.fire({
        icon: 'info',
        title: 'Haz tu voto',
        text: timeMessage + ''
      });
      this.voteTime = true;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Votación acabada',
        text: 'No pueder votar, el tiempo se acabó'
      });
    }
  }

  async getVoter() {
    await this.ballot.getVoterState()
      .then((voteDone: boolean) => {
        if (voteDone) {
          this.voteFirst = voteDone + '';
          localStorage.setItem('voted', this.voteFirst);
          this.leerToken();
          Swal.fire({
            icon: 'warning',
            title: 'Ya votaste',
            text: 'Ya realizaste tu voto, no puedes volver a votar'
          });
        }
      }).catch((err) => {
        console.log(err);
      });
  }

  checkEmailVoter() {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      this.auth.getUserState(userToken)
        .subscribe((user: any) => {
          const email = user.users[0].email;
          this.addVoter(email);
        });
    } else {
      console.log('No logueado');
    }
  }

  async addVoter(email) {
    await this.ballot.addVoter(email)
      .then((vote) => {
        Swal.fire({
          icon: 'success',
          title: 'Puedes Votar',
          text: 'Tienes derecho a votar'
        });
        this.estado = true;
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'No puedes votar',
          text: 'No tienes derecho a votar'
        });
        console.log(error);
      });
  }

  async getCandidates() {
    await this.ballot.getCandidates()
      .then((candidates: Candidato[]) => {
        this.candidates = candidates;

        if (this.candidates.length !== 0) {
          this.canVote = true;
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Sin candidatos',
            text: 'No hay candidatos disponibles',
          });
        }

      }).catch((error) => {
        console.log(error);
      });
  }

  confirmVoteBeforeDo(index: number) {
    Swal.fire({
      icon: 'warning',
      title: 'Confirma tu elección',
      text: 'Una vez hayas votado por no podrás cambiar tu elección',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, votar'
    }).then(async (result) => {
      if (result.value) {
        await this.doVote(index);
      }
    });
  }

  async doVote(index: number) {
    const candidato = this.candidates[index].name;

    Swal.fire({
      icon: 'info',
      title: 'Votando',
      text: 'Realizando voto',
    });

    Swal.showLoading();

    await this.ballot.doVote(index)
      .then(() => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Voto realizado',
          text: 'Votó por "' + candidato.toUpperCase() + '"'
        });
        this.voteFirst = 'true';
        this.candidates = [];
        localStorage.setItem('voted', this.voteFirst);

        const userToken = localStorage.getItem('token');
        if (userToken) {
          this.auth.getUserState(userToken)
            .subscribe((user: any) => {
              const email = user.users[0].email;
              const dateIssued = new Date();
              this.voterService.postPeopleWhoVoted(email, dateIssued);
            });
        } else {
          console.log('No logueado');
        }

        this.router.navigateByUrl('/certificate');
      })
      .catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error en el voto',
          text: 'Error al realizar el voto'
        });
        console.log(error);
      });

  }

  leerToken() {
    if (localStorage.getItem('voted')) {
      this.voteFirst = localStorage.getItem('voted');
    } else {
      this.voteFirst = 'false';
    }
    return this.voteFirst;
  }

}

export interface Candidato {
  name: string;
}

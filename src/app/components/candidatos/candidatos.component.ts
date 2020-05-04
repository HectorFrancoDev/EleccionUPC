import { Component, OnInit } from '@angular/core';
import { BallotService } from '../../services/ballot/ballot.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrls: ['./candidatos.component.css']
})
export class CandidatosComponent implements OnInit {

  candidates = [];
  estado: boolean;

  constructor(private ballot: BallotService,
    private auth: AuthService,
    private router: Router) {

  }

  ngOnInit() {
  }

  checkEmailVoter() {
    const userToken = localStorage.getItem('token');
    if (userToken !== '') {
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
      .then((candidates: any) => {
        this.candidates = candidates;
      }).catch((error) => {
        console.log(error);
      })
  }

  async doVote(index: number) {

    this.ballot.getAccount();

    Swal.fire({
      icon: 'info',
      title: 'Votando',
      text: 'Realizando voto',
    });

    Swal.showLoading();

    await this.ballot.doVote(index)
      .then((vote) => {
        console.log(vote);
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Votación inicializada',
          text: 'Votación Finalizada'
        });

        this.router.navigateByUrl('/resultados');

      })
      .catch((error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error en el voto.'
        });
        console.log(error);
      });

  }

}

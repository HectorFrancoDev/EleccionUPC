import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';
import { BallotModel } from '../../models/ballot.model';
import { AuthService } from '../../services/auth/auth.service';
import { BallotService } from '../../services/ballot/ballot.service';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnInit {

  steps = 1;

  ballotObject: BallotModel = new BallotModel();
  candidate: string;
  ballotTime: number;

  constructor(private auth: AuthService, private ballot: BallotService) { }

  ngOnInit() {
  }

  onCreateBallot(form: NgForm) {

    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Creando votación',
      text: 'Espere un momento...',
    });

    // Swal.showLoading();

    this.steps++;

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
  }

  onCreateCandidate(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Creando Candidato',
      text: 'Espere un momento...',
    });

    // Swal.showLoading();
  }

  finishCandidates() {
    this.steps ++;
  }

  onStartBallot(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      title: 'Iniciando votación',
      text: 'Espere un momento...',
    });

    // Swal.showLoading();

    this.steps++;
  }


  onFinishBallot() {
    Swal.fire({
      title: 'Finalizando votación',
      text: 'Espere un momento...',
    });

    // Swal.showLoading();

    this.steps++;
  }

  async deposit() {
    await this.ballot.depositBalance();
  }

  async withdraw() {
    await this.ballot.withdraw();
  }

  onShowBallotResults() {

  }

  onShowBallotWinner() {

  }


  stepState(): number {
    return this.steps;
  }

}

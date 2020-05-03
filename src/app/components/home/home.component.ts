import { Component, OnInit } from '@angular/core';
import { BallotService } from '../../services/ballot/ballot.service';
import { AuthService } from '../../services/auth/auth.service';
import { VotersService } from '../../services/voters/voters.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  web3: any;
  ballotContract: any;
  ballotFunction: any;


  candidates: any[];

  constructor(private ballot: BallotService,
              private auth: AuthService,
              private voterService: VotersService) {

  }

  ngOnInit() {

  }

  loadVoters() {
    this.auth.register();
  }

  async getContractBalance() {

    const balance = await this.ballot.getContractBalance();
    Swal.fire({
      title: 'Hola',
      text: balance + ''
    });
  }

}

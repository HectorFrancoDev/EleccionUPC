import { Component, OnInit } from '@angular/core';
import { BallotService } from '../../services/ballot/ballot.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  web3: any;
  ballotContract: any;
  ballotFunction: any;

  account: any;

  candidates: any[];

  constructor(private ballot: BallotService, private auth: AuthService) {
    this.getAccount();
    //this.getCandidates();
  }

  ngOnInit() {

  }

  async getAccount() {
    this.account = await this.ballot.getAccount();
  }

  registerExample() {
    this.auth.registerExample()
      .subscribe((token: any) => {
        console.log(token);
        this.auth.sendEmailVerification(token.idToken)
          .subscribe((response: any) => {
            console.log(response);
          }, (error) => console.log(error));
      }, (error) => console.log(error));
  }

}

/* async getCandidates() {
   await this.ballot.onLoad();
   this.ballot.getCandidates()
     .then((candidates) => {
       this.candidates = candidates;
     })
     .catch((error) => console.log(error));
 }

 async createBallot() {

   await this.ballot.createBallot('Prueba', 'Bonita', this.account)
     .then((contract) => console.log(contract))
     .catch((error) => console.log(error));
 }

 async getAccount() {
   await this.ballot.onLoad()
     .then((async (web3: any) => this.account = (await web3.eth.getAccounts())[0].toString()))
     .catch(async (error) => console.error(error));

   console.log(this.account);
 }

} */

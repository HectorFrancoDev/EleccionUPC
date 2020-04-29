import { Component, OnInit } from '@angular/core';
import { BallotService } from '../../services/ballot/ballot.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  constructor(private ballot: BallotService) {
    //this.initAndDisplayAccount();
  }

  ngOnInit() {
  }

  /*addCandidate() {
    this.ballot.addCandidate('Pedro');
  }*/

  /*initAndDisplayAccount = () => {
    const that = this;
    this.ballot.getAccountInfo().then(function (acctInfo: any) {
      that.transferFrom = acctInfo.fromAccount;
      that.balance = acctInfo.balance;
    }).catch(function (error) {
      console.log(error);
    });

  };*/

}

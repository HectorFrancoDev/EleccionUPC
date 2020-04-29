import { Injectable } from '@angular/core';
import getWeb3 from '../../../../getContract/getWeb3';
import BallotContract from '../../../../getContract/Ballot';

@Injectable({
  providedIn: 'root'
})
export class BallotService {

  web3: any;
  ballotContract: any;

  account: any;
  balance: any;

  constructor() {
    this.onLoad();
  }

  async onLoad() {
    this.web3 = await getWeb3();
    this.ballotContract = await BallotContract(this.web3.currentProvider);

    console.log(this.ballotContract.createBallot);

    const account = (await this.web3.eth.getAccounts())[0];
  }

  async state(account: any, balance: any ) {
    this.account = account;
    this.balance = balance;
  }

}

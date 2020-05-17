import { Injectable, OnInit } from '@angular/core';
import getWeb3 from '../../../getContract/getWeb3';
import getAccount from '../../../getContract/getAccount';
import BallotContract from '../../../getContract/Ballot';
import { BallotFunctions } from '../../../getContract/BallotFunctions';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})

export class BallotService {

  web3: any;
  ballotContract: any;
  ballotFunction: any;
  account: any;

  constructor() {

    getAccount().then((account) => {
      this.account = account;
    }).catch((err) => {
      console.log(err);
    });

    this.onLoad();
  }

  async onLoad() {

    try {
      this.web3 = await getWeb3();
      this.ballotContract = await BallotContract(this.web3);
      this.ballotFunction = new BallotFunctions(this.ballotContract);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Cambiar a la red de RINKEBY',
        text: 'La votación solo podrá efectuarse en esa red'
      });
      console.log(error);
    }
  }

  async createBallot(_name: string, _proposal: string) {
    return (await this.ballotFunction.createBallot(_name, _proposal, this.account));
  }

  async getBallotState() {
    return (await this.ballotFunction.getBallotState());
  }

  async addCandidate(_name: string) {
    return (await this.ballotFunction.addCandidate(_name, this.account));
  }

  async addVoter(email: string) {
    return (await this.ballotFunction.addVoter(email, this.account));
  }

  async startBallot(durationMinutes: number) {
    return (await this.ballotFunction.startBallot(durationMinutes, this.account));
  }

  async doVote(index: number) {
    return (await this.ballotFunction.doVote(index, this.account));
  }

  async endBallot() {
    return (await this.ballotFunction.endBallot(this.account));
  }

  async getFinalResult() {
    return (await this.ballotFunction.getFinalResult(this.account));
  }

  async getCandidates() {
    return (await this.ballotFunction.getCandidates());
  }

  async getVoterState() {
    return (await this.ballotFunction.getVoterState(this.account));
  }

  async getTotalVoters() {
    return (await this.ballotFunction.getTotalVoters());
  }

  async getTotalDoneVotes() {
    return (await this.ballotFunction.getTotalDoneVotes());
  }

}

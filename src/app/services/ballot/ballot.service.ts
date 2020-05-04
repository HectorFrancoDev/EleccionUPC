import { Injectable } from '@angular/core';
import getWeb3 from '../../../getContract/getWeb3';
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
  app: any;

  constructor() {
  }




  async onLoad() {
    this.web3 = await getWeb3();
    this.ballotContract = await BallotContract(this.web3.currentProvider);
    this.ballotFunction = new BallotFunctions(this.ballotContract);
    this.account = (await this.web3.eth.getAccounts())[0];
    
    this.web3.currentProvider.publicConfigStore.on('update', async function (event) {
      this.account = (await event.selectedAddress.toString());
    });
    return this.web3;
  }

  async getContractBalance() {
    let contractBalance;

    await this.ballotFunction.getContractBalance()
      .then(async (balance: any) => contractBalance = (await balance))
      .catch(async (error) => console.log(error));

    return contractBalance.toNumber();
  }

  async depositBalance(value) {
    return await this.ballotFunction.deposit(this.account, value)
      .then(async (trx: any) => {
        Swal.fire({
          title: 'Transaccion exitosa',
          text: 'Transacción hecha'
        });
      }).catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'ERROR',
          text: 'Fallo la transacción'
        });
      });
  }

  async withdraw() {
    return await this.ballotFunction.withdraw(this.account)
      .then(async (trx) => {
        Swal.fire({
          title: 'Ether recibido',
          text: 'Recibiste un ether para poder votar'
        });
      }).catch(async (error) => {
        Swal.fire({
          icon: 'error',
          title: 'ERROR',
          text: 'Fallo la transacción'
        });
      });
  }

  async getAccount() {

    await this.onLoad()
      .then(async (web3) => {
        this.account = (await web3.eth.getAccounts())[0];

        this.web3.currentProvider.publicConfigStore.on('update', async function (event) {
          this.account = (await event.selectedAddress.toString());
        });
      })
      .catch(async (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Cambiar a la red de RINKEBY',
          text: 'La votación solo podrá efectuarse en esa red'
        });
      });


    return await this.account;
  }

  async createBallot(_name: string, _proposal: string) {
    console.log(this.account);
    return (await this.ballotFunction.createBallot(_name, _proposal, this.account));
  }

  async addCandidate(_name: string) {
    this.getAccount();
    console.log(this.account);
    return (await this.ballotFunction.addCandidate(_name, this.account));
  }

  async addVoter(email: string) {
    this.getAccount();
    return (await this.ballotContract.addVoter(email, this.account));
  }

  async startBallot(durationMinutes) {
    this.getAccount();
    console.log(this.account);
    return (await this.ballotFunction.startBallot(durationMinutes, this.account));
  }

  async endBallot() {
    this.getAccount();
    console.log(this.account);
    return (await this.ballotFunction.endBallot(this.account));
  }

  async getFinalResult() {
    this.getAccount();
    console.log(this.account);
    return (await this.ballotFunction.getFinalResult(this.account));
  }

  async winnerCandidate() {
    this.getAccount();
    console.log(this.account);
    return (await this.ballotFunction.winnerCandidate(this.account));
  }

  async getCandidates() {
    this.getAccount();
    return (await this.ballotFunction.getCandidates(this.account));
  }

  async doVote(index: number) {
    this.getAccount();
    return (await this.ballotFunction.doVote(index, this.account));
  }

  converter(web3) {
    return (value) => web3.utils.fromWei(value.toString(), 'ether');
  }

}

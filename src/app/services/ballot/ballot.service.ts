import { Injectable } from '@angular/core';
import getWeb3 from '../../../../getContract/getWeb3';
import BallotContract from '../../../../getContract/Ballot';
import { BallotFunctions } from '../../../../getContract/BallotFunctions';
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

    this.web3.currentProvider.publicConfigStore
      .on('update', async (event: any) => {

        if (event.selectedAddress) {
          // console.log('existe');
        }

      });

    return await this.web3;
  }

  async getContractBalance() {
    let contractBalance;

    await this.ballotFunction.getContractBalance()
      .then(async(balance: any) => contractBalance = (await balance))
      .catch(async(error) => console.log(error));

    return contractBalance.toNumber();
  }

  depositBalance() {
    this.ballotFunction.deposit()
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
  }

  async getAccount() {
    let account;

    await this.onLoad()
      .then(async (web3) => account = (await web3.eth.getAccounts())[0])
      .catch(async (error) => {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Cambiar a la red de RINKEBY',
          text: 'La votación solo podrá efectuarse en esa red'
        });

      });

    return account.toString();
  }

  async getCandidates() {
    return await this.ballotFunction.getCandidates();
  }

  async createBallot(_name: string, _proposal: string, from: string) {
    return await this.ballotFunction.createBallot(_name, _proposal, from);
  }

  converter(web3) {
    return (value) => web3.utils.fromWei(value.toString(), 'ether');
  }

}

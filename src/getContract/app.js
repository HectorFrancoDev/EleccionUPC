import getWeb3 from './getWeb3';
import BallotContract from './getContract/Ballot';
import { BallotFunctions } from './getContract/BallotFunctions';

export class BallotFunctions {

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
}
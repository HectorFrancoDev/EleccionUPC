import BallotContract from '../build/contracts/Ballot.json';
import contract from 'truffle-contract';

export default async(provider) => {
    const ballot = contract(BallotContract);
    ballot.setProvider(provider);
    let instance = await ballot.deployed();
    return instance;
};

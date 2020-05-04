export class BallotFunctions {

    constructor(contract) {
        this.contract = contract;
    }

    async getBallotInfo() {
        return await this.contract.getBallotInfo();
    }

    async createBallot(_name, _proposal, hola) {
        return (await this.contract.createBallot(_name, _proposal, { from: '0x8a0D461F5944e1c213cBf387f66EcBF0165068F3' }));
    }

    async addCandidate(_name, from) {
        return (await this.contract.addCandidate(_name, { from: '0x8a0D461F5944e1c213cBf387f66EcBF0165068F3' }));
    }

    async startBallot(durationMinutes, from) {
        return (await this.contract.startBallot(durationMinutes, { from: '0x8a0D461F5944e1c213cBf387f66EcBF0165068F3' }));
    }

    async endBallot(from) {
        return (await this.contract.endBallot({ from: '0x8a0D461F5944e1c213cBf387f66EcBF0165068F3' }));
    }

    async getFinalResult(from) {
        return (await this.contract.getFinalResult({ from }));
    }

    async winnerCandidate(from) {
        return (await this.contract.winnerCandidate({ from }));
    }

    async addVoter(email, from) {
        return (await this.contract.addVoter(email));
    }

    async doVote(index, from) {
        return (await this.contract.doVote(index, { from }));
    }

    async getCandidates(from) {
        let total = await this.getTotalCandidates();
        let candidates = [];

        for (let i = 0; i < total; i++) {
            let candidate = await this.contract.candidates(i);
            candidates.push(candidate);
        }

        return this.mapCandidates(candidates);
    }

    async getTotalCandidates() {
        return (await this.contract.getTotalCandidates()).toNumber();
    }


    mapCandidates(candidates) {
        return candidates.map((candidate) => {
            return {
                name: candidate[0],
                voteCount: candidate[1].toNumber()
            }
        })
    }

    async getContractBalance() {
        return await this.contract.getContractBalance();
    }

    async deposit(from, value) {
        return (await this.contract.deposit({ from, value }));
    }

    async withdraw(from) {
        return (await this.contract.withdraw({ from }));
    }

}


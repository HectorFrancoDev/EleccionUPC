export class BallotFunctions {

    constructor(contract) {
        this.contract = contract;
    }

    async getBallotInfo() {
        return (await this.contract.getBallotInfo());
    }

    async createBallot(_name, _proposal, from) {
        return (await this.contract.createBallot(_name, _proposal, { from }));
    }

    async addCandidate(_name, from) {
        return (await this.contract.addCandidate(_name, { from }));
    }

    async startBallot(durationMinutes, from) {
        return (await this.contract.startBallot(durationMinutes, { from }));
    }

    async endBallot(from) {
        return (await this.contract.endBallot({ from }));
    }

    async getFinalResult(from) {
        return (await this.contract.getFinalResult({ from }));
    }

    async winnerCandidate(from) {
        return (await this.contract.winnerCandidate({ from }));
    }

    async addVoter(email, from) {
        return (await this.contract.addVoter(email, { from }));
    }

    async doVote(index, from) {
        return (await this.contract.doVote(index, { from }));
    }

    async getCandidates() {
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


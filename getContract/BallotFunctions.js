export class BallotFunctions {

    constructor(contract) {
        this.contract = contract;
    }

    async getBallotInfo() {
        return await this.contract.getBallotInfo();
    }

    async createBallot(_name, _proposal, from) {
        return (await this.contract.createBallot(_name, _proposal, { from }));
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
}
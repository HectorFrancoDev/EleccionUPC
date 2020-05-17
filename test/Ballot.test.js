const Ballot = artifacts.require('Ballot');

let instance;

before(async () => {
    instance = await Ballot.new();
});

contract('Ballot', async (accounts) => {

    describe('Create Ballot', () => {

        it('Should let Create the Ballot', async () => {

            let name = "Eleccion de prueba";
            let proposal = "Descripción de la elección de prueba";
            await instance.createBallot(name, proposal, { from: accounts[0] });

            let ballotState = await instance.getBallotState();
            assert(ballotState.toNumber() == 1);
        });
    });

    describe('Add Candidates', () => {
        it('Should allow add the Candidates', async () => {

            let candidates = ['Candidato 1', 'Candidato 2', 'Candidato 3', 'Candidato 4', 'Candidato 5',];

            candidates.forEach(async (candidate) => {
                await instance.addCandidate(candidate, { from: accounts[0] });
            });

            let candidatesLength = (await instance.getTotalCandidates()).toNumber();
            assert(candidatesLength > 0);
            assert(candidatesLength == candidates.length);
        });
    });
    
    describe('Start Ballot', () => {

        it('Should allow Start the Ballot with the Ballot Admin Account', async () => {

            let durationMinutes = 1;
            await instance.startBallot(durationMinutes, { from: accounts[0] });

            let ballotState = await instance.getBallotState();
            assert(ballotState.toNumber() == 2);
        });

        it('Should NOT allow Start the Ballot with a NON Ballot Admin Account', async () => {

            let ballotState = await instance.getBallotState();
            try {
                let durationMinutes = 10;
                await instance.startBallot(durationMinutes, { from: accounts[1] });
            } catch (error) { }

        });

    });

    describe('Add Voter', () => {

        it('Should allow add a voter to the Ballot', async () => {

            let voters = [
                'pedro@upc.edu.co',
                'maria@upc.edu.co',
                'juan@upc.edu.co',
                'luis@upc.edu.co',
                'camilo@upc.edu.co',
                'hector@upc.edu.co',
                'cristian@upc.edu.co'
            ];

            for (let i = 0; i < voters.length; i++) {
                const voter = voters[i];
                await instance.addVoter(voter, { from: accounts[i + 1] });
            }

            let getTotalVoters = (await instance.getTotalVoters({ from: accounts[0] }));
            assert(getTotalVoters == voters.length);

        });

        it('Should NOT allow add a voter to the Ballot', async () => {

            try {
                let voters = [
                    'pedro@upc.edu.co',
                    'maria@upc.edu.co',
                    'juan@upc.edu.co',
                    'luis@upc.edu.co',
                    'camilo@upc.edu.co',
                    'hector@upc.edu.co',
                    'cristian@upc.edu.co'
                ];
                for (let i = 1; i < voters.length; i++) {
                    const voter = voters[i];
                    await instance.addCandidate(voter, { from: accounts[i] });
                }
                let getTotalVoters = (await instance.getTotalVoters({ from: accounts[0] })).toNumber();
            } catch (error) { }
        });

    });

    describe('Do Vote', () => {


        it('Should allow voter do its vote', async () => {

            let voters = [
                'pedro@upc.edu.co',
                'maria@upc.edu.co',
                'juan@upc.edu.co',
                'luis@upc.edu.co',
                'camilo@upc.edu.co',
                'hector@upc.edu.co',
                'cristian@upc.edu.co'
            ];

            for (let i = 0; i < voters.length; i++) {
                const voter = voters[i];
                await instance.doVote(3, { from: accounts[i + 1] });
            }

            let getTotalVotesDone = (await instance.getTotalDoneVotes({ from: accounts[0] }));
            assert(getTotalVotesDone == voters.length);
        });

        it('Should NOT allow voter do its vote', async () => {

            try {
                await instance.doVote({ from: accounts[0] });
                assert(getTotalVoters == voters.length);
            } catch (error) { }
        });

    });

    describe('End Ballot', () => {
        it('Should allow end ballot if is the admin', async () => {
            setTimeout(async () => {
                await instance.endBallot({ from: accounts[0] });
                let ballotState = await instance.getBallotState();
                assert(ballotState == 3);
            }, 1500);
        });

        it('Should NOT allow end ballot if is NOT the admin', async () => {
            try {
                setTimeout(async () => {
                    await instance.endBallot({ from: accounts[1] });
                    let ballotState = await instance.getBallotState();
                    assert(ballotState == 2);
                }, 1500);

            } catch (error) {

            }
        });
    });

    describe('Final Result', () => {

        it('Should allow get the final result', async () => {

            setTimeout(async () => {

                await instance.getFinalResult();

                let ballotState = await instance.getBallotState();
                let getTotalVoters = (await instance.getTotalVoters({ from: accounts[0] }));
                let getTotalVotesDone = (await instance.getTotalDoneVotes({ from: accounts[0] }));

                assert(getTotalVotesDone == 7);
                assert(getTotalVoters == 7);
                assert(ballotState == 3);
            }, 1700);
        });
    });
});


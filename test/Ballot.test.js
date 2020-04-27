const Ballot = artifacts.require('Ballot');

let instance;

beforeEach(async() => {

    let name = "Eleccion de prueba";
    let proposal = "Descripción de la elección de prueba";
    let candidate1 = "Candidato Uno";
    let candidate2 = "Candidato Dos";

    instance = await Ballot.new(name, proposal, candidate1, candidate2);
})

contract('Ballot', (accounts) => {

    it('Candidates must be availables', async () => {
        let total = await instance.getTotalCandidates();
        assert(total > 0);
    });

    it('Must exist VOTO EN BLANCO', async () => {
        let total = await instance.getTotalCandidates();
        
        let votoEnBlanco = await instance.candidates[total-1];
        assert("Blanco", votoEnBlanco.name);
    });

    it('Let register new voters', async () => {
        
        let email = "hector@gmail.com";
        let password = "abc123";

        await instance.addVoter(email, password);
        assert(false, voter)
    });

    /*it('Allow start the Ballot', async () => {
        let total = await instance.getTotalCandidates();
        assert(total > 0);
    });

    it('Allow end the Ballot', async () => {
        let total = await instance.getTotalCandidates();
        assert(total > 0);
    });

    it('Let voters to make a vote', async () => {
        await instance.doVote(0, {from: accounts[0]});
        let voterWeight = await instance.voters.
        assert();
    }); */
});
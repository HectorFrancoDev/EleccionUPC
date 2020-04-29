pragma solidity >=0.4.22 <0.7.0;


/**
 * @title Ballot.sol: Smart Contract de elección de Representante Estudiantil
 * @author Camilo Andrés Rodríguez Burgos
 * @author Hector Oswaldo Franco Másmela
 * @notice Smart Contract de una votación de Representante Estudiantil de la Universidad Piloto de Colombia
 */

contract Ballot {
    /**
     * @dev Candidate: estructura
     */
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    /**
     * @dev Voter: estructura
     */
    struct Voter {
        string email;
        // Información de la votación
        bool voted;
        uint256 candidateIndex;
        uint256 weight;
        uint256 voteTimestamp;
    }

    /**
     * @dev atributos del contrato
     */
    string private name;
    string private proposal;
    address private ballotAdmin;
    uint256 private ballotEnd;
    uint256 private totalVoters;
    uint256 private totalDoneVotes;

    Candidate[] private candidates;

    /**
     * @dev Mappings verificadores de los voters
     */
    mapping(address => Voter) private voters;
    mapping(address => bool) private addedVoters;
    mapping(string => bool) private addedEmail;

    enum State {Created, Voting, Ended}

    State private state;

    /**
     * @dev Eventos del contrato
     */
    event ElectionResult(string name, uint256 voteCount);
    event voterAdded(string voterEmail, address voterAddress);
    event voteStarted(string);
    event voteEnded(string);
    event voteDone(address voter);
    event showWinner(string, uint256 votes);
    event showCertificate(string, uint256);
    event showBallotInfo(string name, string proposal);

    /**
     * @dev constructor()
     */
    /*
    constructor() public {
        ballotAdmin = msg.sender;
    } */

    /**
     * @dev createBallot()
     * @param _name name of the ballot
     * @param _proposal proposal of the ballot
     */
    function createBallot(string memory _name, string memory _proposal) public {
        ballotAdmin = msg.sender;
        name = _name;
        proposal = _proposal;

        totalVoters = 0;
        totalDoneVotes = 0;
    }

    /**
     * @dev función addCandidate()
     * @param _name of the candidate
     */

    function addCandidate(string memory _name)
        public
        inState(State.Created)
        checkBallotAdmin
    {
        candidates.push(Candidate(_name, 0));
    }

    /**
     * @dev función addCandidate()
     * @param email of the candidate
     */
    function addVoter(string memory email)
        public
        inState(State.Created)
    {
        require(
            !getAddedVoter(msg.sender),
            "Ya se registró un usuario con el address ingresado"
        );
        require(!getVoterEmail(email), "Email registrado previamente");
        require(!voters[msg.sender].voted, "El usuario votó previamente");

        Voter storage voter = voters[msg.sender];
        voter.email = email;

        addedVoters[msg.sender] = true;
        addedEmail[email] = true;

        voters[msg.sender].weight = 1;

        totalVoters++;
    }

    /**
     * @dev función startBallot()
     * @param durationHours hours that will be available the contract
     */
    function startBallot(uint256 durationHours)
        public
        inState(State.Created)
        checkBallotAdmin
        checkCandidates
    {
        state = State.Voting;
        candidates.push(Candidate("Voto en blanco", 0));
        ballotEnd = getTimestamp() + (durationHours * 1 minutes);
        emit voteStarted("Votación iniciada");
    }

    /**
     * @dev función doVote()
     * @param candidateIndex index of the candidate in the ballot
     */
    function doVote(uint256 candidateIndex) public inState(State.Voting) {
        require(
            getTimestamp() < ballotEnd,
            "Se sobrepasó el tiempo de la votación"
        );
        require(getAddedVoter(msg.sender), "No está registrado en la votación");
        require(!voters[msg.sender].voted, "Ya votó previamente");

        voters[msg.sender].voted = true;
        voters[msg.sender].candidateIndex = candidateIndex;
        voters[msg.sender].voteTimestamp = getTimestamp();

        candidates[candidateIndex].voteCount += voters[msg.sender].weight;
        totalDoneVotes++;
        emit voteDone(msg.sender);
    }

    /**
     * @dev función endBallot()
     */
    function endBallot() public inState(State.Voting) checkBallotAdmin {
        require(getTimestamp() >= ballotEnd, "La votación aún no finaliza");
        state = State.Ended;
        emit voteEnded("Votación finalizada");
    }

    /**
     * @dev función getBallotState()
     * @return State of the ballot
     */
    function getBallotState() public view checkBallotAdmin returns (State) {
        return state;
    }

    /**
     * @dev Calls getWinner() function to get the index of the winner
     * @return tuple(string name of the winner, uint256 voteCount)
     */
    function winnerCandidate()
        public
        view
        inState(State.Ended)
        returns (string memory, uint256)
    {
        Candidate storage winner = candidates[getWinner()];
        return (winner.name, winner.voteCount);
    }

    /**
     * @dev generates the voter certificate
     */
    function generateCertificate()
        public
        view
        returns (string memory, uint256)
    {
        require(getAddedVoter(msg.sender), "No está registrado en la votación");
        require(
            voters[msg.sender].voted,
            "Su certificado estará listo una vez haya votado"
        );
        require(
            state == State.Voting || state == State.Ended,
            "Espere hasta que la votación haya iniciado"
        );

        return (voters[msg.sender].email, voters[msg.sender].voteTimestamp);
    }

    /**
     * @dev getTotalVoters()
     * @return uint256 the total registered voters
     */
    function getTotalVoters() public view checkBallotAdmin returns (uint256) {
        return totalVoters;
    }

    /**
     * @dev getFinalResult()
     */
    function getFinalResult() public inState(State.Ended) {
        require(totalDoneVotes <= totalVoters, "Votación corrupta");

        for (uint256 i = 0; i < candidates.length; i++) {
            emit ElectionResult(candidates[i].name, candidates[i].voteCount);
        }
    }

    /**
     * @dev getAddedVoter()
     * @param voterAddress address of the voter
     */

    function getAddedVoter(address voterAddress) private view returns (bool) {
        return addedVoters[voterAddress];
    }

    /**
     * @dev getVoterEmail()
     * @param voterEmail email of the voter
     */
    function getVoterEmail(string memory voterEmail)
        private
        view
        returns (bool)
    {
        return addedEmail[voterEmail];
    }

    /**
     * @dev getTotalCandidates()
     * @return uint256
     */

    function getTotalCandidates() public view returns (uint256) {
        return candidates.length;
    }

    function getBallotInfo()
        public
        view
        returns (string memory, string memory)
    {
        return (name, proposal);
    }

    /**
     * @dev getCandidateName()
     * @return string candidateName
     */
    function getCandidateName(uint256 candidateIndex)
        public
        view
        returns (string memory)
    {
        return candidates[candidateIndex].name;
    }

    /**
     * @dev getWinner(): helper function
     * @return winningCandidate (the index of the winner candidate)
     */

    function getWinner() private view returns (uint256 winningCandidate) {
        uint256 winningVoteCount = 0;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > winningVoteCount) {
                winningVoteCount = candidates[i].voteCount;
                winningCandidate = i;
            }
        }
    }

    function getTimestamp() private view returns (uint256) {
        return now;
    }

    /**
     * @dev Modifier: verifies the correct state of the Ballot
     * @param _state of the ballot
     */
    modifier inState(State _state) {
        require(state == _state, "No puede modificar el estado de la votación");
        _;
    }

    /**
     * @dev Modifier: verefies that the admin of the Ballot is the same that the one who created the contract
     */
    modifier checkBallotAdmin() {
        require(
            msg.sender == ballotAdmin,
            "Debe ser el administrador de la votación"
        );
        _;
    }

    /**
     * @dev Modifier: verifies the candidates array is not empty
     */
    modifier checkCandidates() {
        require(
            candidates.length > 1,
            "Debe haber más de un candidato"
        );
        _;
    }
}

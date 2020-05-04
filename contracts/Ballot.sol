// pragma solidity >=0.4.22 <0.7.0;
pragma solidity ^0.4.24;


/**
 * @title Ballot.sol: Smart Contract de elección de Representante Estudiantil
 * @author Camilo Andrés Rodríguez Burgos
 * @author Hector Oswaldo Franco Másmela
 * @notice Smart Contract de una votación de Representante
           Estudiantil de la Universidad Piloto de Colombia
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
    string public name;
    string public proposal;
    address public ballotAdmin;
    uint256 public ballotEnd;
    uint256 public totalVoters;
    uint256 public totalDoneVotes;

    Candidate[] public candidates;
    address[] public votersAddress;

    /**
     * @dev Mappings verificadores de los voters
     */
    mapping(address => Voter) private voters;
    mapping(address => bool) private addedVoters;
    mapping(string => bool) private addedEmail;

    enum State {Initial, Created, Voting, Ended}

    State public state;

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
     * @dev createBallot()
     * @param _name name of the ballot
     * @param _proposal proposal of the ballot
     */
    function createBallot(string memory _name, string memory _proposal) public {
        require(state == State.Initial, "Votación creada previamente");
        ballotAdmin = msg.sender;
        name = _name;
        proposal = _proposal;

        totalVoters = 0;
        totalDoneVotes = 0;
        state = State.Created;
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
    function addVoter(string memory email) public inState(State.Voting) {
        require(!getVoterEmail(email), "Email registrado previamente");
        require(
            !getAddedVoter(msg.sender),
            "Ya se registró un usuario con el address ingresado"
        );
        require(!voters[msg.sender].voted, "El usuario votó previamente");

        Voter storage voter = voters[msg.sender];
        voter.email = email;

        addedVoters[msg.sender] = true;
        addedEmail[email] = true;

        voters[msg.sender].weight = 1;

        votersAddress.push(msg.sender);
        totalVoters++;
    }

    /**
     * @dev función startBallot()
     * @param durationMinutes Minutes that will be available the contract
     */
    function startBallot(uint256 durationMinutes)
        public
        inState(State.Created)
        checkBallotAdmin
        checkCandidates
    {
        candidates.push(Candidate("Voto en blanco", 0));
        ballotEnd = getTimestamp() + (durationMinutes * 1 minutes);
        state = State.Voting;
        emit voteStarted("Votación iniciada");
    }

    /**
     * @dev función doVote()
     * @param candidateIndex index of the candidate in the ballot
     */
    function doVote(uint256 candidateIndex) public inState(State.Voting) {
        require(
            getTimestamp() < ballotEnd,
            "Se pasó el tiempo habilitado para votar"
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

    function getContractBalance() public view returns (uint256) {
        return toEther(address(this).balance);
    }

    function deposit() public payable {
        require(msg.value >= 1 ether, "No se logró el deposito");
    }

    function getAddressBalance(address add) public view returns (uint256) {
        return toEther(address(add).balance);
    }

    function withdraw() public payable {
        msg.sender.transfer(1 ether);
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

    function toEther(uint256 balance) private pure returns (uint256) {
        return (balance / 1e18);
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
        require(candidates.length > 1, "Debe haber más de un candidato");
        _;
    }
}

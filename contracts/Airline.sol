pragma solidity ^0.4.24;

contract Airline {

    address public owner;
    uint etherPerPoint = 0.5 ether;
    Flight[] public flights;

    struct Custumer {
        uint loyalityPoints;
        uint totalFlights;
    }

    struct Flight {
        string name;
        uint price;
    }

    mapping(address => Custumer) public custumers;
    mapping(address => Flight[]) public custumerFlights;
    mapping(address => uint) public custumerTotalFlights;

    event FlightPurchased(address indexed custumer, uint price, string flight);

    constructor() public {
        owner = msg.sender;

        // Cargar vuelos iniciales
        flights.push(Flight('Bogota', 10 ether));
        flights.push(Flight('Tokio', 4 ether));
        flights.push(Flight('New York', 5 ether));
        flights.push(Flight('Madrid', 7 ether));
        flights.push(Flight('Los Angeles', 9 ether));
    }

    function buyFlight(uint flightIndex) public payable {
         Flight storage flight = flights[flightIndex];
         require(msg.value == flight.price);

         Custumer storage custumer = custumers[msg.sender];
         custumer.loyalityPoints += 5;
         custumer.totalFlights += 1;
         custumerFlights[msg.sender].push(flight);
         custumerTotalFlights[msg.sender] += 1;

         FlightPurchased(msg.sender, flight.price, flight.name);
    }


    function totalFlights() public view returns (uint) {
        return flights.length;
    }

    function reedemLoyalityPoints() public {
        Custumer storage custumer = custumers[msg.sender];
        uint etherToRefund = etherPerPoint * custumer.loyalityPoints;
        msg.sender.transfer(etherToRefund);
        custumer.loyalityPoints = 0;
    }

    function getRefundableEther() public view returns(uint) {
        return etherPerPoint * custumers[msg.sender].loyalityPoints;
    }

    function getAirlineBalance() public isOwner view returns (uint) {
        address airlineAddress = this;
        return airlineAddress.balance;
    }

    modifier isOwner {
        require(msg.sender == owner);
        _;
    }
}
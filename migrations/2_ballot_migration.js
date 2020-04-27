const Ballot = artifacts.require("Ballot");

module.exports = function (deployer) {

    let name = "Representante Estudiantil UPC";
    let proposal = "Elección de representante estudiantil UPC";
    let candidate1 = "Carlo Cardenas";
    let candidate2 = "Juan Perez";

    deployer.deploy(Ballot, name, proposal, candidate1, candidate2);
};

const Ballot = artifacts.require("Ballot");

module.exports = function (deployer) {

    let name = "Representante Estudiantil UPC";
    let proposal = "Elección de representante estudiantil UPC";

    deployer.deploy(Ballot);
};

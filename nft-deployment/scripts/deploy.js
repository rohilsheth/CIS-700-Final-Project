const { utils } = require("ethers");

async function main() {
    const baseTokenURI = "ipfs://QmUdb67ykzvv5fiPMc8syTZiUzhvTzY9Ucj1ikdSe6w7yG/";

    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();

    // Get contract that we want to deploy
    const contractFactory = await hre.ethers.getContractFactory("Deploy");

    // Deploy contract with the correct constructor arguments
    const contract = await contractFactory.deploy(baseTokenURI);

    // Wait for this transaction to be mined
    await contract.deployed();

    // Get contract address
    console.log("Contract deployed to:", contract.address);
    
    // Mint 3 NFTs by sending 0.03 ether
    txn = await contract.mintNFTs(7);
    await txn.wait()

    // Get all token IDs of the owner
    let tokens = await contract.tokensOfOwner(owner.address)
    console.log("Owner has tokens: ", tokens);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
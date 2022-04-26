require("@nomiclabs/hardhat-waffle");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require("@nomiclabs/hardhat-waffle");

 module.exports = {
   solidity: "0.8.4",
   networks: {
     hardhat: {
       chainId: 1337
     },
     // Mumbai testnet 
     // mumbai: {
     //   url: "https://rpc-mumbai.matic.today",
     //   accounts: [process.env.pk]
     // },
     // Polygon mainnet
     // polygon: {
     //   url: "https://polygon-rpc.com/",
     //   accounts: [process.env.pk]
     // }
   }
 };
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      chainId: 801
    },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [process.env.pk]
    },
    // polygon: {
    //   url: "https://polygon-rpc.com/",
    //   accounts: [process.env.pk]
    // }
  }
};
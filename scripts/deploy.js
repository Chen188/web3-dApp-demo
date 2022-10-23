const hre = require("hardhat");
const fs = require('fs');

async function main() {
  // these two lines deploy the contract to the network
  const Blog = await hre.ethers.getContractFactory("Blog");
  // Site's title, Site's subtitle, Site's cover image
  const blog = await Blog.deploy("Web3 Blog Demo", "A dApp powered by BlockChain", "QmeisUNzsWHmjmD8hX3mGsC8sYiYYwx2Qif98bHJPBvQsG");

  await blog.deployed();
  console.log("Blog deployed to:", blog.address);

  /* this code writes the contract addresses to a local */
  /* file named config.js that we can use in the app */
  fs.writeFileSync('./config.js',
    `export const contractAddress = "${blog.address}"
export const ownerAddress = "${blog.signer.address}"`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
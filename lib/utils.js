import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'

import { ownerAddress, contractAddress } from '../config'

/* import Application Binary Interface (ABI) */
import Blog from '../artifacts/contracts/Blog.sol/Blog.json'

function getProvider() {
  let provider;

  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider()
  } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'testnet') {
    // provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/')
    provider = new ethers.providers.JsonRpcProvider('https://matic-mumbai.chainstacklabs.com')
  } else {
    provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/')
  }

  return provider
}

function isContractOwner(addr) {
  return ownerAddress === addr
}

function formIpfsUrl(cid) {
  const ipfsURI = process.env.NEXT_PUBLIC_ipfs_uri
  return `${ipfsURI}/${cid}`
}

function getIpfsClient() {
  // option1: infura ipfs endpoint,
  // option2: self-maintained ipfs endpoint

  const headers = { 'User-Agent': 'private-web3-demo' }
  if (process.env.NEXT_PUBLIC_ipfs_auth_user &&
    process.env.NEXT_PUBLIC_ipfs_auth_password) {
    const auth = 'Basic ' + Buffer.from(`${process.env.NEXT_PUBLIC_ipfs_auth_user}:${process.env.NEXT_PUBLIC_ipfs_auth_password}`).toString('base64');
    headers['authorization'] = auth
  }

  const ipfsGateway = process.env.NEXT_PUBLIC_ipfs_gateway || 'https://ipfs.infura.io:5001/api/v0'

  /* define the ipfs endpoint */
  const client = create({
    url: ipfsGateway,
    headers
  })

  return client
}


class BlogModel {
    constructor() {
        this.provider = getProvider();
        this.contract = new ethers.Contract(contractAddress, Blog.abi, this.provider);
    }

    async fetchPosts() {
        const data = await this.contract.fetchPosts()

        return data
    }

    async fetchSiteInfo() {
        const coverImage = formIpfsUrl(await this.contract.bgImage())
        const title = await this.contract.name()
        const desc  = await this.contract.saying()

        return {
            title,
            desc,
            coverImage
        }
    }
}

export { getProvider, isContractOwner, formIpfsUrl, getIpfsClient, BlogModel }
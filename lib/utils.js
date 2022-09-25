import { ethers } from 'ethers'
import { ownerAddress } from '../config'

import { create } from 'ipfs-http-client'

function getProvider() {
  let provider;

  if (process.env.ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider()
  } else if (process.env.ENVIRONMENT === 'testnet') {
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/')
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
  const auth = 'Basic ' + Buffer.from(`${process.env.NEXT_PUBLIC_infra_ipfs_proj_id}:${process.env.NEXT_PUBLIC_infra_ipfs_priv_key}`).toString('base64');

  /* define the ipfs endpoint */
  const client = create({
      url: 'https://ipfs.infura.io:5001/api/v0',
      headers: {
          authorization: auth,
          'User-Agent': 'private-web3-demo',
      }
  })

  return client
}

export { getProvider, isContractOwner, formIpfsUrl, getIpfsClient }
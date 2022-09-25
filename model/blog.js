import { formIpfsUrl, getProvider } from '../lib/utils'
import { ethers } from 'ethers'

/* import contract and owner addresses */
import { contractAddress } from '../config'

/* import Application Binary Interface (ABI) */
import Blog from '../artifacts/contracts/Blog.sol/Blog.json'

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

export { BlogModel }
import { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useAccountContext } from '../../context/account'

import Link from 'next/link'

function chopAddr(addr) {
    return addr.slice(0, 6) + '...' + addr.slice(-4, addr.lenght)
}

export default function Navbar({ children }) {
    const [account, setAccount] = useAccountContext()

    /* create local state to save account information after signin */
    const [ethName, setEthName] = useState(null)

    /* web3Modal configuration for enabling wallet access */
    async function getWeb3Modal() {
        const web3Modal = new Web3Modal({
            network: 'mainnet',
            cacheProvider: false,
            providerOptions: {
                walletconnect: {
                    package: WalletConnectProvider,
                    // options: {
                    //     infuraId: process.env.NEXT_PUBLIC_INFURA_ID
                    // },
                },
            },
        })
        return web3Modal
    }

    /* the connect function uses web3 modal to connect to the user's wallet */
    async function connect() {
        try {
            const web3Modal = await getWeb3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const accounts = await provider.listAccounts()
            const account = accounts[0]
            setAccount(accounts[0])
            localStorage.setItem('account', account[0])

            const ensProvider = new ethers.providers.InfuraProvider("ropsten", "3f72135ab8644513896396153c7d00ba")
            const ensName = await ensProvider.lookupAddress(account)
            setEthName(ensName)
            localStorage.setItem('ens_name', ensName)
        } catch (err) {
            console.log('error:', err)
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light" id="mainNav">
            <div className="container px-4 px-lg-5">
                <Link href="/"><a className="navbar-brand">Web3 Demo</a></Link>
                <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="true" aria-label="Toggle navigation">
                    Menu <span className="navbar-toggler-icon"></span>
                </button>
                <div className="navbar-collapse collapse" id="navbarResponsive">
                    <ul className="navbar-nav ms-auto py-4 py-lg-0">
                        <li className="nav-item"><Link href="/"><a className="nav-link px-lg-3 py-3 py-lg-4">Home</a></Link></li>
                        <li className="nav-item"><Link href="/posts"><a className="nav-link px-lg-3 py-3 py-lg-4">Post</a></Link></li>
                        <li className="nav-item"><Link href="/"><a className="nav-link px-lg-3 py-3 py-lg-4">About</a></Link></li>
                        <li className="nav-item"><Link href="/"><a className="nav-link px-lg-3 py-3 py-lg-4">Contact</a></Link></li>
                        <form className="d-flex frm-connect-wallet">
                            {
                                !account ?
                                    <button id='btn-connect-wallet' className="btn text-bg-light" type='button' onClick={connect}>Connect Wallet</button> :
                                    <li className="nav-item dropdown account-info">
                                        <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" title={account}>
                                            { ethName ? ethName : chopAddr(account) }
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><Link href='/posts/new'><a className="dropdown-item">Create Post</a></Link></li>
                                        </ul>
                                    </li>
                                // <div className='account-info'>
                                //     {<div>ENS: {ethName ? ethName : "loading..."}</div>}
                                //     {<div>{ chopAddr(account) }</div>}
                                // </div>
                            }
                        </form>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
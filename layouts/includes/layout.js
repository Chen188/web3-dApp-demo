import Head from 'next/head';
import Navbar from './navbar';
import Footer from './footer';

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <link href="https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic" rel="stylesheet" type="text/css" />
                <link href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800" rel="stylesheet" type="text/css" />

                <script src='https://use.fontawesome.com/releases/v6.1.0/js/all.js'></script>
            </Head>
            <Navbar/>
            { children }
            <Footer />
            <script src='/js/global.js'></script>
        </>
    )
}
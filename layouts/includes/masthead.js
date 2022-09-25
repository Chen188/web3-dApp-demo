export default function Masthead({ siteInfo }) {
    return (
        <header className='masthead' style={{ backgroundImage: `url(${siteInfo && siteInfo.coverImage})` || 'unset' }}>
            <div className="container position-relative px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        <div className="site-heading">
                            <h1>{siteInfo && siteInfo.title || 'Web3 Blog Demo'}</h1>
                            <div className="subheading">{siteInfo && siteInfo.desc || 'A dApp powered by BlockChain'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
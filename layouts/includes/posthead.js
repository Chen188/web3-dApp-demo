export default function Posthead({ post }) {
    return (
        <header className='masthead' style={{ backgroundImage: `url(${post && post.coverImage})` || 'unset' }}>
            <div className="container position-relative px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        <div className="post-heading">
                            <h1>{post && post.title || 'Web3 Blog Demo'}</h1>
                            <div className="subheading">{post && post.desc || 'A dApp powered by BlockChain'}</div>
                            <span className="meta">
                                Posted on September 25, 2022
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
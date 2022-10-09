import Link from "next/link";
import { useState, useEffect } from "react";

import PostsLayout from "../../layouts/posts-layout";
import { BlogModel } from '../../lib/utils';

export default function Posts( {siteInfo}) {
    let [posts, setPosts] = useState();
    let [loading, setLoading ] = useState(true)

    useEffect( async () => {
        // load posts from browser
        const blogModel = new BlogModel();
        try {
            let _posts = await blogModel.fetchPosts();
            setLoading(false)
            setPosts( _posts );
        } catch (e) {
            console.error(e)
        }
    }, [])

    return (
        <PostsLayout siteInfo={ siteInfo }>
            <div className="container px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        {
                            posts && posts.length && posts.map((post, idx) => (
                                <div className="post-preview" key={idx}>
                                    <a href={`/posts/${post[3]}`}>
                                        <h2 className="post-title">{post[1]}</h2>
                                        <h3 className="post-subtitle">{post[2]}</h3>
                                    </a>
                                    <p className="post-meta">
                                        Posted on September 25, 2022
                                    </p>
                                </div>
                            ))

                        }
                        {
                            loading && <div className="post-preview">
                                <h2 className="post-title"> Loading ... </h2>
                            </div>
                        }
                        {
                            !loading && !(posts && posts.length) &&
                            <div className="post-preview">
                                <h2 className="post-title"> No post found </h2>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </PostsLayout>
    );
}
export async function getServerSideProps() {
    const blogModel = new BlogModel();

    // load site info while `npm run build`
    const siteInfo = await blogModel.fetchSiteInfo()
    return {
        props: {
            siteInfo
        }
    }
}
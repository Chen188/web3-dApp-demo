import Link from "next/link";

import PostsLayout from "../../layouts/posts-layout";
import { BlogModel } from '../../model/blog';

export default function Posts(props) {
    const { posts, siteInfo } = props

    return (
        <PostsLayout siteInfo={ siteInfo }>
            <div className="container px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        {
                            posts && posts.length && posts.map((post, idx) => (
                                <div className="post-preview" key={idx}>
                                    <Link href={`/posts/${post[3]}`}>
                                        <a>
                                            <h2 className="post-title">{post[1]}</h2>
                                            <h3 className="post-subtitle">{post[2]}</h3>
                                        </a>
                                    </Link>
                                    <p className="post-meta">
                                        Posted on September 25, 2022
                                    </p>
                                </div>
                            ))

                        }
                        {
                            !(posts && posts.length) &&
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
    const posts = await blogModel.fetchPosts();
    const siteInfo = await blogModel.fetchSiteInfo()
    // console.log(posts)
    return {
        props: {
            posts: JSON.parse(JSON.stringify(posts)),
            siteInfo
        }
    }
}
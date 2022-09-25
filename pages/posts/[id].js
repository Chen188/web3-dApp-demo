import Head from 'next/head';
import ReactMarkdown from 'react-markdown'
import { useRouter } from 'next/router'
import { BlogModel } from '../../model/blog';
import { formIpfsUrl } from '../../lib/utils';
import { HttpsProxyAgent } from 'https-proxy-agent'
import Posthead from '../../layouts/includes/posthead';
import Layout from '../../layouts/includes/layout';

export default function Post({ post }) {
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Head>
        <title>Loading...</title>
        <Posthead post={ {title: "Loading...",desc: ' '} } />
      </Head>
    )
  }

  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Posthead post={post} />
      <div className='container px-4 px-lg-5'>
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-7">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const blogModel = new BlogModel()

  /* then we map over the posts and create a params object passing */
  /* the id property to getStaticProps which will run for ever post */
  /* in the array and generate a new page */
  const posts = await blogModel.fetchPosts();
  console.log(posts)
  const paths = posts.map(d => ({ params: { id: d[3] } }))

  return {
    paths,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {
  /* using the id property passed in through the params object */
  /* we can us it to fetch the data from IPFS and pass the */
  /* post data into the page as props */
  const { id } = params
  const ipfsUrl = formIpfsUrl(id);
  let proxyAgent

  // fetch ipfs data via proxy
  if (process.env.https_proxy && process.env.https_proxy.length > 0) {
    proxyAgent = new HttpsProxyAgent('http://127.0.0.1:1087');
  }

  const response = await fetch(ipfsUrl, { agent: proxyAgent })
  const post = await response.json()

  if (post.coverImage) {
    let coverImage = formIpfsUrl(post.coverImage)
    post.coverImage = coverImage
  }

  return {
    props: {
      post: post
    },
  }
}

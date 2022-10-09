import { useState, useEffect } from 'react';

import Head from 'next/head';
import ReactMarkdown from 'react-markdown';

import { formIpfsUrl } from '../../lib/utils';
import Posthead from '../../layouts/includes/posthead';
import Layout from '../../layouts/includes/layout';

export default function Post() {

  const [post, setPost] = useState({
    title: 'Loading...',
    desc: ''
  })

  useEffect(() => {
    const id = location.pathname.split('/')[2]

    // fetch Post from ipfs
    fetch( formIpfsUrl(id) )
      .then((res) => res.json())
      .then((data) => {
        if (data.coverImage)
          data.coverImage = formIpfsUrl(data.coverImage)
        setPost(data)
      })
  }, [])

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

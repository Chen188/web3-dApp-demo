import Layout from "./includes/layout"
import Head from "next/head"

export default function CreatePostLayout({ children }) {
    return (
        <Layout>
            <Head>
                <title>Create new post</title>
            </Head>
            { children }
        </Layout>
    )
}
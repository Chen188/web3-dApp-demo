import Layout from "./includes/layout"
import Masthead from "./includes/masthead"

export default function PostsLayout({ children, siteInfo }) {
    return (
        <Layout>
            <Masthead siteInfo={ siteInfo } />
            { children }
        </Layout>
    )
}
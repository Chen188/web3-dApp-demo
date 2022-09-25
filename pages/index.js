import Posts, { getServerSideProps as getServerSidePropsPosts }
    from './posts/index';

const Home = Posts

export default Home
export const getServerSideProps = getServerSidePropsPosts

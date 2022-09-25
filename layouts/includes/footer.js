// import styles from './footer-layout.module.css';

export default function Footer({ children }) {
    return (
        <footer className="border-top">
            <div className="container px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                        <ul className="list-inline text-center">
                            <li className="list-inline-item">
                                <a href="#!">
                                    
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#!">
                                </a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#!">
                                    
                                </a>
                            </li>
                        </ul>
                        <div className="small text-center text-muted fst-italic">Copyright © Web3 Demo Site 2022. Using Boostrap Clean Blog template.</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
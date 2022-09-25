export default function CreateMasthead({ children, data }) {
   return (
        <header className='masthead' style={{ backgroundImage: data && data.bgFile }}>
            <div className="container position-relative px-4 px-lg-5">
                <div className="row gx-4 gx-lg-5 justify-content-center">
                    <div className="col-md-10 col-lg-8 col-xl-7">
                    { children }
                    </div>
                </div>
            </div>
        </header>
    )
}
import { useNavigate } from "react-router"


const ErrorPage = () => {
    const navigate = useNavigate()

    return(
        <div className="container" style={{position: 'absolute', minHeight: '100%', minWidth: '100%', top: '0', bottom: '0', left: '0', right: '0', backgroundColor: 'white'}}>
            <nav className="px-3 py-4" style={{width: '100%'}}>
                <div className="text-center justify-self-center ms-auto py-0 my-auto" style={{fontFamily: 'Wallpoet', fontSize: '1.6em', justifySelf:'center', cursor: 'pointer'}} onClick={() => navigate('/shop')}>MITRENDI</div>
            </nav>
            <div className="row mx-2">
                <div className='col-md-2 m-0 p-0'></div>
                <div className='main_body col-12 col-md-8 mx-0 mt-md-3 p-0'>
                    <div style={{position: 'fixed', left: '50%', top: '45%', transform: 'translateX(-50%) translateY(-50%)', fontSize: '1.5em', color: '#575757'}}>
                        404 | Not found
                    </div>
                </div>
                <div className='col-md-2 m-0 p-0'></div>
            </div>
        </div>
    )
}


export default ErrorPage
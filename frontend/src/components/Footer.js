import settings from '../Settings.json'



const Footer = () => {
    

    return(
        <div className='selectable' style={{marginTop: '20rem'}}>
            <div className="row px-0 mx-0" style={{backgroundColor: '#efefef', height: 'fit-content', paddingBottom: '5rem', width: '100%'}}>
                <div className="col-md-4 col-12 mt-md-0 mt-3 px-md-4 px-4" style={{paddingTop: '2rem', color: '#5a5a5a'}}>
                    <span style={{color: '#373737', fontWeight: '500'}}>ABOUT US</span><br/>
                    <p className="mt-1" style={{fontWeight: '500'}}>After finding it so hard to get the best fits for the best prices, we took matters into our own hands.</p>
                </div>
                <div className="col-md-4 col-12 mt-md-0 mt-3 px-md-4 px-3" style={{paddingTop: '2rem', color: '#5a5a5a'}}>
                    <span style={{color: '#373737', fontWeight: '500'}}>CUSTOMER SUPPORT</span><br/>
                    <p className="mt-1" style={{fontWeight: '500'}}>We value our customers, for  24 hour customer support, please send and email to <a style={{color: '#353535', fontWeight: '600', cursor: 'pointer'}} href='mailto:admin@mitrendi.com'>admin@mitrendi.com</a></p>
                </div>
                <div className="col-md-4 col-12 mt-md-0 mt-3 px-md-4 px-3" style={{paddingTop: '2rem', color: '#5a5a5a'}}>
                    <ul>
                        <li onClick={() => window.location.href = `${settings.SERVER_EXTRAS + '/toc'}`} style={{cursor: 'pointer'}}>Terms and Conditions</li>
                        <li onClick={() => window.location.href = `${settings.SERVER_EXTRAS + '/returnpolicy'}`} style={{cursor: 'pointer'}}>Return Policy</li>
                        <li onClick={() => window.location.href = `${settings.SERVER_EXTRAS + '/returnprocess'}`} style={{cursor: 'pointer'}}>Return Process</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}





export default Footer
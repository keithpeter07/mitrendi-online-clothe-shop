import React, { useState } from "react";
import settings from '../Settings.json'
import axios from "axios";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import MyToast from "../components/ToastMessages";



class SidePanel extends React.Component{
    constructor(props){
        super(props);
        this.wrapperRef = React.createRef();
    }

    handleClickOutside = (event) => {
        if(this.wrapperRef && !this.wrapperRef.current.contains(event.target)){
            this.props.togglePanel()
        }
    }

    componentDidMount(){
        window.addEventListener('mousedown', this.handleClickOutside)
    }
    componentWillUnmount(){
        window.removeEventListener('mousedown', this.handleClickOutside)
    }

    
    logout = () => {

        axios.get(settings.SERVER_SUPER + '/auth/superlogout', {headers: {'username' : window.sessionStorage.username}})
            .then(() => {
                window.sessionStorage.removeItem('access_token')
                window.sessionStorage.removeItem('username')
                MyToast.success({message: 'Good day', toastId: 'lo'})
                window.location.href='/'
                this.props.togglePanel()
            })
    }


    render(){
        return(
            <div>
                <div className="tint"></div>
                <div id="side_panel" ref={this.wrapperRef} className="side_panel">
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={() => this.props.navigate('/admin/users', {state: {authed: true}})}>
                            USERS
                        </button>
                    </div>
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={() => this.props.navigate('/admin/items', {state: {authed: true}})}>
                            ITEMS
                        </button>
                    </div>
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={() => this.props.navigate('/admin/item/upload', {state: {authed: true}})}>
                            ADD ITEM
                        </button>
                    </div>
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={() => this.props.navigate('/admin/orders', {state: {authed: true}})}>
                            ORDERS
                        </button>
                    </div>
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={() => this.logout()}>
                            LOGOUT
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}


const AdminNavBar = () => {

    const navigate = useNavigate()
    
    const [showPanel, setShowPanel] = useState(false)

    const togglePanel = () =>{
        
        setShowPanel(!showPanel)
        
    }


    
    return (
        <nav>
            {showPanel ? <SidePanel togglePanel={togglePanel} navigate={navigate}/> : null}
            <div className="m-0 p-0 px-2 px-md-3 d-flex">
                {showPanel ? 
                <button className="navbutton panel_closer" style={{zIndex:101, color:'white'}}>
                    <FontAwesomeIcon icon={faTimes}/>
                </button>
                :
                <button className="navbutton panel_opener" style={{color:'#373737', width: 'fit-content'}} onClick={togglePanel}>
                    <FontAwesomeIcon icon={faBars}/>
                </button>}

                <div className="text-center justify-self-center ms-auto py-0 my-auto" style={{fontFamily: 'Wallpoet', fontSize: '1.5em', cursor: 'pointer', color: '#882222'}}>MITRENDI ADMIN PORTAL</div>
                
            </div>
        </nav>
    )
    
}




export default AdminNavBar
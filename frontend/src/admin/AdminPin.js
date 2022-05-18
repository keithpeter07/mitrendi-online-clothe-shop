import { useState } from 'react'
import axios from "axios"
import settings from '../Settings.json'
import { useNavigate } from "react-router"
import MyToast from "../components/ToastMessages"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";




const PinForm = (props) => {

    const [pin, setPin] = useState('')

    const navigate = useNavigate()


    const sendPin = () => {

        const data = {username: props.username, pin: pin}

        axios.post(settings.SERVER_SUPER + '/auth/findaccess', data)
            .then((res) => {

                window.sessionStorage.setItem('access_token', res.data.access_token)
                window.sessionStorage.setItem('username', res.data.username)

                MyToast.success({message: 'Access granted', toastId: 'ag'})
                navigate('/admin/items', {replace: true, state : {authed : true}})
            })
            .catch((err) => {
                console.log(err)
                MyToast.error({message: 'error', toastId: 'ad'})
            })
    }
    


    return(

        <div>
            
            <div className="tint"></div>
            <div className="confirm_location_selection_cont py-4 px-3">
        
                <div className="navbutton panel_closer" style={{zIndex:101, color:'#454545', position: 'absolute', top: '0', right: '0', cursor: 'pointer'}} onClick={props.closeDialog}>
                    <span><FontAwesomeIcon icon={faTimesCircle}/></span>
                </div> 

                <div className="mx-1" style={{fontSize: '1.2em'}}>Enter your access pin:</div>
            
                <div className="fieldset d-flex flex-row align-items-center px-3">
                    <input className="auth_input ps-2" type="password"  maxLength={7} style={{color: 'black'}} onChange={event => setPin(event.target.value)}/>
                </div>

                <div className="d-flex flex-column">
                    <button className="action_btn bn mt-4" style={{backgroundColor: '#454545', color: 'white', letterSpacing: '.1em'}} onClick={sendPin}>
                        ACCESS
                    </button>
                </div>
            </div>
            

        </div>

    )
}




export default PinForm
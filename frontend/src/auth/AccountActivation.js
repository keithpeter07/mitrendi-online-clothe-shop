import { useState, useEffect } from 'react'
import axios from "axios"
import settings from '../Settings.json'
import { useNavigate } from "react-router"
import MyToast from "../components/ToastMessages"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";






export const ForgotPassFillIn = (props) => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState(false)


    const handleSubmit = () => {
        if(email.includes('@') && email.includes('.')){
            const data = {email}
            axios.post(settings.SERVER_AUTH+'/reset_password', data)
                .then((res) => {
                    props.success()
                    props.closeDialog()
                })
                .catch((err) => {
                    if(err.response && err.response.status === 404){
                        setError(true)
                        MyToast.error({message: 'This user does not exist', toastId: 'usernonexistance'})
                    }
                    else{
                        MyToast.error({message: 'Error: Check your connection and try again', toastId: 'connerr'})
                    }
                })
        }
    }


    return(

        <div>
            <div className='tint'></div>

            <div className="confirm_location_selection_cont py-4 px-3">
            
                <div className="navbutton panel_closer" style={{zIndex:101, color:'#454545', position: 'absolute', top: '0', right: '0', cursor: 'pointer'}} onClick={props.closeDialog}>
                    <span><FontAwesomeIcon icon={faTimesCircle}/></span>
                </div>

                <div className="mx-1 mt-4">Enter your email address below:</div><br/>
            
                <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: email.length === 0 || !email.includes('@') || !email.includes('.') || error ? 'red' : '#555555', boxShadow: email.length === 0 || !email.includes('@') || !email.includes('.') || error ? '0 0 4px red' : null}}>
                    {email.length > 0 ? <div className="legend">email</div> : null}
                    <input className="auth_input" type="email" placeholder="email" onChange={(event) => setEmail(event.target.value)}/>
                </div>

                <div className="d-flex flex-column">
                    <button className="action_btn bn mt-4" style={{backgroundColor: email.length === 0 || !email.includes('@') || !email.includes('.') ? '#454545' : '#000000', color: 'white', letterSpacing: '.1em'}} disabled={ email.length === 0 || !email.includes('@') || !email.includes('.') ? true : false} onClick={handleSubmit}>
                        PROCEED
                    </button>
                </div>
            </div>
        </div>
    )
}








const ActivationCodeForm = (props) => {

    const [activationCode, setActivationCode] = useState('')
    const [timer, setTimer] = useState(15) //time remaining before the email can be resent

    const navigate = useNavigate()


    const activateAccount = () => {

        const data = {email: props.email, activation_code: activationCode}

        axios.post(settings.SERVER_AUTH + '/activate_account', data, {withCredentials: true})
            .then((res) => {
                window.localStorage.setItem('access_token', res.data.access_token)
                window.localStorage.setItem('user', JSON.stringify(res.data.user))
                navigate('/shop', {replace: true})
            })
            .catch((err) => {
                if(err.response){
                    if(err.response.status === 403){
                        MyToast.error({message: 'Access Token Denied!', toastId: 'access_tk_denied'})
                    }
                    else if(err.response.status === 404){
                        MyToast.error({message: 'Your account was not registered correctly. Please go back to sign up page', toastId: 'account_not_found'})
                    }
                    else if(err.response.status === 500){
                        MyToast.error({message: 'Server error. Please try again', toastId: 'server_error'})
                    }
                }
                else {
                    MyToast.error({message: 'Check your connection and try again', toastId: 'connection_error'})
                }
            })
    }

    
    const resendCountdown = (timer) => {
        let time_remaining = timer
        let time = setInterval(() => {
            time_remaining -= 1
            setTimer(time_remaining)
            if(time_remaining <= 0){clearInterval(time)}
        }, 1000)
    }

    useEffect(() => {
        resendCountdown(timer)
    }, [timer])

    const resendCode = () => {
        axios.post(settings.SERVER_AUTH + '/resend_activation_code', {email: props.email}, {withCredentials: true})
            .then((res) => {
                MyToast.success({message: `Activation code resent to ${props.email}`, toastId: 'resent_code'})
            })
            .then(() => {resendCountdown(15)})
            .catch((err) => {
                if(err.response){
                    if(err.response.status === 404){
                        MyToast.error({message: 'Your account was not registered correctly. Please go back to sign up page', toastId: 'account_not_found'})
                    }
                    else if(err.response.status === 500){
                        MyToast.error({message: 'Server error. Please try again', toastId: 'account_not_found'})
                    }
                }
                else{
                    MyToast.error({message: 'Check your connection and try again', toastId: 'connection_error'})
                }
            })
    }
    
    


    return(

        <div>
            
            <div className="tint"></div>
            <div className="confirm_location_selection_cont py-4 px-3">
        
                <div className="navbutton panel_closer" style={{zIndex:101, color:'#454545', position: 'absolute', top: '0', right: '0', cursor: 'pointer'}} onClick={props.closeDialog}>
                    <span><FontAwesomeIcon icon={faTimesCircle}/></span>
                </div> 

                <div className="mx-1" style={{fontSize: '1.2em'}}>Enter the activation code sent to your email:</div>
            
                <div className="fieldset d-flex flex-row align-items-center px-3">
                    <input className="auth_input ps-2" type="text" pattern="[0-9]*" inputMode="numeric"  maxLength={7} style={{color: 'black'}} onChange={event => setActivationCode(event.target.value)}/>
                </div>

                <div className="d-flex flex-column">
                    <button className="action_btn bn mt-4" style={{backgroundColor: activationCode.length < 4 || activationCode.length > 6 ? '#454545' : '#000000', color: 'white', letterSpacing: '.1em'}} disabled={activationCode.length < 6 || activationCode.length > 7 ? true : false} onClick={activateAccount}>
                        PROCEED
                    </button>
                </div>

                <div className="text-center text-muted mt-4 mb-3" style={{fontSize: '1em'}}>
                    <span>resend activation code in {timer}s - </span>
                    <button className="ms-2 text-dark" style={{border: 'none', cursor: 'pointer', color: timer <= 0 ? '#000000' : '#454545'}} disabled={timer <= 0 ? false : true} onClick={resendCode}>resend</button>
                </div>
                
            </div>
            

        </div>

    )
}


export default ActivationCodeForm
import axios from 'axios';
import { useState } from 'react';
import settings from '../Settings.json';
import ActivationCodeForm, { ForgotPassFillIn } from './AccountActivation';
import MessageView from '../components/MessageView'
import { useLocation, useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import MyToast from '../components/ToastMessages';
import NavBar from '../components/NavBar';






const LoginForm = () => {

    const navigate = useNavigate() //returns a navigate function

    //States for login form
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [activationPanel, setActivationPanel] = useState(false)
    const [forgotPass, setForgotPass] = useState(false)
    const [messageView, setMessageView] = useState(null)


    const location = useLocation()

    //Handle submit function
    const handleSubmit = (e) => {
        e.preventDefault() //Prevent default form submission


        //verifying the credentials entered
        if(email.length === 0 || password.length === 0 || !email.includes('@') || !email.includes('.')){
            setError(true) //Sets an error if the credentials cannot be verified
        }
        else{ //proceeding if credentials are acceptable

            const data = {email, password}

            MyToast.setPromise({message: 'processing', toastId: 'authPromise'}) //uses MyToast app to show waiting notification

            axios.post(settings.SERVER_AUTH + '/login', data, {withCredentials: true}) //sends a request to the server
                .then((res) => {

                    window.localStorage.setItem('access_token', res.data.access_token)
                    window.localStorage.setItem('user', JSON.stringify(res.data.user))

                    MyToast.resolvePromise({message: 'Authenticated', toastId: 'authSuccess', promiseID: 'authPromise', type: 'success'})

                    if(location.state && location.state.next_location){
                        if(location.state.item){
                            navigate(location.state.next_location, {state : {item : {...location.state.item}}, replace: true})
                        }
                        else{
                            navigate(location.state.next_location)
                        }
                    }
                    else{
                        navigate('/', {replace: true})
                    }
                    
                })
                .catch((err) => {
                    
                    if(err.response){
                        if(err.response.status === 401){//Account not verified (This would mean that the authentication was successful)
                            setActivationPanel(true)
                            MyToast.resolvePromise({message: "Account not activated!", toastId: 'authError', promiseID: 'authPromise', type: 'error'})
                            
                        }
                        if(err.response.status === 404){ //server returns 404 if user is not found
                            
                            MyToast.resolvePromise({message: "This user does not exist!", toastId: 'authError', promiseID: 'authPromise', type: 'error'})
                            console.log(err.response.data)
                        }
                        else if(err.response.status === 403){ //server returns 403 if credentials dont match
                            
                            MyToast.resolvePromise({message: "These credentials don't match", toastId: 'authError', promiseID: 'authPromise', type: 'error'})
                            console.log(err.response.data)
                        }
                        else if(err.response.status === 500){ //This is an error on the server
                            
                            MyToast.resolvePromise({message: "Something went wrong. Try again", toastId: 'authError', promiseID: 'authPromise', type: 'error'})
                            console.log(err.response.data)
                        }
                    }
                    else{
                        MyToast.resolvePromise({message: "Check your internet connection and try again", toastId: 'authError', promiseID: 'authPromise', type: 'error'})
                    }

                })
        }
    }

    const closeActivationPanel = () => {setActivationPanel(false)}
    const clearMessageView = () => {setMessageView(null)}
    const successForgotPass = () => {setMessageView({message : 'Check your email to reset password', type : 2})}


    return(
        <div>
            {forgotPass ? <ForgotPassFillIn closeDialog={() => setForgotPass(false)} success={successForgotPass}/> : null}
            {messageView !== null ? <MessageView message={messageView.message} type={messageView.type} clearMessage={clearMessageView}/> : null}
            {activationPanel ? <ActivationCodeForm email={email} closeDialog={closeActivationPanel}/> : null}
            <form className='formFieldset'>
                <div className="formLegend">LOGIN</div>
                <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: (email.length === 0 || !email.includes('@') || !email.includes('.')) && error ? 'red' : '#555555', boxShadow: (email.length === 0 || !email.includes('@') || !email.includes('.')) && error ? '0 0 4px red' : null}}>
                    {email.length > 0 ? <div className="legend">email</div> : null}
                    <input className="auth_input" type="email" placeholder="email" onChange={(event) => setEmail(event.target.value)}/>
                </div>
                {(email.length === 0 || !email.includes('@') || !email.includes('.')) && error ?
                        <div className='auth_warnings p-0'>please fill in this field correctly</div>
                :null}

                <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: password.length === 0 && error ? 'red' : '#555555', boxShadow: password.length === 0 && error ? '0 0 4px red' : null}}>
                    {password.length > 0 ? <div className="legend">password</div> : null}
                    <input className="auth_input" type={showPass ? "text" : "password"} placeholder="password" onChange={(event) => setPassword(event.target.value)}/>
                    <span className='text-muted ms-2' style={{cursor: 'pointer'}} onClick={() => {setShowPass(!showPass)}}><FontAwesomeIcon icon={showPass ? faEyeSlash : faEye}/></span>
                </div>
                {password.length === 0 && error ? <div className='auth_warnings p-0'>please fill in this field</div> : null}

                <div className='text-center hovable'>
                    <span className="ms-2 text-muted" style={{cursor: 'pointer'}} onClick={() => {setForgotPass(true)}}>forgot password?</span>
                </div>

                <button className="action_btn bn mt-4" type='submit' onClick={(event) => handleSubmit(event)}>
                    LOGIN
                </button>
                <div className="text-center text-muted mt-4 mb-3" style={{fontSize: '1em'}}>
                    <span>Don't have an account? </span>
                    <span className="ms-2 text-dark" style={{cursor: 'pointer', fontWeight: '600'}} onClick={() => navigate('/signup')}>Signup</span>
                </div>
            </form>
        </div>
    )
}

const LoginPage = () => {
    
    return(
        <div>
            <NavBar/>
            <div className="row mx-2 mt-5 pt-4">
                <div className='col-md-4 m-0 p-0'></div>
                <div className='main_body col-12 col-md-4 mx-0 p-0'>
                    <LoginForm/>
                </div>
                <div className='col-md-4 m-0 p-0'></div>
            </div>
        </div>
    )
    
}

export default LoginPage
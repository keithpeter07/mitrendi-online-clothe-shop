import axios from "axios";
import { useState } from "react";
import settings from '../Settings.json';
import { useNavigate } from 'react-router';
import MessageView from "../components/MessageView";
import ActivationCodeForm from "./AccountActivation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import NavBar from "../components/NavBar";




const SignupForm = (props) => {

    const [showPass, setShowPass] = useState(false)
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [phonenumber, setPhonenumber] = useState('')
    const [password, setPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')
    const [error, setError] = useState(false)
    const [messageView, setMessageView] = useState(null)
    const [successfulSignup, setSuccessfulSignup] = useState(false)
    const [activationPanel, setActivationPanel] = useState(false)

    
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if(firstname.length === 0 ||
            lastname.length === 0 ||
            phonenumber.length < 10 ||
            email.length === 0 ||
            password.length === 0 ||
            confirm_password !== password
            ) //validate sign up data
            {
                setError(true)
            }

        else{ // proceed if data is acceptable

            const data = {firstname, lastname, email, phonenumber, password}

            axios.post(settings.SERVER_AUTH + '/signup', data, {withCredentials: true})
                .then((res) => {
                    setSuccessfulSignup(true)
                    setMessageView({type: 2 , message: <span> <span style={{fontWeight: '670'}}>Success</span><br/>We have sent you an email containing your verification code<br/><br/></span>})
                })
                .catch((err) => {
                    setSuccessfulSignup(false)
                    if(err.response){
                        if(err.response.status === 409){
                            setMessageView({type: 1, message:'This user already exists'})
                        }
                        else if(err.response.status === 500){
                            setMessageView({type: 1, message: 'An error occured, try again'})
                        }
                        else if(err.response.status === 400){
                            setMessageView({type: 1, message: 'Invalid signup, please try again'})
                        }}
                    else{
                        setMessageView({type: 1, message: 'An error occured. check your network and try again'})
                    }
                })

        }
    }


    const clearMessageView = () => {
        setMessageView(null)

        if(successfulSignup){
            setActivationPanel(true)
        }
    }

    const closeActivationPanel = () => {
        setActivationPanel(false)
    }


    return(
        <div>
            <div>
                {messageView !== null ? <MessageView message={messageView.message} type={messageView.type} clearMessage={clearMessageView}/> : null}
                {activationPanel  ? <ActivationCodeForm email={email} closeDialog={closeActivationPanel}/> : null}
            </div>

            <form className="formFieldset">
                <div className="formLegend">SIGN UP</div>
                    {error ? <div className='auth_warnings p-0 mt-4'>please fill in the highlighted fields correctly</div> : null}
                    <div className="d-flex flex-row p-0 m-0">
                        <div className="fieldset d-flex flex-row align-items-center px-3 me-2" style={{width: '50%', borderColor: (error && firstname.length === 0) ? 'red' : '#555555', boxShadow: (error && firstname.length === 0) ? '0 0 4px red' : null}}>
                            {firstname.length > 0 ? <div className="legend">first name</div> : null}
                            <input className="auth_input" type="text" placeholder="first name" onChange={(event) => setFirstname(event.target.value)}/>
                        </div>
                        <div className="fieldset d-flex flex-row align-items-center px-3 ms-2" style={{width: '50%', borderColor: (error && lastname.length === 0) ? 'red' : '#555555', boxShadow: (error && lastname.length === 0) ? '0 0 4px red' : null}}>
                            {lastname.length > 0 ? <div className="legend">last name</div> : null}
                            <input className="auth_input" type="text" placeholder="last name" onChange={(event) => setLastname(event.target.value)}/>
                        </div>
                    </div>

                    <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: (error && (email.length === 0 || !email.includes('@'))) ? 'red' : '#555555', boxShadow: (error && (email.length === 0 || !email.includes('@'))) ? '0 0 4px red' : null}}>
                        {email.length > 0 ? <div className="legend">email</div> : null}
                        <input className="auth_input" type="email" placeholder="email" onChange={(event) => setEmail(event.target.value)}/>
                    </div>

                    <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: (error && phonenumber.length < 10) ? 'red' : '#555555', boxShadow: (error && phonenumber.length < 10) ? '0 0 4px red' : null}}>
                        {phonenumber.length > 0 ? <div className="legend">phone number</div> : null}
                        <input className="auth_input" type="text" pattern="[0-9]*" inputMode="numeric" placeholder="phone number" onChange={(event) => setPhonenumber(event.target.value)}/>
                    </div>

                    <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: password.length === 0 && error ? 'red' : '#555555', boxShadow: password.length === 0 && error ? '0 0 4px red' : null}}>
                    {password.length > 0 ? <div className="legend">password</div> : null}
                    <input className="auth_input" type={showPass ? "text" : "password"} placeholder="password" onChange={(event) => setPassword(event.target.value)}/>
                    <span className='text-muted ms-2' style={{cursor: 'pointer'}} onClick={() => {setShowPass(!showPass)}}><FontAwesomeIcon icon={showPass ? faEyeSlash : faEye}/></span>
                </div>

                    {(password.length > 0 && password.length < 8) ? <div className='auth_warnings p-0'>password should be atleast 8 characters long</div> : null}
                    {/* <div className='auth_warnings p-0'>password should contain special characters</div> */}
                    <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: (error && confirm_password.length === 0) ? 'red' : '#555555', boxShadow: (error && confirm_password.length === 0) ? '0 0 4px red' : null}}>
                        {confirm_password.length > 0 ? <div className="legend">confirm password</div> : null}
                        <input className="auth_input" type="password" placeholder="confirm password" onChange={(event) => setConfirmPassword(event.target.value)}/>
                    </div>
                    {(confirm_password.length > 0 && confirm_password !== password) ? <div className='auth_warnings p-0'>passwords do not match</div> : null}


                    <button className="action_btn bn mt-4" onClick={(event) => handleSubmit(event)}>CREATE ACCOUNT</button>
                    <div className="text-center text-muted mt-4 mb-3" style={{fontSize: '1em'}}>
                        <span>Already have an account? </span>
                        <span className="ms-2 text-dark" style={{cursor: 'pointer', fontWeight: '600'}} onClick={() => {navigate('/login', {replace: true})}}>Login</span>
                    </div>

            </form>


        </div>
    )
 
}




const SignupPage = () => {

    return(
        <div>
            <NavBar/>
            <div className="row mx-2 mt-5">
                <div className='col-md-4 m-0 p-0'></div>
                <div className='main_body col-12 col-md-4 mx-0 p-0'>
                    <SignupForm/>
                </div>
                <div className='col-md-4 m-0 p-0'></div>
            </div>
        </div>
    )
}

export default SignupPage
import axios from 'axios';
import { useState } from 'react';
import settings from '../Settings.json';
import PinForm from './AdminPin.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import MyToast from '../components/ToastMessages';




const SuperLoginForm = () => {

    //States for login form
    const [showPass, setShowPass] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [pinPanel, setPinPanel] = useState(false)


    //Handle submit function
    const handleSubmit = (e) => {
        e.preventDefault() //Prevent default form submission


        //verifying the credentials entered
        if(username.length === 0 || password.length === 0){
            setError(true) //Sets an error if the credentials cannot be verified
        }
        else{

            const data = {username, password}

            axios.post(settings.SERVER_SUPER + '/auth/superlogin', data, {withCredentials: true}) //sends a request to the server
                
                .then((res) => {

                    MyToast.success({message: 'Authenticated', toastId: 'authSuccess'})

    
                    
                    setPinPanel(true)
                    
                    
                })
                .catch((err) => {
                    console.log(err)
                    MyToast.error({message: 'Error', toastId: 'super_error'})
                })
        }
    }

    const closePinPanel = () => {
        setPinPanel(false)
    }


    return(
        <div>
            {pinPanel ? <PinForm username={username} closeDialog={closePinPanel}/> : null}
            <form className='formFieldset' style={{borderTop: '2px solid red'}}>
                <div className="formLegend" style={{color: 'red'}}>SUPER LOGIN</div>
                <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: (username.length === 0 || !username.includes('@') || !username.includes('.')) && error ? 'red' : '#555555', boxShadow: (username.length === 0 || !username.includes('@') || !username.includes('.')) && error ? '0 0 4px red' : null}}>
                    {username.length > 0 ? <div className="legend">username</div> : null}
                    <input className="auth_input" type="text" placeholder="username" onChange={(event) => setUsername(event.target.value)}/>
                </div>
                {(username.length === 0) && error ?
                        <div className='auth_warnings p-0'>fill in this field</div>
                :null}

                <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: password.length === 0 && error ? 'red' : '#555555', boxShadow: password.length === 0 && error ? '0 0 4px red' : null}}>
                    {password.length > 0 ? <div className="legend">password</div> : null}
                    <input className="auth_input" type={showPass ? "text" : "password"} placeholder="password" onChange={(event) => setPassword(event.target.value)}/>
                    <span className='text-muted ms-2' style={{cursor: 'pointer'}} onClick={() => {setShowPass(!showPass)}}><FontAwesomeIcon icon={showPass ? faEyeSlash : faEye}/></span>
                </div>
                {password.length === 0 && error ? <div className='auth_warnings p-0'>please fill in this field</div> : null}

                <button className="action_btn bn mt-4" type='submit' onClick={(event) => handleSubmit(event)}>
                    LOGIN
                </button>
            </form>
        </div>
    )
}

const SuperLoginPage = () => {
    
    return(
        <div>
            <div className="row mx-2 mt-5 pt-4">
                <div className='col-md-4 m-0 p-0'></div>
                <div className='main_body col-12 col-md-4 mx-0 p-0'>
                    <SuperLoginForm/>
                </div>
                <div className='col-md-4 m-0 p-0'></div>
            </div>
        </div>
    )
    
}

export default SuperLoginPage
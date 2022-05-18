import axios from "axios";
import { useState } from "react";
import settings from '../Settings.json';
import { useNavigate, useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fontsource/wallpoet';
import MyToast from "../components/ToastMessages";




const ChangePasswordForm = (props) => {

    const [showPass, setShowPass] = useState(false)
    const [password, setPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')
    const [error, setError] = useState(false)
  

    
    const navigate = useNavigate()
    const params = useParams()

    const handleSubmit = (e) => {
        e.preventDefault()

        if(password.length === 0 || confirm_password !== password)//validate sign up data
            {
                setError(true)
            }

        else{ // proceed if data is acceptable

            const data = {password}

            axios.post(settings.SERVER_AUTH + '/change_password', data, {withCredentials: true, headers: {'modify_token' : `${params.modify_token}`}})
                .then((res) => {
                    window.localStorage.removeItem('access_token')
                    window.localStorage.removeItem('user')

                    MyToast.success({message: 'password updated', toastId: 'passchange'})
                    navigate('/login', {replace: true})
                })
                .catch((err) => {
                    console.log(err)
                    if(err.response && err.response.status === 400){
                        MyToast.error({message: 'Error: Please use latest link sent to your email', toastId: 'passchangeerror'})
                    }
                    if(err.response && err.response.status === 401){
                        MyToast.error({message: 'Error: token expired', toastId: 'passchangeerror'})
                    }
                    else{
                        MyToast.error({message: 'Error: Check your connection and try again', toastId: 'passchangeerror'})
                    }
                })

        }
    }


    


    return(
        <div>
            <form className="formFieldset">
                <div className="formLegend">CHANGE PASSWORD</div>
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


                <button className="action_btn bn mt-4" onClick={(event) => handleSubmit(event)}>CHANGE PASSWORD</button>
            </form>


        </div>
    )
 
}




const ChangePasswordPage = () => {

    return(
        <div>
            <div className="text-center ms-auto py-0 my-auto" style={{fontFamily: 'Wallpoet', fontSize: '1.5em', cursor: 'pointer', width: '100%'}}>MITRENDI</div>

            <div className="row mx-2 mt-5">
                <div className='col-md-4 m-0 p-0'></div>
                <div className='main_body col-12 col-md-4 mx-0 p-0'>
                    <ChangePasswordForm/>
                </div>
                <div className='col-md-4 m-0 p-0'></div>
            </div>
        </div>
    )
}



export default ChangePasswordPage
import axios from 'axios';
import reduxSettings from '../reduxSettings.json';
import settings from '../../Settings.json'
import MyToast from '../../components/ToastMessages';



const addOrders = orders => ({
    type: reduxSettings.LOAD_ORDERS,
    payload: orders
})

export const startOrderFetch = () => {

    return(
        (dispatch) => {
            axios.get(settings.SERVER_ORDER + '/myOrders', {withCredentials: true, headers: {'access_token' : window.localStorage.getItem('access_token')}})
                .then((res) => {
                    dispatch(addOrders(res.data))
                })
                .catch((err) => {
                    if(err.response && err.response.status === 403){
                        window.location.replace('/login')
                        MyToast.inform({message: 'Login to continue', toastId: 'login_prompt'})
                    }
                    else if(err.response && err.response.status === 500){
                        MyToast.warn({message: 'Something went wrong, please try again', toastId: 'server_error'})
                    }
                    console.log(err)
                })
        } 
    )
}
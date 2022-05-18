import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { faExclamationCircle, faCog } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";



const MyToast = {
    // message toastId  (props required)

    success: (props) => {
                const message = (
                    <div className="px-2" style={{color: '#006600', fontSize: '1em', fontWeight: 450}}>
                        <span className="me-4"><FontAwesomeIcon icon={faCheckCircle}/></span>
                        <span>{props.message}</span>
                    </div>
                )
            
                toast(message, {
                    toastId: props.toastId,
                }) 
            },
    
    inform: (props) => {
                const message = (
                    <div className="px-2" style={{color: '#000066', fontSize: '1em', fontWeight: 450}}>
                        <span className="me-4"><FontAwesomeIcon icon={faExclamationCircle}/></span>
                        <span>{props.message}</span>
                    </div>
                )

                toast(message, {
                    toastId: props.toastId,
                }) 
            },

    error: (props) => {
                const message = (
                    <div className="px-2" style={{color: '#880000', fontSize: '1em', fontWeight: 500}}>
                        <span className="me-4"><FontAwesomeIcon icon={faExclamationCircle}/></span>
                        <span>{props.message}</span>
                    </div>
                )
            
                toast(message, {
                    toastId: props.toastId
                })
            },

    warn: (props) => {
                const message = (
                    <div className="px-2" style={{color: '#cc6611', fontSize: '1em', fontWeight: 450}}>
                        <span className="me-4"><FontAwesomeIcon icon={faExclamationCircle}/></span>
                        <span>{props.message}</span>
                    </div>
                )
            
                toast(message, {
                    toastId: props.toastId
                })
            },
    
    setPromise: (props) => {
                const message = (
                    <div className="px-2" style={{color: '#454545', fontSize: '1em', fontWeight: 450}}>
                        <span className="me-4 spin"><FontAwesomeIcon icon={faCog}/></span>
                        <span>{props.message}</span>
                    </div>
                )
            
                toast(message, {
                    toastId: props.toastId,
                    autoClose: false
                })
            },
    
    resolvePromise: (props) => {
        // message toastId promiseId type

        const message = (
            props.type === 'success' ? 
                <div className="px-2" style={{color: '#006600'}}>
                    <span className="me-4"><FontAwesomeIcon icon={faCheckCircle}/></span>
                    <span>{props.message}</span>
                </div>
            : props.type === 'error' ? 
                <div className="px-2" style={{color: '#880000'}}>
                    <span className="me-4"><FontAwesomeIcon icon={faExclamationCircle}/></span>
                    <span>{props.message}</span>
                </div>
            : props.type === 'warn' ? 
                <div className="px-2" style={{color: '#cc6611'}}>
                    <span className="me-4"><FontAwesomeIcon icon={faExclamationCircle}/></span>
                    <span>{props.message}</span>
                </div>
            : 
                <div className="px-2" style={{color: '#454545'}}>
                    <span className="me-4 spin"><FontAwesomeIcon icon={faCog}/></span>
                    <span>{props.message}</span>
                </div>
        )

        toast.update(props.promiseID, {
            render: message,
            autoClose: 4000,
            toastId: props.toastId
        })
    },

    dismissPromise: (props) => {
        toast.dismiss(props.promiseID)
    }
}


export default MyToast
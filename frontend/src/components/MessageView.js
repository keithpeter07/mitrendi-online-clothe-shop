import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";


const MessageView = (props) => {
    const colors = ['#002277', '#880000', '#008800']
    const icons = [
        <FontAwesomeIcon icon={faInfoCircle}/>,
        <FontAwesomeIcon icon={faExclamationCircle}/>,
        <FontAwesomeIcon icon={faCheckCircle}/>
    ]

    const clearMessage = () => {
        props.clearMessage()
    }

    return(
        <div> 
            <div className="tint"></div> 
            <div className="confirm_location_selection_cont py-4 px-3" style={{border: `1px solid ${colors[props.type]}`}}>
                <div className="mx-1">
                    <div className="me-3" style={{color: colors[props.type], fontSize: '1.2em'}}>{icons[props.type]}</div>
                    <div className="text-left px-2" style={{color: 'black', fontSize: '1.2em'}}>{props.message}</div>
                </div>
                <div className="d-flex flex-column">
                    <button className="action_btn bn mt-4" style={{backgroundColor: '#555555', color: 'white', letterSpacing: '.1em'}} onClick={clearMessage}>
                        GOT IT
                    </button>
                </div>
            </div>
        </div>
    )
}


export const ConfirmBox = (props) => {
    const colors = ['#002277', '#880000', '#005511']
    const icons = [
        <FontAwesomeIcon icon={faInfoCircle}/>,
        <FontAwesomeIcon icon={faExclamationCircle}/>,
        <FontAwesomeIcon icon={faCheckCircle}/>
    ]

    const clearMessage = () => {
        props.clearMessage()
    }

    const proceed = () => {
        props.proceed()
    }

    return(
        <div> 
            <div className="tint"></div> 
            <div className="confirm_location_selection_cont py-4 px-3" style={{border: `1px solid ${colors[props.type]}`}}>
                <div className="mx-1">
                    <div className="me-3" style={{color: colors[props.type], fontSize: '1.2em'}}>{icons[props.type]}</div>
                    <div className="text-left px-1" style={{color: 'black', fontSize: '1.2em'}}>{props.message}</div>
                </div>
                <div className="d-flex flex-column">
                    <button className="action_btn bn mt-4" style={{backgroundColor: '#555555', color: 'white', letterSpacing: '.1em'}} onClick={clearMessage}>
                        CANCEL
                    </button>
                    <button className="action_btn bn mt-4" style={{backgroundColor: props.type===1 ? '#550000' : '#000055', color: 'white', letterSpacing: '.1em'}} onClick={proceed}>
                        PROCEED
                    </button>
                </div>
            </div>
        </div>
    )
}


export default MessageView
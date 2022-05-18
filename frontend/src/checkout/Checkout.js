import React, { useEffect, useState } from "react";
import { faSortDown, faTimesCircle, faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import NavBar from "../components/NavBar";
import pickupData from "./pickupData";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import settings from '../Settings.json'
import MyToast from '../components/ToastMessages'
import { startFetch } from '../redux/items/actions'
import { clearCart } from "../redux/cart/actions";

import {io} from 'socket.io-client'
let stream


const mapCartStateToProps = state => ({
    cart: state.cart.cart
})
const CheckoutForm = connect(mapCartStateToProps)(
    (props) => {

        //States
        const [selectedArea, setSelectedArea] = useState(1)
        const [selectedLocation, setSelectedLocation] = useState(null)
        const [locationTextValue, setLocationTextValue] = useState('')
        const [showAreas, setShowAreas] = useState(false)
        const [pickupNote, setPickupNote] = useState('')
        const [loc_error, setLoc_error] = useState(false)


        //Component Variables
        const Areas = ['NAIROBI CBD', 'NAIROBI', 'OTHER COUNTIES']
        const locationAreas = [pickupData.Nairobi_CBD, pickupData.Nairobi_Metropolitan, pickupData.Other_Counties]



        const updateSelectedArea = (index) => { //Updates when a user selects an area
            setSelectedArea(index)
            setSelectedLocation(null) //Returns the selected location to null when area changes
            setShowAreas(false)
        }

        const updateSelectedLocation = (index) => { //Updates when a user selects a location
            setSelectedLocation(index)
            setLoc_error(false)

            document.getElementById("location_input").value = null
        }


        const setAreaButtons = () => { //Lays out the area buttons 
            let areaList = []
            for(let area of Areas){
                areaList.push(
                    <button className="area_button px-4" onClick={() => updateSelectedArea(Areas.indexOf(area))}>{area}</button>
                )
            }
    
            return(areaList)
        }


        const setLocationButtons = () => { //Lays out the location buttons
            let locationList = []
            
            for(let loctn of locationAreas[selectedArea].filter(loc => loc.toUpperCase().includes(locationTextValue.toUpperCase()))){ //Filters to find what the user types in
                locationList.push(
                    <button key={locationList.length} className="area_button px-4" onClick={() => updateSelectedLocation(locationAreas[selectedArea].indexOf(loctn))}>{loctn}</button>
                )
            }
    
            if(locationList.length === 0 && locationTextValue.length > 0){
                return(
                    <button className="area_button px-4 text-danger">SELECT THE CORRECT AREA FIRST</button>
                )
            }
    
            return (locationList)
        }
    
        const getSelectedArea = () => { //gets the name of the selected area
            return(
                Areas[selectedArea]
            )
        }

        const getSelectedLocation = () => { //gets the name of the selected location
            if(selectedLocation !== null){
                return locationAreas[selectedArea][selectedLocation]
            }
            else{
                return(null)
            }
        }

        const getLocationPlaceholder = () => { //gets the placeholder for the location field
            const placeholder = getSelectedLocation()
            if(placeholder === null){
                return ("type in your location and select below")
            }
            else{
                return(placeholder)
            }
        }


        const getTotal = () => { //gets the total price of the items 
            let totalPrice = 0
            let locationState = props.locationState
    
            if(locationState !== null && locationState.item){
                totalPrice += locationState.item.price
            }
            else{
                for(let cartItem of props.cart){
                    totalPrice += cartItem.price
                }
            }
    
            if(selectedLocation !== null){ 
                totalPrice += (selectedArea===0 ? 100 : selectedArea === 1 ? 180 : 250)
            }
    
            return totalPrice
        }


        const handleSubmit = () => { //handles the submit request
            let area = getSelectedArea();
            let loc = getSelectedLocation();
            let note = pickupNote
    
            if(loc === null){ //checks if the location was selected
                area = 0
                loc = 0

                setLoc_error(true) //sets error to true if location was not selected
            }
    
            const data = {
                area: area,
                loc: loc,
                note: note,
                item: props.locationState !== null && props.locationState.item ? props.locationState.item : null,
                totalAmount: getTotal()
            }
    
            props.confirmSelections(data)
    
        }



        return(
            <div>
                <br/>
                <div>
                    <div className=" d-flex flex-column">
                        {props.locationState!==null && props.locationState.item ? <div className="text-start text-muted p-0 m-0 ps-3 mb-2" style={{}}>Quick buy (1 item)</div> : <div className="text-start text-muted p-0 m-0 ps-3 mb-2" style={{}}>Cart checkout ({props.cart.length} {props.cart.length > 1 ? 'items' : 'item'})</div> }
                        <div className="text-start text-muted p-0 m-0 ps-3" style={{}}>TOTAL: ksh <span style={{color: '#00aa00', fontWeight: '550'}}>{getTotal().toLocaleString()} </span>{selectedLocation === null ? null : '  (This includes delivery fee)'}</div><br/>

                        <div className="text-start text-muted p-0 m-0 ps-3" style={{}}>Select your delivery destination below.</div>
                    </div>
                    <br/>
                    <div className="formFieldset">
                        <div className="formLegend">ORDER DETAILS</div>
                        
                        <div className="chkt_fieldset d-flex flex-column justify-content-center px-3 pe-4" onClick={() => {setShowAreas(!showAreas)}}>
                            {/* <div className="legend">area</div> */}
                            <div className="d-flex flex-row align-items-center" style={{width: '100%'}}>
                                <div>{Areas[selectedArea]}</div>
                                <div className="justify-content-end ms-auto" style={{fontSize: '1.2em'}}><FontAwesomeIcon icon={faSortDown}/></div>
                            </div>
                        </div>
                        {showAreas ? <div className="p-0 mb-4" style={{overflow: 'hidden', marginTop: '-.7em', height: 'fit-content'}}>
                            <div className="areas_container m-0" style={{borderRadius: '10px', backgroundColor: '#dddddd'}}>
                                {setAreaButtons()}
                            </div>
                        </div> : null}
                        <div className="fieldset d-flex flex-row align-items-center px-3" style={{boxShadow: loc_error ? '0 0 5px red' : null}}>
                            {/* <div className="legend">location</div> */}
                            <input id="location_input" className="auth_input" type="text" placeholder={getLocationPlaceholder()} style={{color: 'black'}} onChange={event => setLocationTextValue(event.target.value)}/>
                            {/* <div className="justify-content-end ms-auto" style={{fontSize: '1.2em'}}><FontAwesomeIcon icon={faSortDown}/></div> */}
                        </div>

                        <div className="p-0 mb-4" style={{overflow: 'hidden', marginTop: '-.7em', height: 'fit-content'}}>
                            <div className="areas_container m-0 loc_btn_cont" style={{borderRadius: '10px', backgroundColor: '#dddddd'}}>
                                {setLocationButtons()}
                            </div>
                        </div>
                        <div>
                            <textarea className="loc_textarea p-2" placeholder="Type in any more information about your package delivery" onChange={(event) => {setPickupNote(event.target.value)}}></textarea>
                        </div>
                        <button className="action_btn bn mt-4" onClick={handleSubmit}>
                            CONFIRM SELECTION
                        </button>
                    </div>

                    <br/>
                    <br/>
                    <div className="text-left text-muted p-0 m-0 ps-3" style={{}}>Please note that our products are delivered via <span style={{color: '#440000'}}>'Pick-up Mtaani'</span> delivery</div>
                </div>
            </div>
        )

    }
)




const mapDispatchToProps = dispatch => ({
    CLEAR_CART: () => dispatch(clearCart()),
    REFRESH_ITEMS: () => dispatch(startFetch())
})



const ConfirmSelection = connect(mapCartStateToProps, mapDispatchToProps)(class ConfirmSelection extends React.Component{
    constructor(props){
        super(props);
        this.state={
            pay: false,
            page: 0,
            error: {active: false, code: '', message: ''},
            MPESA_phonenumber: '',
            prev_num: ''
        }
    }
    

    

    setProceed = () => {
        this.setState({
            page: 1
        })
    }

    setPhoneNumber = event => {
        this.setState({
            MPESA_phonenumber : event.target.value
        })
    }

    setPay = () => {
        setTimeout(() => {
            this.setState({
                pay: true
            })
        }, 4000)
    }

    fetch_updated_user_data = () => {
        return new Promise((resolve) => {
            axios.get(settings.SERVER_AUTH + '/fetch_user', {withCredentials: true, headers: {'access_token' : window.localStorage.access_token}})
                .then((results) => {
                    window.localStorage.setItem('user', JSON.stringify(results.data))
                    resolve()
                })
        })
    }

    select_Previous_MPESA_Number = () => {
        document.getElementById('MPESA_number').value = this.state.prev_num.substring(3)
        this.setState({
            MPESA_phonenumber: this.state.prev_num.substring(3)
        })
    }

    componentDidMount(){
        if(window.localStorage.user){
            const user_MPESA_phonenumber = JSON.parse(window.localStorage.user).MPESA_phonenumber
            if(user_MPESA_phonenumber !== undefined){
                this.setState({
                    prev_num: user_MPESA_phonenumber
                })
            }
        }
    }




    ListenToPayment = (initial_MRID) => {

        stream.on('Recieved-Payment', (MRID) => {//Listen on event
            if(MRID === initial_MRID){//check if MIRDs match
                MyToast.success({message: 'Payment recieved', toastId: 'payment-verification'})//Show success message

                this.setState({
                    page: 3
                })

                stream.disconnect()

                if(this.props.locationState === null || this.props.locationState === undefined) { this.props.CLEAR_CART() } 
            }
        })
    }

    postOrder = () => {
        

        //Connecting to the web socket to listen to payments recieved
        stream = io(settings.SERVER_WEB_SOCKET)



        let raw_phone_number = this.state.MPESA_phonenumber
        if(raw_phone_number.charAt(0) === '0'){
            raw_phone_number = raw_phone_number.substring(1)
        }

        this.setState({
            page: 1.5
        })

        raw_phone_number = '254' + raw_phone_number

        

        const data = {
            item_name_array : this.props.item === null ? this.props.cart.map(cartItem => [cartItem.name, cartItem.image1]) : [[this.props.item.name, this.props.item.image1]],
            item_id_array : this.props.item === null ? this.props.cart.map(cartItem => (cartItem._id)) : [this.props.item._id],
            MPESA_phonenumber : raw_phone_number,
            amount_to_be_paid : this.props.totalAmount,
            pickup_area : this.props.area,
            pickup_location : this.props.loc,
            pickup_note : this.props.note
        }

        axios.post(settings.SERVER_ORDER + '/addPendingOrder', data, {withCredentials: true, headers: {'access_token' : window.localStorage.getItem('access_token')}})
            .then((results) => {
                if(results.data.error){
                    this.setState({
                        error: {active: true, code: results.data.error.errorCode, message: results.data.error.errorMessage}
                    })
                }
                else{
                    this.ListenToPayment(results.data.MerchantRequestID)

                    this.setState({
                        page: 2
                    })

                    this.fetch_updated_user_data()
                    this.props.REFRESH_ITEMS()
                }
            })
            .catch((err) => {
                MyToast.error({message: 'An error occured, check your connection and try again', toastId: 'payError'})
                console.log(err)
            })
    }

    layoutPhoneNumber = () => {
        let country_code = '+' + this.state.prev_num.substring(0,3)
        let num_part_list = this.state.prev_num.substring(3).split('') 
        num_part_list[(num_part_list.length-2)] = '*'
        num_part_list[(num_part_list.length-3)] = '*'
        num_part_list[(num_part_list.length-4)] = '*'
        
        let num_part = num_part_list.toString().replaceAll(',', '')

        const MPESA_phonenumber = country_code + ' ' + num_part

        return MPESA_phonenumber
    }

    render(){
        return(

            <div>
                
                <div className="tint"></div>
                { (this.state.page === 0 && !this.state.error.active) ? 
                    <div className="confirm_location_selection_cont py-4 px-3">
                        {this.props.area === 0 && this.props.loc === 0 ? 
                            <div className="mx-1">You have not selected the required fields, please do so and try again</div>
                        :
                            <div className="mx-1">
                                You have selected: <br/> <span style={{color: '#990000', fontWeight: '600'}}>{this.props.area}</span> area <br/> <span style={{color: '#990000', fontWeight: '600'}}>{this.props.loc}</span> location
                                {this.props.note.length > 0 ? <span className="d-block mt-2">You left a note as well</span> : null}
                                <span className="d-block mt-2">total amount to be paid is: <span className="d-block" style={{color: '#005500', fontWeight: '650'}}>ksh {this.props.totalAmount.toLocaleString()}</span></span>
                            </div>
                        }




                        <div className="d-flex flex-column">
                            <button className="action_btn bn mt-4" style={{backgroundColor: '#999999', color: 'black', letterSpacing: '.1em'}} onClick={this.props.closeDialog}>
                                GO BACK
                            </button>
                            {this.props.area !== 0 && this.props.location !== 0 ? 
                                <button className="action_btn bn mt-4" style={{backgroundColor: '#000000', color: 'white', letterSpacing: '.1em'}} onClick={this.setProceed}>
                                    PROCEED
                                </button>
                            : null}
                        </div>
                    </div>

                :  (this.state.page === 1 && !this.state.error.active) ? 
                    <div className="confirm_location_selection_cont py-4 px-3">
        
                        <div className="navbutton panel_closer" style={{zIndex:101, color:'#454545', position: 'absolute', top: '0', right: '0', cursor: 'pointer'}} onClick={this.props.closeDialog}>
                            <span><FontAwesomeIcon icon={faTimesCircle}/></span>
                        </div>

                        {this.state.prev_num.length > 0 ? 
                        <div className="text-center">
                            <div className="mx-1">Select previously used MPESA number</div>

                            <div className="action_btn bn mt-2 d-flex flex-row justify-content-center align-items-center" style={{backgroundColor: '#dfdfdf', color: 'black'}} onClick={this.select_Previous_MPESA_Number}>
                                <div style={{color: '#009900', cursor: 'pointer'}}>{this.layoutPhoneNumber()}</div>
                            </div> 

                            <br/>
                            <br/>
                            or
                            <hr/>

                        </div>
                        : null}

                        <div className="mx-1 mt-4">Enter your MPESA number below as shown:</div>
                    
                        <div className="fieldset d-flex flex-row align-items-center px-3">
                            <div className="d-flex justify-content-center align-items-center pe-2" style={{height: '100%', borderRight: '1px solid black'}}>+254</div>
                            <input id='MPESA_number' className="auth_input ps-2" type="text" pattern="[0-9]*" inputMode="numeric" maxLength={10} placeholder="7123456789" style={{color: 'black'}} onChange={event => this.setPhoneNumber(event)}/>
                        </div>

                        <div className="d-flex flex-column">
                            <button className="action_btn bn mt-4" style={{backgroundColor: this.state.MPESA_phonenumber.length < 9 || this.state.MPESA_phonenumber.length > 10 ? '#454545' : '#000000', color: 'white', letterSpacing: '.1em'}} disabled={this.state.MPESA_phonenumber.length < 9 || this.state.MPESA_phonenumber.length > 10 ? true : false} onClick={this.postOrder}>
                                PROCEED
                            </button>
                        </div>
                    </div>

                : (this.state.page === 1.5 && !this.state.error.active) ? 
                    <div className="confirm_location_selection_cont py-4 px-3">
                        <div className="d-flex flex-row justify-content-center"><div className="spin p-0 m-0 text-center" style={{fontSize: '1.7em'}}><FontAwesomeIcon icon={faCog}/></div><div className="m-0 p-0 pt-2 ms-3"> Sending request</div></div>
                    </div>

                : (this.state.page === 2 && !this.state.error.active) ?
                    <div className="confirm_location_selection_cont py-4 px-3">
                        {this.setPay()}
            
                        <div className="navbutton panel_closer" style={{zIndex:101, color:'#454545', position: 'absolute', top: '0', right: '0', cursor: 'pointer'}} onClick={this.props.closeDialog}>
                            <span><FontAwesomeIcon icon={faTimesCircle}/></span>
                        </div>

                        <div className="mx-1">Check your MPESA mobile phone for the PIN prompt</div>
                        <br/>
                        <hr/>
                        <br/>
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-center"><div className="spin p-0 m-0 text-center" style={{fontSize: '1.7em'}}><FontAwesomeIcon icon={faCog}/></div><div className="m-0 p-0 pt-2 ms-3"> Checking payment... please wait</div></div>
                        </div>
                    </div>
                
                : (this.state.page === 3 && !this.state.error.active) ?
                    <div className="confirm_location_selection_cont py-4 px-3">

                        <div className="mx-1" style={{textAlign: 'center'}}><span style={{fontWeight: 500}}>Thank you for shopping with us.</span> Your order will be dispatched soon.</div>

                        <div className="d-flex flex-column">
                            <button className="action_btn bn mt-4" style={{backgroundColor: '#EE7B00', color: 'white', letterSpacing: '.1em'}} onClick={() => {this.props.closeDialog(); this.props.navigate('/shop', {replace: true})}}>
                                CONTINUE SHOPPING
                            </button>
                        </div>
                    </div>

                : this.state.error.active ?
                <div className="confirm_location_selection_cont py-4 px-3">
        
                    <div className="navbutton panel_closer" style={{zIndex:101, color:'#454545', position: 'absolute', top: '0', right: '0', cursor: 'pointer'}} onClick={this.props.closeDialog}>
                        <span><FontAwesomeIcon icon={faTimesCircle}/></span>
                    </div>

                    <div className="mx-1" style={{fontWeight: 650}}>ERROR: {this.state.error.code}</div>
                    <br/>
                    <div className="mx-1">{this.state.error.message}</div>
                </div>

                : null
                }
                
            </div>
        )
    }
})




const Checkout = (props) => {
    const [dialogBox, setDialogBox] = useState(null)
    const navigate = useNavigate()
    const { state } = useLocation()


    const closeDialog = () => {
        setDialogBox(null)
    }

    const confirmSelections = (props) => {
        setDialogBox(
            <ConfirmSelection {...props} locationState={state} closeDialog={closeDialog} navigate={nav}/>
        )
    }

    const nav = (link, state=null) => {
        if(state===null){
            navigate(link)
        }
        else{
            navigate(link, state)
        }
    }

    useEffect(() => {
        if(!(window.localStorage.access_token && window.localStorage.user)){
            navigate('/login', {replace: true})
        }
        window.scrollTo({top: 0})
    })

    return(
        <div>
                <NavBar/>
                <div className="row mx-2 mx-mb-5">
                    {dialogBox}
                    <div className='col-md-3 m-0 p-0'></div>
                    <div className='main_body col-12 col-md-6 mx-0 p-0'>
                        <CheckoutForm confirmSelections={confirmSelections} locationState={state} navigate={nav}/>
                    </div>
                    <div className='col-md-3 m-0 p-0'></div>
                </div>
            </div>
    )
}

export default Checkout
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft, faCheckDouble, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { startOrderFetch } from '../redux/orders/actions';
import { connect } from 'react-redux';
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router";
import MyToast from "../components/ToastMessages";


class LayOrders extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showInfo: false,
            showItems: true
        }
    }

    toggleShowInfo = () => {
        this.setState({
            showInfo: !this.state.showInfo
        })
    }

    render(){
        return(
        <div className="m-0 p-0 mb-3 pb-3" style={{borderBottom: '1px solid #dddddd'}}>
            <div className="p-0 m-0 px-1 px-md-4">
                <div className="text-muted mb-2 selectable" style={{fontSize: '.8em'}}>Order ID: {this.props.order._id} <button className="ms-3 d-inline-block button blank_button text-muted" style={{fontSize: '1.3em', cursor: 'pointer'}} onClick={() => navigator.clipboard.writeText(this.props.order._id)}><FontAwesomeIcon icon={faCopy}/></button></div>
                <div style={{width: '100%'}}> 
                    <div style={{textAlign:'left', letterSpacing:'2px', color: '#565656', fontWeight: 'bold', fontSize: '.9em'}}><ul style={{listStyle: 'none'}}>{this.props.order.item_name_array.map((item_name, index) => <li key={index}>{item_name[0].toUpperCase()}</li>)}</ul></div>
                    <div className="ms-4 d-flex flex-row" style={{textAlign:'left', color: '#227722', fontSize: '.8em'}}>ksh {this.props.order.amount_paid.toLocaleString()}
                        <div className="justify-self-end ms-auto me-4" style={{fontSize: '1.5em', color: '#449944'}}><FontAwesomeIcon icon={faCheckDouble}/></div>
                    </div>
                </div>
            </div>
            <div className="ms-4 pt-3" style={{overflow: 'hidden'}}>
                <div style={{overflow: 'hidden'}}>
                {this.state.showInfo ? <div className="p-0 m-0 ps-1 px-md-4 d-flex flex-column justify-content-center order_data">
                    <div style={{textAlign:'left', letterSpacing:'1px', color: '#565656', fontWeight: 'bold', fontSize: '.9em'}}> Pickup location : {this.props.order.pickup_location.toUpperCase()}</div>
                    <div style={{textAlign:'left', letterSpacing:'1px', color: this.props.order.dispatched ? '#444499' : '#449944', fontWeight: 'bold', fontSize: '.9em'}}> { this.props.order.dispatched ? "dispatched" : "dispatching..." } {this.props.order.dispatched ? null : <FontAwesomeIcon icon={faSpinner}/>} </div>
                </div> : null}
                </div>
                <button className="px-1 py-0 button blank_button m-1" style={{cursor: 'pointer', border: '1px solid black', borderRadius: '5px', width: 'fit-content', fontSize: '.8em'}} onClick={this.toggleShowInfo}>{this.state.showInfo ? 'less' : 'more'}</button>
            </div>
        </div>
        )
    }
}


const mapStateToProps = state => ({
    orders : state.order.orders
})
const mapDispatchToProps = dispatch => ({
    START_ORDER_FETCH : () => dispatch(startOrderFetch())
})

const OrdersView = connect (mapStateToProps, mapDispatchToProps)(class OrdersView extends React.Component{
    constructor(props){
        super(props);
        this.state={
            orders : []
        }
    }

    orderList = () => {
        const orderList = []

        for(let order of this.props.orders){
            orderList.push(<LayOrders order={order}/>)
        }

        this.setState({
            orders: this.props.orders.map((order, index) => <LayOrders key={index} order={order}/>)
        })
    }

    componentDidMount(){
        if(this.props.orders.length > 0){
            this.orderList()
        }
        
        this.props.START_ORDER_FETCH()
    }
     componentDidUpdate(prevProps){
         if(prevProps !== this.props){
             this.orderList()
         }
     }

     logout = () => {
         window.localStorage.removeItem('access_token')
         window.localStorage.removeItem('user')

         MyToast.success({message: 'Logged out', toastId: 'logout'})
         this.props.navigateTo('/login', {replace: true})
     }


     getFirstname = () => {
         let firstname = ''
        if(window.localStorage.user){
            firstname = JSON.parse(window.localStorage.getItem('user')).firstname.charAt(0).toUpperCase() + JSON.parse(window.localStorage.getItem('user')).firstname.substring(1).toLowerCase()
        }

        return firstname
     }

    

    render(){
        return(
            <div>
                <NavBar/>
                <div className="row mx-2">
                    <div className='col-md-1 m-0 p-0'></div>
                    <div className='main_body col-12 col-md-10 m-0 p-0 my-5'>
                        <div className="d-flex flex-row">
                            <div className="text-start text-muted p-0 m-0 ps-4" style={{}}>Hi {this.getFirstname()}</div>
                            <div className="ms-auto justify-self-end text-muted p-0 m-0 pe-4" style={{cursor: 'pointer'}} onClick={this.logout}>logout <FontAwesomeIcon icon={faSignOutAlt}/></div>
                        </div>
                        <br/>
                        <div className="row p-0 m-0 py-2" style={{borderBottom: '1px solid #cccccc', borderTop: '1px solid #cccccc'}}>
                            <div className="col-6 ps-4 text-muted">YOUR ORDERS</div>
                        </div>
                        <br/>
                        {this.state.orders}
                        <br/>
                        <div className="m-0 p-0 d-flex flex-column flex-md-row" style={{width: '100%'}}>
                            <div className="px-2" style={{color: '#ff8c00', borderBottom: '1px solid #ff8c00', width: 'fit-content', fontSize: '1.3em', cursor: 'pointer'}} onClick={() => {this.props.navigateTo('/shop')}}>
                                <FontAwesomeIcon icon={faArrowLeft}/> back to shop?
                            </div>
                        </div>
                    </div>
                    <div className='col-md-1 m-0 p-0'></div>
                </div>
            </div>
        )
    }
})




const ProfileView = () => {
    const navigate = useNavigate()

    const navigateTo = (link, state=null) => {
        if(state===null){
            navigate(link)
        }
        else{
            navigate(link,state)
        }
    }

    return(
        <div>
            <OrdersView navigateTo={navigateTo}/>
        </div>
    )
}

export default ProfileView
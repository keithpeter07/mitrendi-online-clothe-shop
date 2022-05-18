import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown, faTruckLoading, faArchive, faBoxOpen, faTruck, faSortUp, faCheck, faFilter, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import MessageView, { ConfirmBox } from '../components/MessageView';
import axios from 'axios';
import settings from '../Settings.json'
import { useLocation, useNavigate } from 'react-router';
import AdminNavBar from './AdminNavbar';
import MyToast from '../components/ToastMessages';


const OrderItems = (props) => {
    const [packed, togglePacked] = useState(props.dispatched)

    return(
        <div className='row m-0 p-0 py-2' style={{backgroundColor: '#ffffff', overflow: 'hidden', borderBottom: '1px dashed #dddddd'}}>
            <div className='col-3 p-0 m-0 px-md-3 px-1' style={{overflow: 'hidden'}}>
                <div className="item_image_cont">
                    <img className="item_image image-fluid" src={settings.SERVER_STATIC + props.order_item.image1} alt="item"/>
                </div>
            </div>
            <div className='col-6 p-0 m-0 px-md-3 px-1' style={{overflow: 'hidden', color: '#575757'}}>
                <div className=''>
                    <div className='col-5 p-0 m-0 px-md-3 px-1'>
                        {props.order_item.item_name.toUpperCase()}
                    </div>

                    <div>
                        <button className="navbutton " style={{background: 'transparent', color: '#575757', fontSize: '1em'}} >
                            <FontAwesomeIcon icon={faCopy}/>
                        </button>
                        <span style={{fontWeight: '700', color: 'black', marginLeft: '.5em'}}>ID</span>
                    </div>
                </div>
            </div>
            <div className='col-3 p-0 m-0 px-md-3 px-1'>
                <button className="action_btn bn mt-2" style={{background: 'transparent', color: packed ? '#454545' : '#770000'}} onClick={() => togglePacked(!packed)} disabled={props.dispatched}>
                    {packed ? <FontAwesomeIcon icon={faArchive}/> : <FontAwesomeIcon icon={faBoxOpen}/>}
                </button>
            </div>
        </div>
    )
}


class LayOrders extends React.Component{
    constructor(props){
        super(props)
        this.state={
            dialogBox: null,
            showItems: false
        }
    }

    setItems = () => {
        let Items = []
        for(let i in this.props.order.item_name_array){
            let order_item = {item_name: this.props.order.item_name_array[i][0], item_id: this.props.order.item_id_array[i], image1 : this.props.order.item_name_array[i][1]}
            Items.push(<OrderItems key={this.props.order.item_id_array[i]} order_item={order_item} dispatched={this.props.order.dispatched}/>)
        }

        return <div className='drop_in_slow' style={{borderRadius: '10px', overflow: 'hidden'}}>{Items}</div>
    }

    clearMessage = () => {
        this.setState({
            dialogBox: null
        })
    }

    clearAndReload = () => {
        this.setState({
            dialogBox: null
        })
        window.location.reload()
    }

    confirmDispatch = () => {
        this.setState({
            dialogBox: <ConfirmBox type={0} message={`Proceed to dispatch order by ${this.props.order.owner_name.toUpperCase()} ?`} clearMessage={this.clearAndReload} proceed={this.dispatchOrder}/>
        })
    }

    dispatchOrder = () => {
        const data = {item_id_array: this.props.order.item_id_array, _id: this.props.order._id}

        console.log(data)

        axios.post(settings.SERVER_SUPER+'/order/dispatchOrder', data, {withCredentials: true, headers: {'access_token' : window.sessionStorage.access_token, 'username' : window.sessionStorage.username}})
            .then((res) => {
                this.setState({
                    dialogBox: <MessageView type={2} message={`Order by ${this.props.order.owner_name.toUpperCase()} has been dispatched`} clearMessage={this.clearAndReload}/>
                })
            })
            .catch((err) => {
                console.log(err)
                this.setState({
                    dialogBox: null
                })
                MyToast.error({message: `Error ${err.response ? err.response.status : null}`, toastId: 'errerrerr' })
            })
    }

    render(){
        return(
            <div>
                {this.state.dialogBox}
                <div className="row m-0 p-0 my-2 py-2">
                    <div className="col-5 p-0 m-0 px-md-3 px-1 d-flex flex-column">
                        <div style={{textAlign:'left', fontSize:'.9em', fontWeight: '650', color:'#656565', letterSpacing: '.1em'}}>{this.props.order.owner_name.toUpperCase()}</div>
                        <div style={{textAlign:'left', fontSize:'.9em', fontWeight: '650', color:'#656565', letterSpacing: '.1em'}}>{this.props.order.owner_phone_number}</div>
                        <div style={{textAlign:'left', color: '#002277', fontSize: '.85em', fontWeight: '650'}}>{this.props.order.pickup_area}</div>
                        <div style={{textAlign:'left', color: '#002277', fontSize: '.85em', fontWeight: '650'}}>{this.props.order.pickup_location}</div>
                       <div style={{textAlign:'left', letterSpacing:'2px', color: '#565656', fontWeight: 'bold', fontSize: '.9em'}}>{this.props.order.dispatched ? <span style={{color: '#002277'}}><FontAwesomeIcon icon={faTruck}/></span> : <span style={{color: '#770000'}}><FontAwesomeIcon icon={faTruckLoading}/></span>}</div>
                    </div>
                    <div className="col-5 p-0 m-0 px-md-3 px-1 d-flex flex-column justify-content-center">
                        <div className="d-flex flex-column pe-md-5 pe-1" style={{overflowX: 'hidden'}}>
                            <div style={{textAlign:'left', fontSize:'.9em', fontWeight: '650', color: '#575757'}}>ksh <span style={{color: '#007722'}}>{this.props.order.amount_paid.toLocaleString()}</span></div>
                            <div className="fieldset d-flex flex-row align-items-center px-md-3 px-1">
                                <div className="legend" style={{fontSize: '.89em'}}>note</div>
                                <input className="auth_input" type="text" value={this.props.order.pickup_note} style={{color: '#575757', fontSize: '.89em', cursor: 'pointer'}} disabled/>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 p-0 m-0 d-flex flex-column justify-content-center align-items-center">
                        <div style={{fontSize: '.8rem'}}>
                            {new Date(this.props.order.createdAt).toDateString()}
                        </div>
                        <button className="action_btn bn mt-2" style={{background: 'transparent', color: '#474747', fontSize: '1.3em'}} disabled={this.props.order.dispatched ? true : false} onClick={this.confirmDispatch}>
                            {!this.props.order.dispatched ? <FontAwesomeIcon icon={faTruck}/> : <FontAwesomeIcon icon={faCheck}/>}
                        </button>
                        {this.props.order.dispatched ?
                        <div style={{fontSize: '.8rem', color: '#000077'}}>
                            {new Date(this.props.order.updatedAt).toDateString()}
                        </div>
                        : null}
                        <button className="action_btn bn mt-2" style={{background: 'transparent', color: '#474747', fontSize: '1.3em'}} onClick={() => {this.setState({showItems: !this.state.showItems})}}>
                            {this.state.showItems ? <FontAwesomeIcon icon={faSortUp}/> : <FontAwesomeIcon icon={faSortDown}/>}
                        </button>
                    </div>
                </div>
                {this.state.showItems ? 
                    <div className='m-0 p-0 my-1' style={{overflow: 'hidden'}}>
                        <hr/>
                        <br/>
                        {this.setItems()}
                    </div>
                : null} 
                <br/>
                <hr/>
            </div>
        )
    }
}





class AdminOrdersViewClass extends React.Component{
    constructor(props){
        super(props);
        this.searchParameterList=['owner_name', 'phone_number', 'pickup_area', 'pickup_location']
        this.state={
            ordersList: [],
            searchWord: '',
            searchParameter: 0,
            filter: false,
            dispatchedFilter: false,
            showParameterOptions: false
        }
    }


    getOrdersList = () => {
        let selectedOrders = this.state.filter ? 
                                (this.state.dispatchedFilter ? this.state.ordersList.filter(order => order.dispatched) : this.state.ordersList.filter(order => !order.dispatched))
                            : this.state.ordersList

        if(this.state.searchWord.length > 0){
            if(this.state.searchParameter === 0){
                selectedOrders = selectedOrders.filter(order => order.owner_name.toLowerCase().includes(this.state.searchWord))
            }
            else if(this.state.searchParameter === 1){
                selectedOrders = selectedOrders.filter(order => order.phone_number.includes(this.state.searchWord))
            }
            else if(this.state.searchParameter === 2){
                selectedOrders = selectedOrders.filter(order => order.pickup_area.toLowerCase().includes(this.state.searchWord))
            }
            else if(this.state.searchParameter === 3){
                selectedOrders = selectedOrders.filter(order => order.pickup_location.toLowerCase().includes(this.state.searchWord))
            }
        }

        return selectedOrders.map((order, index) => <LayOrders key={index} order={order}/>)
    }

    updateSearchWord = event => {
        this.setState({
            searchWord: event.target.value.toLowerCase()
        })
    }

    toggleFilter = () => {
        this.setState({
            filter: !this.state.filter
        })
    }

    toggleDispatchedFilter = () => {
        this.setState({
            dispatchedFilter: !this.state.dispatchedFilter
        })
    }

    getSearchParameters = () => {
        let params = this.searchParameterList.map(param => 
            <button className="area_button px-4" onClick={() => {this.setState({searchParameter: this.searchParameterList.indexOf(param), showParameterOptions: false})}}>set_param({param})</button>
        )

        return params
    }

    componentDidMount(){
        axios.get(settings.SERVER_SUPER + '/order/getOrders', {withCredentials: true, headers: {'access_token' : window.sessionStorage.access_token, 'username' : window.sessionStorage.username}})
            .then((res) => {
                this.setState({
                    ordersList: res.data
                })
            })
            .catch((err) => {
                if(err.response && err.response.status === 403){
                    window.location.replace('/admin')
                }
                else{
                    console.log(err)
                }
            })
    }

    render(){
        return(
            <div>
                <AdminNavBar/>
                <div className="row mx-2">
                    <div className='col-md-1 m-0 p-0'></div>
                    <div className='main_body col-12 col-md-10 m-0 p-0 my-5'>
                        <div className="d-flex">
                            <div className='justify-self-end ms-auto me-4'>
                                <button className="action_btn bn px-4" style={{backgroundColor: '#bbbbbb', width:'4em'}} onClick={this.toggleFilter}>
                                    {this.state.filter ? <FontAwesomeIcon icon={faCaretLeft}/> : <FontAwesomeIcon icon={faFilter}/>}
                                </button>
                            </div>
                            {this.state.filter ? 
                                <div>
                                    <button className="action_btn bn px-4" style={{backgroundColor: '#bbbbbb', width:'4em'}} onClick={this.toggleDispatchedFilter}>
                                        {this.state.dispatchedFilter ? '.get_pending( )' : '.get_dispatched( )'}
                                    </button>
                                </div>
                            : null }
                        </div>
                        <div className="fieldset d-flex flex-row align-items-center px-3" style={{borderColor: '#555555'}}>
                            <input className="auth_input" type="text" placeholder={`search (${this.searchParameterList[this.state.searchParameter]})`} onChange={(event) => this.updateSearchWord(event)}/>
                            <div className="justify-content-end ms-auto px-2" style={{fontSize: '1.2em', cursor:'pointer'}} onClick={() => this.setState({showParameterOptions: !this.state.showParameterOptions})}><FontAwesomeIcon icon={faSortDown}/></div>
                        </div>
                        <div style={{overflowY: 'hidden'}}>
                            {this.state.showParameterOptions ? 
                                <div className="areas_container m-0" style={{borderRadius: '10px', backgroundColor: '#dddddd', height: '6em', overflowX: 'hidden', overflowY: 'scroll'}}>
                                    {this.getSearchParameters()}
                                </div> 
                            : null}
                        </div>
                        <br/>
                        {this.getOrdersList()}
                    </div>
                    <div className='col-md-1 m-0 p-0'></div>
                </div>
            </div>
        )
    }
}



const AdminOrdersView = () => {
    const navigate = useNavigate()

    const location = useLocation()

    useEffect(() => {
        if(location.state && location.state.authed){
            axios.get(settings.SERVER_AUTH + '/authenticate_superuser', {withCredentials: true, headers: {'access_token' : window.sessionStorage.access_token, 'username' : window.sessionStorage.username}})
                .catch((err) => {
                    navigate('/admin', {replace: true})
                })
        }
        else{
            navigate('/admin')
        }
    },[location.state, navigate])

    return(
        <AdminOrdersViewClass/>
    )
}




export default AdminOrdersView
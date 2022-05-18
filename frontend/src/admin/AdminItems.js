import React, { useEffect } from "react";
import settings from '../Settings.json';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp, faTrashAlt, faCaretLeft, faFilter } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import MessageView, {ConfirmBox} from "../components/MessageView";
import { useLocation, useNavigate } from "react-router";
import AdminNavBar from "./AdminNavbar";
import MyToast from "../components/ToastMessages";




class LayItems extends React.Component{
    constructor(props){
        super(props);
        this.manipulatable = ['name', 'size', 'description', 'price', 'male', 'female', 'enabled', 'category']
        this.state={
            showDesc: false,
            showManip: false,
            maleManip: '',
            femaleManip: '',
            enabledManip: '',
            messageDialog: null,
            enabled: this.props.item.enabled
        }
    }

    toggleDesc = () => {
        this.setState({
            showDesc: !this.state.showDesc
        })
    }

    getFieldErrColor = (key) => {
        let colorValue = null
        const booleans = ['true', 'false', '']

        if(key === 'male'){
            if(!booleans.includes(this.state.maleManip)){
                colorValue = '#550000'
            }
        }
        else if(key === 'female'){
            if(!booleans.includes(this.state.femaleManip)){
                colorValue = '#550000'
            }
        }
        else if(key === 'enabled'){
            if(!booleans.includes(this.state.enabledManip)){
                colorValue = '#550000'
            }
        }

        return colorValue
    }

    updateValues = (key,event) => {
        if(key === 'male'){
            this.setState({
                maleManip: event.target.value
            })
        }
        else if(key === 'female'){
            this.setState({
                femaleManip: event.target.value
            })
        }
        else if(key === 'enabled'){
            this.setState({
                enabledManip: event.target.value
            })
        }
    }

    isSubmitable = () => {
        const booleans = ['true', 'false', '']
        if(!booleans.includes(this.state.maleManip) || !booleans.includes(this.state.femaleManip) || !booleans.includes(this.state.enabledManip)){
            return(false)
        }
        else{
            return(true)
        }
    }

    layRawData = (props) => {
        return(
            <div className="row m-0 p-0" key={props.key}>
                <div className="col-4 col-md-3" style={{color: '#440000', fontWeight: '650'}}>
                    {props.key}
                </div>
                <div className="col-8 col-md-9 ps-md-3 pe-1 d-flex pe-4">
                    <input id={props.key} className="auth_input" type={props.key === 'price' ? 'number' : 'text'} placeholder={props.value.toString()} disabled={false} onChange={(event) => this.updateValues(props.key, event)}/>
                    {['male', 'female', 'enabled'].includes(props.key) ? <div className="mt-2" style={{borderRadius: '100%', height: '.7em', width: '.7em', border: '2px solid #444444', backgroundColor: this.getFieldErrColor(props.key)}}></div> : null}
                </div>
            </div>
        )
    }

    processRawData = () => {
        const rawDataList = []
        for(let key in this.props.item){
            let data = {key: key, value: this.props.item[key]}
            if(this.manipulatable.includes(key.toString())){
                rawDataList.push(this.layRawData(data))
            }
        }

        return(
            <div className="m-0 p-0 drop_in_slow">
                {rawDataList}
            </div>
        )
    }


    getBoolean = (strValue) => {
        if(strValue === 'true'){
            return true
        }
        else if (strValue === 'false'){
            return false
        }
    }


    clearMessage = () => {
        this.setState({
            messageDialog: null
        })
    }
    clearAndReload = () => {//Wont reload anymore
        this.setState({
            messageDialog: null
        })
        
    }
    confirmBox = (message, next) => {
        this.setState({
            messageDialog: <ConfirmBox type={0} message={message} proceed={next} clearMessage={this.clearMessage}/>
        })
    }


    handleDelete = () => {
        axios.post(settings.SERVER_SUPER + '/shop/deleteItem', {_id: this.props.item._id}, {withCredentials: true, headers: {'access_token' : window.sessionStorage.access_token}})
            .then((results) => {
                this.setState({
                    messageDialog: null
                })
                MyToast.success({message: `${this.props.item.name} deleted`})
            })
            .catch((err) => {
                this.setState({
                    messageDialog: <MessageView type={1} message={err.response ? err.response.status + "!  " + err.response.data : "Network Error"} clearMessage={this.clearMessage}/>
                })
            })
    }


    handleUpdate = () => {
        const updates = {
            name : document.getElementById('name').value ? document.getElementById('name').value : null,
            size : document.getElementById('size').value ? document.getElementById('size').value : null,
            price : document.getElementById('price').value ? parseInt(document.getElementById('price').value) : null,
            description : document.getElementById('description').value ? document.getElementById('description').value : null,
            male : document.getElementById('male').value ? this.getBoolean(document.getElementById('male').value) : null,
            female : document.getElementById('female').value ? this.getBoolean(document.getElementById('female').value) : null,
            category : document.getElementById('category').value ? document.getElementById('category').value : null,
            enabled : document.getElementById('enabled').value ? this.getBoolean(document.getElementById('enabled').value) : null
        }


        for(let key in updates){
            if(updates[key] === null){
                delete updates[key]
            }
        }

        if(Object.keys(updates).length > 0){

            const data = {_id: this.props.item._id, update: updates}

            axios.post(settings.SERVER_SUPER +'/shop/updateItem', data, {withCredentials: true, headers: {'access_token' : window.sessionStorage.getItem('access_token'), 'username' : window.sessionStorage.getItem('username')}})
                .then((results) => {
                    this.setState({
                        messageDialog: null
                    })
                    MyToast.success({message: `${this.props.item.name} updated`})
                })
                .catch((err) => {
                    this.setState({
                        messageDialog: <MessageView type={1} message={err.response ? err.response.data : err.data} clearMessage={this.clearAndReload}/>
                    })
                })
        }
        else{
            this.setState({
                messageDialog: <MessageView type={0} message={`no change detected`} clearMessage={this.clearMessage}/>
            })
        }

        
    }


    toggleEnableItem = () => {
        const data = {
            _id : this.props.item._id,
            update : {enabled : this.state.enabled ? false : true}
        }

        axios.post(settings.SERVER_SUPER + '/shop/updateItem', data, {headers: {'access_token' : window.sessionStorage.access_token, 'username' : window.sessionStorage.username}})
            .then((results) => {
                MyToast.success({message: `${this.props.item.name} updated`, toastId: 'enbl'})
                this.setState({
                    enabled: data.update.enabled
                })
            })
            .catch((err) => {
                console.log(err)
                MyToast.error({message: 'an error occurred', toastId: 'enblerr'})
            })
    }

    render(){
        return(
            <div>
                {this.state.messageDialog}
                <div className="row m-0 p-0 my-2 py-2">
                    <div className="col-4 col-md-2 p-0 m-0 px-md-3 px-1">
                        <div className="item_image_cont">
                            <img className="item_image image-fluid" src={settings.SERVER_STATIC + this.props.item.image1} alt="item"/>
                        </div>
                    </div>
                    <div className="col-6 col-md-8 p-0 m-0 ps-1 px-md-4 d-flex flex-column justify-content-center">
                        <div className="d-flex flex-column">
                            <div style={{textAlign:'left', letterSpacing:'2px', color: '#565656', fontWeight: 'bold', fontSize: '.9em'}}>{this.props.item.name.toUpperCase()}</div>
                            <div style={{textAlign:'left', letterSpacing:'.1em', color: '#002277', fontWeight: 'bold', fontSize: '.9em'}}>{this.state.enabled ? 'enabled' : <span style={{color: '#770000'}}>disabled</span>}</div>
                            <div style={{textAlign:'left', color: '#444444', fontSize: '.8em'}}>ksh {this.props.item.price}</div>
                            <div style={{textAlign:'left', color: '#444444', fontSize: '.8em'}}>size {this.props.item.size}</div>
                            <div style={{textAlign:'left', color: '#002277', fontWeight: 'bold', fontSize: '.9em'}}>{this.props.item.male ? 'M' : null} - {this.props.item.female ? 'F' : null}</div>
                            <div className="text-center d-none d-md-block" style={{width : '100%', position : 'relative'}}>
                                {!this.state.showDesc ? <button className="toggle_desc" onClick={this.toggleDesc}>description <FontAwesomeIcon icon={faSortDown}/></button> : null}
                                {this.state.showDesc ? <div className="desc_cont mb-2 px-2">
                                    <div className="desc_lbl" onClick={this.toggleDesc}>description <FontAwesomeIcon icon={faSortUp}/></div>
                                    {this.props.item.description}
                                </div> : null}
                            </div>
                        </div>
                    </div>
                    <div className="col-2 p-0 m-0 d-flex flex-column justify-content-center align-items-center">
                        <button className="action_btn bn mt-2" style={{backgroundColor: '#eeeeee', color: '#252525'}} onClick={() =>  {this.toggleEnableItem()} }>
                            {this.state.enabled ? 'disable' : 'enable'}
                        </button>
                        <button className="action_btn bn mt-2" style={{backgroundColor: '#bbbbbb', color: 'black'}} onClick={() => this.confirmBox(`proceed to DELETE ${this.props.item.name}?`, this.handleDelete)}>
                            <FontAwesomeIcon icon={faTrashAlt}/>
                        </button>
                        <button className="action_btn bn mt-2" style={{backgroundColor: '#bbbbbb', color: 'black'}} onClick={() => this.setState({showManip: !this.state.showManip})}>
                            {this.state.showManip ? <FontAwesomeIcon icon={faSortUp}/> : <FontAwesomeIcon icon={faSortDown}/>}
                        </button>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-start d-md-none">
                    <div className="text-center" style={{width : '100%', position : 'relative'}}>
                        {!this.state.showDesc ? <button className="toggle_desc" onClick={this.toggleDesc}>description <FontAwesomeIcon icon={faSortDown}/></button> : null}
                        {this.state.showDesc ? <div className="desc_cont mb-2 px-2">
                            <div className="desc_lbl" onClick={this.toggleDesc}>description <FontAwesomeIcon icon={faSortUp}/></div>
                            {this.props.item.description}
                        </div> : null}
                    </div>
                </div>
                {this.state.showManip ?
                    <div className='m-0 p-0 py-2' style={{backgroundColor: '#ffffff', overflow: 'hidden'}}>
                        {this.processRawData()}

                        {this.isSubmitable() ?
                        <div className="d-flex justify-content-center">
                            <button className="navbutton mt-2" style={{color: '#454545', fontSize: '1.2em'}} onClick={() => this.confirmBox(`Proceed to update ${this.props.item.name}?`, this.handleUpdate)}>
                                <FontAwesomeIcon icon={faEdit}/>
                            </button>
                        </div>
                        : null}
                    </div>
                : null}
                <hr/>
            </div>
        )
    }
}




class AdminItemsViewClass extends React.Component{
    constructor(props){
        super(props);
        this.searchParameterList=['name', 'price(more than)', 'price(less than)']
        this.state={
            itemList: [],
            searchWord: '',
            searchParameter: 0,
            filter: false,
            maleFilter: false,
            femaleFilter: false,
            enabledFilter: false,
            disabledFilter: false,
            showParameterOptions: false
        }
    }


    itemList = () => {
        const getSelectedItems = () => {
            let selectedItems = this.state.itemList;
            if(this.state.filter){
                if(this.state.maleFilter){
                    selectedItems = selectedItems.filter(item => item.male)
                }
                if(this.state.femaleFilter){
                    selectedItems = selectedItems.filter(item => item.female)
                }
                if(this.state.enabledFilter){
                    selectedItems = selectedItems.filter(item => item.enabled)
                }
                if(this.state.disabledFilter){
                    selectedItems = selectedItems.filter(item => !item.enabled)
                }
            }

            return selectedItems
        }

        let selectedItems = getSelectedItems()

        if(this.state.searchWord.length > 0){
            if(this.state.searchParameter === 0){
                selectedItems = selectedItems.filter(item => item.name.toLowerCase().includes(this.state.searchWord))
            }
            else if(this.state.searchParameter === 1){
                selectedItems = selectedItems.filter(item => item.price >= parseInt(this.state.searchWord))
            }
            else if(this.state.searchParameter === 2){
                selectedItems = selectedItems.filter(item => item.price <= parseInt(this.state.searchWord))
            }
        }

        return selectedItems.map((item, index) => <LayItems key={index} item={item}/>)
    }

    getNumber = () => {
        const num = this.itemList().length

        return num
    }

    updateSearchWord = event => {
        this.setState({
            searchWord: event.target.value.toLowerCase()
        })
    }
    updateSearchNum = event => {
        this.setState({
            searchWord: event.target.value
        })
    }

    toggleFilter = () => {
        this.setState({
            filter: !this.state.filter
        })
    }

    toggleMaleFilter = () => {
        this.setState({
            maleFilter: !this.state.maleFilter,
            femaleFilter: false
        })
    }
    toggleFemaleFilter = () => {
        this.setState({
            femaleFilter: !this.state.femaleFilter,
            maleFilter: false
        })
    }
    
    toggleEnabledFilter = () => {
        this.setState({
            enabledFilter: !this.state.enabledFilter,
            disabledFilter: false
        })
    }
    toggleDisabledFilter = () => {
        this.setState({
            disabledFilter: !this.state.disabledFilter,
            enabledFilter: false
        })
    }

    getSearchParameters = () => {
        let params = this.searchParameterList.map((param, index) => 
            <button key={index} className="area_button px-4" onClick={() => {this.setState({searchParameter: this.searchParameterList.indexOf(param), showParameterOptions: false})}}>set_param({param})</button>
        )

        return params
    }

    componentDidMount(){
        axios.get(settings.SERVER_SUPER + '/shop/items', {withCredentials: true, headers: {'access_token': window.sessionStorage.access_token, 'username' : window.sessionStorage.username}})
            .then((res) => {
                this.setState({
                    itemList: res.data
                })
            })
            .catch((err) => {
                if(err.response && err.response.status === 403){window.location.href = '/admin'}
                console.log(err)
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
                            <span style={{color: "#454545"}}>{this.getNumber()} item(s)</span>
                            <div className='justify-self-end ms-auto me-4'>
                                <button className="action_btn bn px-4" style={{backgroundColor: '#aaaaaa', width:'4em'}} onClick={this.toggleFilter}>
                                    {this.state.filter ? <FontAwesomeIcon icon={faCaretLeft}/> : <FontAwesomeIcon icon={faFilter}/>}
                                </button>
                            </div>
                            {this.state.filter ? 
                                <div className="d-flex flex-column">
                                    <div className="d-flex flex-row mb-1">
                                        <button className="action_btn bn px-4" style={{backgroundColor: this.state.maleFilter ? '#0055dd' : '#aaaaaa', width:'4em', borderTopRightRadius: '0', borderBottomRightRadius: '0'}} onClick={this.toggleMaleFilter}>
                                            M
                                        </button>
                                        <button className="action_btn bn px-4" style={{backgroundColor: this.state.femaleFilter ? '#0055dd' : '#aaaaaa', width:'4em', borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}} onClick={this.toggleFemaleFilter}>
                                            F
                                        </button>
                                    </div>
                                    <div className="d-flex flex-row mb-1">
                                        <button className="action_btn bn px-4" style={{backgroundColor: this.state.enabledFilter ? '#0055dd' : '#aaaaaa', width:'4em',  borderTopRightRadius: '0', borderBottomRightRadius: '0'}} onClick={this.toggleEnabledFilter}>
                                            E
                                        </button>
                                        <button className="action_btn bn px-4" style={{backgroundColor: this.state.disabledFilter ? '#0055dd' : '#aaaaaa', width:'4em',  borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}} onClick={this.toggleDisabledFilter}>
                                            D
                                        </button>
                                    </div>
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
                        {this.itemList()}
                    </div>
                    <div className='col-md-1 m-0 p-0'></div>
                </div>
            </div>
        )
    }
}



const AdminItemsView = () => {
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
        <AdminItemsViewClass navigate={navigate}/>
    )
}



export default AdminItemsView
import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import settings from '../Settings.json'
import MessageView, { ConfirmBox } from "../components/MessageView";
import { useNavigate, useLocation } from "react-router";
import AdminNavBar from "./AdminNavbar";





class LayUsers extends React.Component{
    constructor(props){
        super(props);
        this.state={
            dialogBox: null
        }
    }

    clearMessage = () => {
        this.setState({
            action: null,
            dialogBox: null
        })
    }

    clearAndReload = () => {
        this.setState({
            action: null,
            dialogBox: null
        })
        window.location.reload()
    }


    takeAction = () => {
        this.setState({
            dialogBox: <MessageView type={0} message={'taking action...'} clearMessage={this.clearMessage}/>
        })

        
        const data = {_id: this.props.user._id}
        axios.post(settings.SERVER_SUPER + '/user/deleteUser', data, {withCredentials: true, headers: {'access_token' : window.sessionStorage.access_token, 'username' : window.sessionStorage.username}})
            .then((res) => {
                this.setState({
                    dialogBox: <MessageView type={0} message={`${this.props.user.first_name} ${this.props.user.last_name} terminated`} clearMessage={this.clearAndReload}/>
                })
            })
            .catch((err) => {
                console.log(err)
            })
        
    }

    deleteUser = () => {
        this.setState({
            action: 'delete',
            dialogBox: <ConfirmBox type={1} 
                            message={`Caution! You are about to delete ${this.props.user.first_name} ${this.props.user.last_name} from the database`}
                            clearMessage={this.clearMessage}
                            proceed={this.takeAction}
                        />
        })
    }



    render(){
        return(
            <div style={{ borderBottom: '1px solid #dddddd' }}>
                {this.state.dialogBox}
                <div className="row m-0 p-0 my-2 py-2">
                    <div className="col-3 p-0 m-0 px-md-3 px-1 d-flex flex-column">
                        <div style={{textAlign:'left', fontSize:'.9em', fontWeight: '650', color:'#656565', letterSpacing: '.1em'}}>{this.props.user.firstname.toUpperCase()}</div>
                        <div style={{textAlign:'left', fontSize:'.9em', fontWeight: '650', color:'#656565', letterSpacing: '.1em'}}>{this.props.user.lastname.toUpperCase()}</div>
                    </div>
                    <div className="col-7 p-0 m-0 ps-1 px-md-4 d-flex flex-column justify-content-center">
                        <div className="d-flex flex-column" style={{overflowX: 'hidden'}}>
                            <div style={{textAlign:'left', fontSize:'.9em', fontWeight: '650'}}>{this.props.user.email}</div>
                            <div style={{textAlign:'left', letterSpacing:'2px', color: '#565656', fontWeight: 'bold', fontSize: '.9em'}}>{this.props.user.phonenumber}</div>
                            <div style={{textAlign:'left', color: '#444444', fontSize: '.8em'}}>spent ksh {this.props.user.spent}</div>
                            <div style={{textAlign:'left', color: '#444444', fontSize: '.8em'}}>purchased {this.props.user.purchases} items</div>
                        </div>
                    </div>
                    <div className="col-2 p-0 m-0 d-flex flex-column justify-content-center align-items-center">
                        <button className="action_btn bn mt-2" style={{backgroundColor: '#bbbbbb', color: 'black'}} onClick={this.deleteUser}>
                            <FontAwesomeIcon icon={faTrashAlt}/>
                        </button>
                    </div>
                </div>
            </div>
        ) 
    }
}








class AdminUsersViewClass extends React.Component{
    constructor(props){
        super(props);
        this.searchParameterList=['email', 'name', 'firstname', 'lastname', 'phonenumber']
        this.state={
            usersList: [],
            searchWord: '',
            searchParameter: 0,
            showParameterOptions: false
        }
    }


    usersList = () => {
        let selectedUsers = this.state.usersList

        if(this.state.searchWord.length > 0){
            if(this.state.searchParameter === 0){
                selectedUsers = selectedUsers.filter(user => user.email.toLowerCase().includes(this.state.searchWord))
            }
            else if(this.state.searchParameter === 1){
                selectedUsers = selectedUsers.filter(user => user.firstname.toLowerCase().includes(this.state.searchWord)||user.lastname.toLowerCase().includes(this.state.searchWord))
            }
            else if(this.state.searchParameter === 2){
                selectedUsers = selectedUsers.filter(user => user.firstname.toLowerCase().includes(this.state.searchWord))
            }
            else if(this.state.searchParameter === 3){
                selectedUsers = selectedUsers.filter(user => user.lastname.toLowerCase().includes(this.state.searchWord))
            }
            else if(this.state.searchParameter === 4){
                selectedUsers = selectedUsers.filter(user => user.phonenumber.includes(this.state.searchWord))
            }
        }

        return selectedUsers.map((user, index) => <LayUsers key={index} user={user}/>)
    }

    updateSearchWord = event => {
        this.setState({
            searchWord: event.target.value.toLowerCase()
        })
    }

    

    getSearchParameters = () => {
        let params = this.searchParameterList.map((param, index) => 
            <button key={index} className="area_button px-4" onClick={() => {this.setState({searchParameter: this.searchParameterList.indexOf(param), showParameterOptions: false})}}>set_param({param})</button>
        )

        return params
    }

    componentDidMount(){
        axios.get(settings.SERVER_SUPER + '/user/getUsers', {withCredentials: true, headers: {'access_token' : window.sessionStorage.access_token, 'username' : window.sessionStorage.username}})
            .then((res) => {
                this.setState({
                    usersList: res.data
                })
            })
            .catch((err) => {
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
                            <div className="text-center text-muted p-0 m-0 ">USERS</div>
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
                        {this.usersList()}
                    </div>
                    <div className='col-md-1 m-0 p-0'></div>
                </div>
            </div>
        )
    }
}



const AdminUsersView = () => {
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
        <AdminUsersViewClass/>
    )
}


export default AdminUsersView
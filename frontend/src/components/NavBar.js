import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faShoppingCart, faSearch } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { setMale, setFemale, setBoth, toggleSearch } from '../redux/controls/actions';
import { useNavigate } from "react-router";
import '@fontsource/wallpoet';
import MyToast from "./ToastMessages";


const mapStateToProps = state => ({
    filter : state.control.filter
})

const mapDispatchToProps = dispatch => ({
    SET_MALE : () => dispatch(setMale()),
    SET_FEMALE : () => dispatch(setFemale()),
    SET_BOTH : () => dispatch(setBoth()),
    TOGGLE_SEARCH : () => dispatch(toggleSearch())
})

const SidePanel = connect(mapStateToProps, mapDispatchToProps)(class SidePanel extends React.Component{
    constructor(props){
        super(props);
        this.wrapperRef = React.createRef();
    }

    handleClickOutside = (event) => {
        if(this.wrapperRef && !this.wrapperRef.current.contains(event.target)){
            this.props.togglePanel()
        }
    }

    componentDidMount(){
        window.addEventListener('mousedown', this.handleClickOutside)
    }
    componentWillUnmount(){
        window.removeEventListener('mousedown', this.handleClickOutside)
    }

    setMale = () => {
        this.props.SET_MALE()
        this.props.navigateTo('/shop')
        this.props.togglePanel()
    }
    setFemale = () => {
        this.props.SET_FEMALE()
        this.props.navigateTo('/shop')
        this.props.togglePanel()
    }
    setBoth = () => {
        this.props.SET_BOTH()
        this.props.navigateTo('/shop')
        this.props.togglePanel()
    }

    goToProfile = () => {
        if(!(window.localStorage.access_token && window.localStorage.user)){
            this.props.navigateTo('/login', {replace: true})
        }
        else{
            this.props.navigateTo('/profile')
        }
    }

    logout = () => {
        window.localStorage.removeItem('access_token')
        window.localStorage.removeItem('user')

        MyToast.success({message: 'Logged out', toastId: 'logout'})
        this.props.togglePanel()
        this.props.navigateTo('/login')
    }

    toggleSearch = () => {
        this.props.TOGGLE_SEARCH()
        this.props.togglePanel()
        this.props.navigateTo('/shop')
    }


    render(){
        return(
            <div>
                <div className="tint"></div>
                <div id="side_panel" ref={this.wrapperRef} className="side_panel">
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={this.setBoth}>
                            SHOP
                        </button>
                    </div>
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={this.setMale}>
                            MALE
                        </button>
                    </div>
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={this.setFemale}>
                            FEMALE
                        </button>
                    </div>
                    {['/profile', '/login','/signup'].includes(window.location.pathname) ? null :
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={this.goToProfile}>
                            PROFILE
                            <span className="right side_btn_icon"><FontAwesomeIcon icon={faUser}/></span>
                        </button>
                    </div>
                    }
                    {window.localStorage.access_token && window.localStorage.user ? 

                        <button className="side_panel_button d-flex pt-2" onClick={this.logout}>
                            LOGOUT
                        </button> 

                    : null}
                    <div>
                        <button className="side_panel_button d-flex pt-2" onClick={this.toggleSearch}>
                            SEARCH
                            <span className="right side_btn_icon"><FontAwesomeIcon icon={faSearch}/></span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
})

const mapNavStateToProps = state => ({
    cart : state.cart.cart
})

const NavBar = (props) => {

    const navigate = useNavigate()
    
    const [showPanel, setShowPanel] = useState(false)

    const togglePanel = () =>{
        
        setShowPanel(!showPanel)
        
    }

    const navigateTo = (link, state=null) => {
        if(state===null){
            navigate(link)
        }
        else{
            navigate(link, state)
        }
    }

    const goToProfile = () => {
        if(!(window.localStorage.access_token && window.localStorage.user)){
            navigateTo('/login', {replace: true})
        }
        else{
            navigateTo('/profile')
        }
    }


    
    return (
        <nav className="unselectable">
            {showPanel ? <SidePanel togglePanel={togglePanel} navigateTo={navigateTo}/> : null}
            <div className="m-0 p-0 px-2 px-md-3 d-flex">
                {['/login','/signup'].includes(window.location.pathname) ? null : 
                    <div>
                        {showPanel ? 
                        <button className="navbutton panel_closer" style={{zIndex:101, color:'white', width: 'fit-content', position: 'absolute'}}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </button>
                        :
                        <button className="navbutton panel_opener" style={{color:'#373737', width: 'fit-content'}} onClick={togglePanel}>
                            <FontAwesomeIcon icon={faBars}/>
                        </button>}
                    </div>
                }


                <div className="text-center justify-self-center ms-auto py-0 my-auto" style={{fontFamily: 'Wallpoet', fontSize: '1.5em', cursor: 'pointer'}} onClick={() => {if(window.localStorage.user){navigateTo('/shop')}}}>MITRENDI</div>
                
                <div className="d-flex flex-row" style={{justifySelf : 'end', marginLeft : 'auto'}}>
                    {['/profile', '/login','/signup'].includes(window.location.pathname) ? null :
                    <button className="navbutton d-none d-md-block" style={{justifySelf : 'end', marginLeft : 'auto'}} onClick={goToProfile}>
                        <FontAwesomeIcon icon={faUser}/>
                    </button>
                    }
                    {['/cart', '/login','/signup'].includes(window.location.pathname) ? null : 
                        <button className="navbutton mx-2" style={{justifySelf : 'end', marginLeft : 'auto', position: 'relative'}} onClick={() => {navigate('/cart')}}>
                        <div className="text-centre p-0 m-0" style={{minWidth: '.6em', minHeight: '.6em', maxWidth: '.6em', maxHeight: '.6em', backgroundColor: '#555555', position: 'absolute', borderRadius: '50%', border: '2px solid #991212', color: 'white'}}>
                            <div className="p-0 m-0" style={{fontSize: '.35em'}}>{props.cart.length}</div>
                        </div>
                        <FontAwesomeIcon icon={faShoppingCart}/>
                    </button>
                    }
                </div>
            </div>
        </nav>
    )
    
}

export default connect(mapNavStateToProps)(NavBar)
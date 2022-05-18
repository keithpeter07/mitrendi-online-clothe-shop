import React from "react";
import { faShoppingBasket, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import settings from '../Settings.json';
import { connect } from "react-redux";
import { addItemToCart } from "../redux/cart/actions";
import MyToast from "../components/ToastMessages";

const mapDispatchToProps = dispatch => ({
    ADD_TO_CART : (item) => dispatch(addItemToCart(item))
})

export const SingleCard = connect(null, mapDispatchToProps) (class SingleCard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            showDesc : false,
            firstImage : true
        }
    }

    toggleDesc = () => {
        this.setState({
            showDesc : !this.state.showDesc
        })
    }

    toggleImage = () => {
        this.setState({
            firstImage : !this.state.firstImage
        })
    }

    addToCart = () => {
        this.props.ADD_TO_CART(this.props.item)
        MyToast.success({message: 'Item added to cart', toastId: 'addToCart'})
    }


    checkout = () => {
        if(!(window.localStorage.access_token && window.localStorage.user)){
            this.props.navigate('/login', {state: {next_location : '/checkout', item: {_id: this.props.item._id, name: this.props.item.name, price: this.props.item.price, image1: this.props.item.image1}}})
        }
        else{
            this.props.navigate('/checkout', {state: {item: {_id: this.props.item._id, name: this.props.item.name, price: this.props.item.price, image1: this.props.item.image1}}})
        }
    }

    render(){
        return(
            <div className="row">
                <div className="col-md-5 col-12">
                    <div className="card m-0 p-0">
                        <div className="card-body m-0 p-0">
                            <div className="item_image_cont" onClick={this.toggleImage} onMouseEnter={this.toggleImage} onMouseLeave={this.toggleImage}>
                                <img className="item_image image-fluid" src={this.state.firstImage ? settings.SERVER_STATIC + this.props.item.image1 : settings.SERVER_STATIC + this.props.item.image2} alt={this.props.item.name}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-7 col-12 mt-4 mt-md-2 px-md-5">
                    <div className="card m-0 p-0">
                        <div className="card-body m-0 p-0">
                            <div className="m-0 p-0">
                                <div className="name_box px-2 px-md-0 mb-3">{this.props.item.name.toUpperCase()}</div>
                                <div className="pns" style={{color: '#128812'}}>ksh {this.props.item.price}</div>
                                
                                <div className="pns" style={{fontSize:'.8em', letterSpacing: '2px', fontWeight: 'bold'}}>size {this.props.item.size}</div>
                                <br/>
                            </div>
                            <div className="text-center my-2"  style={{width : '100%'}}>
                                <button className="action_btn atc" onClick={this.addToCart}>
                                    ADD TO CART <FontAwesomeIcon icon={faShoppingBasket}/>
                                </button>
                            </div>
                            <div className="text-center my-2 mt-3">
                                <button className="action_btn bn" onClick={this.checkout}>
                                    BUY NOW 
                                </button>
                            </div>
                            <br/>
                            <div className="text-center" style={{width : '100%', position : 'relative'}}>
                                {!this.state.showDesc ? <button className="toggle_desc" onClick={this.toggleDesc}>description <FontAwesomeIcon icon={faSortDown}/></button> : null}
                                {this.state.showDesc ? <div className="desc_cont mb-2 px-2">
                                    <div className="desc_lbl" onClick={this.toggleDesc}>description <FontAwesomeIcon icon={faSortUp}/></div>
                                    <span className="desc_text">{this.props.item.description}</span>
                                </div> : null}
                            </div>
                        </div>
                    </div>
                    <br/>
                </div>
            </div>
        )
    }
})
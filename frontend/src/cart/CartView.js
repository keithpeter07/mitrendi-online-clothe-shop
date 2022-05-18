import { useState, useEffect } from "react";
import { connect } from "react-redux";
import NavBar from "../components/NavBar";
import { clearCart, removeItemFromCart } from "../redux/cart/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import settings from '../Settings.json'
import { useNavigate } from "react-router";
import MyToast from "../components/ToastMessages";


const LayCartItem = (props) => {
    const [firstImage, setFirstImage] = useState(true)

    const toggleImage = () => {
        setFirstImage(!firstImage)
    }

    

    return(
        <div className="row m-0 p-0 my-2 py-2" style={{borderBottom: props.available ? '1px solid #dddddd' : '1px solid #ff5555'}}>
            <div className="col-5 col-md-2 p-0 m-0 px-md-3 px-1">
                <div className="item_image_cont" onClick={toggleImage}>
                    <img className="item_image image-fluid" src={firstImage ? settings.SERVER_STATIC + props.item.image1 : settings.SERVER_STATIC + props.item.image2} alt="item"/>
                </div>
            </div>
            <div className="col-5 col-md-5 p-0 m-0 ps-1 px-md-4 d-flex flex-column justify-content-center">
                <div className="d-flex flex-column">
                    {!props.available ? <div style={{textAlign:'left', fontSize:'.9em', fontWeight: '650', color:'#aa0000'}}>SOLD OUT</div> : null}
                    <div style={{textAlign:'left', letterSpacing:'2px', color: '#565656', fontWeight: 'bold', fontSize: '.9em'}}>{props.item.name.toUpperCase()}</div>
                    <div style={{textAlign:'left', color: '#444444', fontSize: '.8em'}}>ksh {props.item.price.toLocaleString()}</div>
                    <div style={{textAlign:'left', color: '#444444', fontSize: '.8em'}}>size {props.item.size}</div>
                </div>
            </div>
            <div className="col-2 col-md-5 p-0 m-0 pe-4 d-flex flex-row justify-content-end align-items-center">
                <button className="navbutton" style={{fontSize: '1.4em'}} onClick={() => props.remove(props.item._id)}>
                    <FontAwesomeIcon icon={faTrashAlt}/>
                </button>
            </div>
        </div>
    )
}











const mapStateToProps = state => ({
    cart : state.cart.cart
})
const mapDispatchToProps = dispatch => ({
    REMOVE_ITEM : (itemID) => dispatch(removeItemFromCart(itemID)),
    CLEAR_CART : () => dispatch(clearCart())
})








const CartLayout = connect(mapStateToProps, mapDispatchToProps)(

    (props) => {
        const [cartItems, setCartItems] = useState([])
        const [availableItems, setAvailableItems] = useState([])
        const [soldOutItems, setSoldOutItems] = useState(false)

        const navigate = useNavigate()


        const getTotal = () => { //gets the total price of all items in the cart
            let totalPrice = 0
            for(let cartItem of props.cart){
                totalPrice += cartItem.price
            }
            return totalPrice
        }

        const removeItem = (id) => { //Removes items in the cart
            props.REMOVE_ITEM(id)

            if(props.cart.every(elem => availableItems.includes(elem._id))){ //After removing an item, it checks whether all left items are available and refreshes
                setSoldOutItems(false)
            }
        }

        const checkout = () => {
            if(soldOutItems){
                document.getElementById('soldOutWarning').scrollIntoView()
                MyToast.error({message: 'Some items in your cart have been sold out!', toastId: 'soldOut'})
            }
            else{
                if(!(window.localStorage.access_token) || !(window.localStorage.user)){
                    navigate('/login', {replace: true, state: {next_location : '/checkout'}})
                }
                else{
                    navigate('/checkout')
                }
            }
        }

        useEffect(() => { //Calls right after the component is rendered and everytime props change
            const data = {itemIDs : props.cart.map(cartItem => cartItem._id)}

            axios.post(settings.SERVER_ORDER + '/isAvailable', data) //Checks with the server, the available items in the cart
                .then((results) => {//Changes the cartItems state to contain the cart items
                    setAvailableItems(results.data)
                    setCartItems(props.cart.map((cartItem, index) => <LayCartItem key={index} item={cartItem} remove={removeItem} available={results.data.includes(cartItem._id)}/>))

                    setSoldOutItems(!props.cart.every(elem => results.data.includes(elem._id)))
                    
                    //console.log(props.cart.length)
                    if(props.cart.length === 0){ //Checks if cart is empty
                        setCartItems([<div className="text-center text-muted">Your cart is empty...</div>]) //Works with lists, therefore takes in the element in a list
                    }
                })

                .catch((err) => {
                    console.log(err)
                })

        }, [props])


        return(
            <div>
                <NavBar/>
                <div className="row mx-2">
                    <div className='col-md-1 m-0 p-0'></div>
                    <div className='main_body col-12 col-md-10 m-0 p-0 my-5'>
                        <div className="text-start text-muted p-0 m-0 ps-4" style={{}}>Your cart</div>
                        <br/>
                        <div className="row p-0 m-0 py-2" style={{borderBottom: '1px solid #cccccc', borderTop: '1px solid #cccccc'}}>
                            <div className="col-6 ps-4 text-muted">ITEM</div>
                            <div className="col-6 pe-4 text-end">
                                <button className="navbutton" style={{color: '#444444', cursor: 'pointer', fontSize: '1em'}} onClick={props.CLEAR_CART}>CLEAR CART <FontAwesomeIcon icon={faTrashAlt}/></button>
                            </div>
                        </div>
                        {soldOutItems ? <div id='soldOutWarning' className="text-start p-0 m-0 ps-4" style={{color: '#880000', fontSize: '.9em'}}>Some Items in your cart have been sold out!</div> : null}
                        <br/>
                        {cartItems.length > 0 ? cartItems : <div className="text-center">getting items...</div>}
                        <br/>
                        {props.cart.length > 0 ? 
                        <div>
                        <div className="text-end pe-3" style={{textAlign:'left', color: '#444444', fontSize: '1em'}}><span style={{fontSize: '1.2em', marginRight: '.7em'}}>SUB TOTAL:</span>  ksh <span style={{color: 'black'}}>{getTotal().toLocaleString()}</span></div>
                        <div className="mt-5 text-end pe-3"><button className="chkout_btn bn px-5" style={{width: 'fit-content'}} onClick={checkout}>CHECKOUT</button></div>
                        </div>
                        : null}
                        <br/>
                        <div className="m-0 p-0 d-flex flex-column flex-md-row" style={{width: '100%'}}>
                            <div className="px-2 navbutton" style={{color: '#ff8c00', borderBottom: '1px solid #ff8c00', width: 'fit-content', fontSize: '1.3em', cursor: 'pointer'}} onClick={() => navigate('/shop')}>
                                <FontAwesomeIcon icon={faArrowLeft}/> back to shop?
                            </div>
                        </div>
                    </div>
                    <div className='col-md-1 m-0 p-0'></div>
                </div>
            </div>
        )


    }
)



const CartView = () => {
    const navigate = useNavigate()

    const nav = (link, state=null) => {
        if(state===null){
            navigate(link)
        }
        else{
            navigate(link, state)
        }
    }

    return(
        <div>
            <CartLayout navigate={nav}/>
        </div>
    )
}

export default CartView
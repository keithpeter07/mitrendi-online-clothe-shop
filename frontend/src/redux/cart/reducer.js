import reduxSettings from '../reduxSettings.json'
import { addToCart,setCart, getCart, clearCart } from "../../cart/cartOperator";

const initialState = () => {
    
    let initialCart = getCart();
    if(initialCart === undefined){
        initialCart = []
    }

    return {cart : initialCart}
}

const cartReducer = (state=initialState(), action) => {
    let newCart

    switch(action.type){
        case reduxSettings.ADD_TO_CART:
            newCart = [...state.cart, action.payload]
            let updatedCart = addToCart(action.payload)
            return{
                ...state,
                cart : updatedCart
            }

        case reduxSettings.REMOVE_FROM_CART:
            newCart = [...(state.cart.filter(item => item._id !== action.payload))]
            setCart(newCart)
            return{
                ...state,
                cart : newCart
            }

        case reduxSettings.CLEAR_CART:
            clearCart()
            return{
                ...state,
                cart : []
            }

        default:
            return{
                ...state
            }
    }
}

export default cartReducer
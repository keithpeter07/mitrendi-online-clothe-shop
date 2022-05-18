import Cookies from "universal-cookie"

const cookie = new Cookies()

const getCart = () => { //Gets initial cart from cookies
    let cartList = cookie.get('cart')

    if(cartList === undefined){
        return []
    }
    else {
        return cartList.cart
    }
}

const addToCart = (itemToAdd) => {
    let initialCart = getCart() //initialises the cart from cookies
    

    let cartList

    let checkMatch = initialCart.filter(item => item._id === itemToAdd._id)//Checks if the item is already in the cart
    if(checkMatch.length !== 0){
        cartList = [...initialCart]
    }
    else{
        cartList = [...initialCart, itemToAdd] //Adds the item to the cart if it is not there
    }
    
    let cartObject = JSON.stringify({cart : cartList})

    cookie.set('cart', cartObject, {maxAge: 3600*24*183, path: '/'})

    return(cartList)
}

const setCart = (newCart) => {
    let cartObject = JSON.stringify({cart : newCart})

    cookie.set('cart', cartObject, {maxAge: 3600*24*183, path: '/'})
}

const clearCart = () => {
    cookie.remove('cart')
}

export {addToCart, getCart, setCart, clearCart}
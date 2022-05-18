import reduxSettings from '../reduxSettings.json'

export const addItemToCart = item => ({
    type : reduxSettings.ADD_TO_CART,
    payload : item
})

export const removeItemFromCart = itemID => ({
    type : reduxSettings.REMOVE_FROM_CART,
    payload : itemID
})

export const clearCart = () => ({
    type : reduxSettings.CLEAR_CART,
})
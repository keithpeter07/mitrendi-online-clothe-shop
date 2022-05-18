import reduxSettings from '../reduxSettings.json';


const initialState = {
    orders : []
}

const orderReducers = (state=initialState, action) => {
    switch(action.type){
        case reduxSettings.LOAD_ORDERS:
            return({
                ...state,
                orders: [...action.payload]
            })
        default:
            return({
                ...state
            })
    }
}

export default orderReducers
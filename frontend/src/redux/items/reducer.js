import reduxSettings from '../reduxSettings.json'

const initialState = {
    items : []
}

const itemReducer = (state=initialState, action) => {

    switch(action.type){
        
        case reduxSettings.FETCH_ITEMS_SUCCESS:
            return {
                ...state,
                items : [...action.payload]
            }
        default:
            return {
                ...state
            }
    }
}

export default itemReducer
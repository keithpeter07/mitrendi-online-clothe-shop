import reduxSettings from '../reduxSettings.json'

const initialState = () => ({
    filter : {male: null, female: null},
    error : null,
    viewdItem : null,
    search : false
})

const controlReducer = (state = initialState(), action) => {

    switch(action.type){
        case reduxSettings.SET_MALE:
            return{
                ...state,
                filter : {male : true, female : false}
            }
        case reduxSettings.SET_FEMALE:
            return{
                ...state,
                filter : {male : false, female : true}
            }
        case reduxSettings.SET_BOTH:
            return{
                ...state,
                filter : {male : null, female : null}
            }
        case reduxSettings.SET_VIEWD_ITEM:
            return{
                ...state,
                viewdItem : action.payload
            }
        case reduxSettings.TOGGLE_SEARCH:
            return{
                ...state,
                search : !state.search
            }
        default:
            return{
                ...state
            }
    }
}

export default controlReducer
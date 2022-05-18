import axios from 'axios'
import reduxSettings from '../reduxSettings.json'
import Settings from '../../Settings.json';

const fetchingItems = () => ({
    type : reduxSettings.FETCH_ITEMS
})

const fetchSuccess = items => ({
    type : reduxSettings.FETCH_ITEMS_SUCCESS,
    payload : items
})

const fetchError = () => ({
    type : reduxSettings.FETCH_ITEMS_ERROR
})
export const startFetch = () => {
    return dispatch => {
        console.log(0)
        dispatch(fetchingItems())
        axios.get(Settings.SERVER_NORM + '/items')
            .then(response => {
                //console.log(response.data)
                dispatch(fetchSuccess(response.data))
            })
            .catch(err => {
                dispatch(fetchError())
                console.log(err);
            })
    }
}

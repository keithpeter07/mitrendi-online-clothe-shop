import reduxSettings from '../reduxSettings.json'

export const setMale = () => ({
    type : reduxSettings.SET_MALE
})

export const setFemale = () => ({
    type : reduxSettings.SET_FEMALE
})

export const setBoth = () => ({
    type : reduxSettings.SET_BOTH
})

export const setViewd = (_id) => ({
    type : reduxSettings.SET_VIEWD_ITEM,
    payload : _id
})

export const toggleSearch = () => ({
    type : reduxSettings.TOGGLE_SEARCH
})
import { combineReducers } from "redux";
import itemReducer from "./items/reducer";
import controlReducer from "./controls/reducer";
import cartReducer from "./cart/reducer";
import orderReducers from "./orders/reducers";






const rootReducer = combineReducers(
    {item : itemReducer,
    control : controlReducer,
    cart : cartReducer,
    order: orderReducers}
)

export default rootReducer
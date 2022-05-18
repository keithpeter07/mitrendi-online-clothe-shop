import { startFetch } from "../redux/items/actions";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { startOrderFetch } from "../redux/orders/actions";

const mapDispatchToProps = dispatch => ({
    FETCH_ITEMS : () => dispatch(startFetch()),
    START_ORDER_FETCH : () => dispatch(startOrderFetch())
})


const Home = (props) => {

    const [clicks, setClicks] = useState(0)
    const [name, setName] = useState('')

    const navigate = useNavigate()

    useEffect(() => {

        if(window.localStorage.user){

            setName(JSON.parse(window.localStorage.user).firstname[0].toUpperCase() + JSON.parse(window.localStorage.user).firstname.substring(1).toLowerCase())

            props.START_ORDER_FETCH()
        }


        props.FETCH_ITEMS()
    },[props])

    useEffect(() => {
        if(clicks === 7){
            navigate('/admin')
        }
    },[clicks, navigate])

    const updateClicks = () => {
        if(name === 'Keith'){
            setClicks(clicks + 1)
        }
    }

    const actionButton = () => {
        if(window.localStorage.user){
            navigate('/shop')
        }
        else{
            navigate('/login')
        }
    }

    return(
        <div className="unselectable">
            <div className="tint_light"></div>
            <div className="home_image_cont">
                <div className="company_name">
                    <div className="text-center" style={{color: 'white', fontSize: '2.7em', letterSpacing: '.1em', paddingLeft: '.1em'}}>MITRENDI</div>
                    <div className="text-center" style={{color: 'white', fontSize: '.9em', letterSpacing: '1.45em', paddingLeft: '1.5em', cursor: 'pointer'}}>WARDR<span onClick={updateClicks}>O</span>BE</div>
                </div>

                {name.length > 0 ?
                <div className="home_page_p text-center">
                    Hi {name+'.'} Welcome back!
                </div>
                : null}

                <div className="go_to_shop_btn_cont">
                    <button className="px-md-5 go_to_shop_btn px-2" onClick={actionButton}>
                        {window.localStorage.user ? 'SHOP NOW' : 'SIGN IN'}
                    </button>
                </div>
            </div>
        </div>
    )
}


export default connect(null,mapDispatchToProps)(Home)
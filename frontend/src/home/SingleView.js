import React from "react";
import { SingleCard } from "./SingleCard";
import NavBar from "../components/NavBar";
import { connect } from "react-redux";
import { startFetch } from "../redux/items/actions";
import { useNavigate } from "react-router";
import CardLayout from "./CardLayout";


const mapStateToProps = state => ({
    items : state.item.items,
    viewdItem : state.control.viewdItem
})

const mapDispatchToProps = dispatch => ({
    FETCH_ITEMS : () => dispatch(startFetch())
})


const SingleCardLayout = connect(mapStateToProps, mapDispatchToProps)(class SingleCardLayout extends React.Component{
    constructor(props){
        super(props);
        this.state={
            similarItems : null,
            itemViewd : "_"
        }
    }

    componentDidMount(){
        const id = window.location.pathname.substring(10)
        if(this.props.items !== undefined && this.props.items.length > 0){
            
            
            const thisItem = this.props.items.filter(item => item._id === id)[0]
            if(thisItem !== undefined){
                const similar = this.props.items.filter(item => (item.category === thisItem.category && item.male === thisItem.male && item.female === thisItem.female && item._id !== thisItem._id))
                this.setState({
                    itemViewd : thisItem,
                    similarItems : similar
                })
                
            }
            else{
                this.props.FETCH_ITEMS()
            }
        }
        else{
            this.props.FETCH_ITEMS()
        }

        window.scrollTo({top: 0})
    }

    componentDidUpdate(prevProps){
        if(prevProps !== this.props){
            
            
            let id = this.props.viewdItem
            if(id === null){
                id = window.location.pathname.substring(10)
            }
            

            if(id.length === 24){
                if(this.state.itemViewd === "_" || this.state.itemViewd._id !== id){
                
                    if(this.props.items !== undefined && this.props.items.length > 0){
                        const thisItem = this.props.items.filter(item => item._id === id)[0]
                        
                        
                        if(thisItem !== undefined){
                            const similar = this.props.items.filter(item => (item.category === thisItem.category && item.male === thisItem.male && item.female === thisItem.female && item._id !== thisItem._id))
                            this.setState({
                                itemViewd : thisItem,
                                similarItems : similar
                            })
                            
                        }
                        else{
                            console.log(1)
                            this.setState({
                                itemViewd : "NOT FOUND"
                            })
                        }
                    }
                    else{
                        this.setState({
                            itemViewd : "NOT FOUND"
                        })
                    }
                }
            }
            else{
                window.location.href = '/error'
            }
        }

        window.scrollTo({top: 0})
    }

    setItem = () => {
        if(this.state.itemViewd === "_"){
            return (
                null
            )
        }
        else if(this.state.itemViewd === "NOT FOUND"){
            return(
                <div>
                    THIS ITEM HAS ALREADY BEEN SOLD
                </div>
            )
        }
        else if(typeof(this.state.itemViewd) === "object"){
            return <SingleCard item = {this.state.itemViewd} navigate={this.props.navigate}/>
        }
    }

    getNonSimilarItems = () => {
        if(this.state.similarItems !== null && this.state.similarItems.length > 0){
            const unwantedIDs = this.state.similarItems.map((item, index) => {return(item._id)})
            const difItems = this.props.items.filter(item => !unwantedIDs.includes(item._id))
            return difItems
        }
        else{
            return this.props.items
        }
    }


    
    render(){
        return(
            <div>
                <NavBar/>
                <div className="row mx-2">
                    <div className='col-md-2 m-0 p-0'></div>
                    <div className='main_body col-12 col-md-8 mx-0 mt-md-3 p-0'>
                        {this.setItem()}
                        <br/>
                        <br/>
                        <br/>
                        {this.state.similarItems !== null && this.state.similarItems.length > 0 ? 
                            <div>
                                <hr/>
                                <div className="formLegend px-2">SIMILAR ITEMS</div>
                                <br/>
                                <CardLayout items={this.state.similarItems}/>
                            </div>
                        : null}
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <div>
                            <hr/>
                            <div className="formLegend px-2">MORE ITEMS</div>
                            <br/>
                            <CardLayout items={this.getNonSimilarItems()}/>
                        </div>

                        <br/>
                        <hr/>
                        <div className="button" style={{color: '#474747', textAlign: 'center', cursor: 'pointer'}} onClick={() => this.props.navigate("/shop")}>GO TO SHOP</div>
                        <hr/>
                    </div>
                    <div className='col-md-2 m-0 p-0'></div>
                </div>
            </div>
        )
    }
})




const SingleView = () => {
    const navigate = useNavigate()

    const nav = (link, state=null) => {
        if(state===null){
            navigate(link)
        }
        else{
            navigate(link, state)
        }
    }

    return(
        <div>
            <SingleCardLayout navigate={nav}/>
        </div>

    )
}

export default SingleView
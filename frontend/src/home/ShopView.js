import React from "react";
import CardLayout from "./CardLayout";
import NavBar from "../components/NavBar";
import { startFetch } from "../redux/items/actions";
import { connect } from "react-redux";
import SearchBar from "../components/Searchbar";

const mapStateToProps = state => ({
    items : state.item.items,
    filter : state.control.filter,
    search : state.control.search
})

const mapDispatchToProps = dispatch => ({
    START_FETCH : () => dispatch(startFetch())
})


export default connect(mapStateToProps, mapDispatchToProps)(class ShopView extends React.Component{
    constructor(props){
        super(props);
        this.state={
            items : [],
            searchWord : ''
        }
    }

    componentDidMount(){
        if(!this.props.items.length > 0){
            this.props.START_FETCH()
        }
        else{
            this.setState({
                items: this.props.items
            })
        } 

        window.scrollTo({top:0})
    }

    

    componentDidUpdate(prevProps){
        let filter1 = this.props.items;

        if(prevProps !== this.props){

            if(this.props.filter.male !== null && this.props.filter.female !== null){
                if(this.props.filter.male === true){
                    filter1 = filter1.filter(item => item.male === true)
                }
                else if(this.props.filter.female === true){
                    filter1 = filter1.filter(item => item.female === true)
                }
            }

        
            this.setState({
                items : filter1,
            })
        }
        
    }

    getItems = () => {
        let items = this.state.items
        if(this.state.searchWord.length > 0){
            items = this.state.items.filter(item => item.name.toLowerCase().includes(this.state.searchWord.toLowerCase()) || item.keywords.toLowerCase().includes(this.state.searchWord.toLowerCase()) )
        }

        
        return items
    }
        


    render(){
        return(
            
            <div>
                <NavBar/>
                {this.props.search ? <SearchBar setSearchWord = {word => this.setState({searchWord : word})}/> : null}
                <div className="row mx-2">
                    <div className='col-md-1 m-0 p-0'></div>
                    <div className='main_body col-12 col-md-10 mx-0 p-0'>
                        <div className="mb-3" style={{minHeight: '1.5em'}}>
                            {this.props.filter.male === true ? 
                            <div className="gen_lbl ps-2">
                                MALES 
                            </div> : 
                            this.props.filter.female === true ?
                            <div className="gen_lbl ps-2">
                                FEMALES
                            </div> :
                            null}
                        </div>
                        {this.getItems().length > 0 ? <CardLayout items={this.getItems()}/> : this.props.search ? <div className="text-center text-muted">no results for this search</div> : <div className="text-center text-muted">loading...</div>}
                    </div>
                    <div className='col-md-1 m-0 p-0'></div>
                </div>
            </div>
        )
    }
})
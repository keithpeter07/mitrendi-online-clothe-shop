import React, { useState } from "react";
import { useNavigate } from "react-router";
import settings from '../Settings.json';
import { setViewd } from '../redux/controls/actions';
import { connect } from 'react-redux';


const mapDispatchToProps = dispatch => ({
    SET_VIEWD : (Id) => dispatch(setViewd(Id))
})



const ItemCard = connect(null, mapDispatchToProps)(function ItemCard(props){
    const [firstImage, setImage] = useState(true)

    const navigate = useNavigate()

    const toggleImage = () => {
        setImage(!firstImage)
    }

    const viewItem = () => {
        props.SET_VIEWD(props.itemDetails._id)
        if(window.location.pathname !== '/viewItem'){
            navigate('/viewItem/' + props.itemDetails._id)
        }
        
    }

    return(
        <div className="card item_card m-0 p-0" onMouseEnter={toggleImage} onMouseLeave={toggleImage} onClick={viewItem}>
            <div className="card-body m-0 p-0">
                <div className="item_image_cont">
                    <img className="item_image image-fluid" src={firstImage ? settings.SERVER_STATIC + props.itemDetails.image1 : settings.SERVER_STATIC + props.itemDetails.image2} alt={props.itemDetails.name}/>
                </div>
            </div>
            <div className="card-footer m-0 p-0 pt-1">
                <div style={{textAlign:'center', letterSpacing:'1px', color: '#565656', fontWeight: 'bold', fontSize: '1em'}}>{props.itemDetails.name.toUpperCase()}</div>
                <div className="usls" style={{minHeight: '1.5em'}}><div className="price_view" style={{textAlign:'center', color: '#128812'}}>ksh {props.itemDetails.price.toLocaleString()}</div></div>
            </div>
        </div>
    )
})


export default class CardLayout extends React.Component{
    

    mbItems(){
        let itemCards = []
        let x = 0
        while(x < this.props.items.length){
            itemCards.push(
                <div className="row m-0 p-0 mb-4" key={this.props.items[x]._id}>
                    <div className="col-6 m-0 px-1"><ItemCard itemDetails={this.props.items[x]}/></div>
                    <div className="col-6 m-0 px-1">{this.props.items[x+1] ? <ItemCard itemDetails={this.props.items[x+1]}/> : null}</div>
                </div>
            )
            x += 2;
        }

        return itemCards
    }

    wsItems(){
        let itemCards = []
        let x = 0
        while(x < this.props.items.length){
            itemCards.push(
                <div className="row m-0 p-0 mb-4" key={this.props.items[x]._id}>
                    <div className="col-3 m-0 px-1"><ItemCard itemDetails={this.props.items[x]}/></div>
                    <div className="col-3 m-0 px-1">{this.props.items[x+1] ? <ItemCard itemDetails={this.props.items[x+1]}/> : null}</div>
                    <div className="col-3 m-0 px-1">{this.props.items[x+2] ? <ItemCard itemDetails={this.props.items[x+2]}/> : null}</div>
                    <div className="col-3 m-0 px-1">{this.props.items[x+3] ? <ItemCard itemDetails={this.props.items[x+3]}/> : null}</div>
                </div>
            )
            x += 4;
        }

        return itemCards
    }

    render(){
        return(
            <div>
                <div className="d-md-none d-block">
                    {this.mbItems()}
                </div>
                <div className="d-none d-md-block">
                    {this.wsItems()}
                </div>
            </div>
        )
    }
}
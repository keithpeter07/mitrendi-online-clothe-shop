import React, { useEffect } from "react";
import axios from "axios";
import settings from '../Settings.json';
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";
import AdminNavBar from "./AdminNavbar";






class AddItemForm extends React.Component{
    constructor(props){
        super(props)
        this.state={
            imageUpload: null,
            imageURLs: [],

            name: '',
            price: '',
            description: '',
            size: '',
            male: false,
            female: false,
            bp: '',
            category: '',
            keywords: ''
        }
    }

    updateImage = event => {

        const URLs = []
        for(let i = 0; i < event.target.files.length; i++){
            URLs.push(URL.createObjectURL(event.target.files[i]))
        }

        this.setState({
            imageUpload: event.target.files,
            imageURLs: URLs
        })
    }

    previewImage = () => {
        return (this.state.imageURLs.map((url, index) => 
            <div className="col-3" key={index}>
                <div className="item_image_cont" style={{borderRadius: '5px'}}>
                    <img className="item_image image-fluid" src={url} alt="!not found"/>
                </div>
            </div>
            )
        )
    }

    getPercentageProfit = () => {
        let pp = ''
        if(this.state.bp.length > 0 && this.state.price.length > 0){
            const sp = parseInt(this.state.price)
            const bp = parseInt(this.state.bp)
            

            const percentageProfit = (((sp/bp) * 100) - 100).toFixed(2)

            if(percentageProfit > 0){
                pp = <div style={{color: '#454545'}}><span className="px-1" style={{border: '1px solid #454545', borderRadius: '5px', color: '#228899', fontWeight: '700'}}>{percentageProfit}</span> % profit</div>
            }
            else if(percentageProfit >= 20){
                pp = <div style={{color: '#454545'}}><span className="px-1" style={{border: '1px solid #454545', borderRadius: '5px', color: '#0055bb', fontWeight: '700'}}>{percentageProfit}</span> % profit</div>
            }
            else if(percentageProfit <= 0){
                pp = <div style={{color: '#770000'}}><span className="px-1" style={{border: '1px solid #454545', borderRadius: '5px', color: '#aa0000', fontWeight: '700'}}>{percentageProfit}</span> % loss (negative)</div>
            }
        }
        else{
            pp = '___'
        }

        return pp
    }


    updateFormData = (event, label) => {
        switch(label){
            case 'name':
                this.setState({
                    name: event.target.value
                })
                break
            case 'price':
                this.setState({
                    price: event.target.value.toString()
                })
                break
            case 'BP':
                this.setState({
                    bp: event.target.value.toString()
                })
                break
            case 'size':
                this.setState({
                    size: event.target.value
                })
                break
            case 'description':
                this.setState({
                    description: event.target.value
                })
                break
            case 'category':
                this.setState({
                    category: event.target.value
                })
                break
            case 'keywords':
                this.setState({
                    keywords: event.target.value
                })
                break
            case 'male':
                this.setState({
                    male: document.getElementById('male_selector').checked
                })
                break
            case 'female':
                this.setState({
                    female: document.getElementById('female_selector').checked
                })
                break
            default:
                //pass
        }
    }

    handleSubmit = event => {
        event.preventDefault()

        const data = new FormData()

        for(let i = 0; i < this.state.imageUpload.length; i++){
            data.append('file', this.state.imageUpload[i])
        }

        data.append('name', this.state.name)
        data.append('description', this.state.description)
        data.append('price', parseInt(this.state.price))
        data.append('bp', parseInt(this.state.bp))
        data.append('size', this.state.size)
        data.append('male', this.state.male)
        data.append('female', this.state.female)
        data.append('category', this.state.category)
        data.append('keywords', this.state.keywords)



        axios.post(settings.SERVER_SUPER + '/shop/addItem', data, {withCredentials: true, headers: {'access_token' : window.sessionStorage.access_token, 'username' : window.sessionStorage.username}})
            .then((res) => {
                toast.success('Item uploaded to server', {
                    position: toast.POSITION.TOP_CENTER,
                    hideProgressBar: true,
                    style: {color: '#00bb00'}
                })
                window.location.reload()
            })
            .catch((err) => {
                console.log(err)
            })

    }


    changeCategory = val => {
        switch(val){
            case 'TOP':
                document.getElementById('category').value = 'TOP'
                this.updateFormData({target: {value: 'TOP'}}, 'category')
                break
            case 'BOTTOM':
                document.getElementById('category').value = 'BOTTOM'
                this.updateFormData({target: {value: 'BOTTOM'}}, 'category')
                break
            case 'HEAD':
                document.getElementById('category').value = 'HEAD'
                this.updateFormData({target: {value: 'HEAD'}}, 'category')
                break
            case 'FEET':
                document.getElementById('category').value = 'FEET'
                this.updateFormData({target: {value: 'FEET'}}, 'category')
                break
            case 'UNDER':
                document.getElementById('category').value = 'UNDER'
                this.updateFormData({target: {value: 'UNDER'}}, 'category')
                break
            default:
                //pass
        }
    }

    render(){
        return(
            <div>
                <br/>
                <div className="" style={{width: '100%', height: 'auto', border: '1px solid black', borderRadius: '7px'}}>
                    <div className="row mx-1">
                        {this.previewImage()}
                    </div>
                </div>
                <br/>
                <form className="formFieldset">
                    <div className="formLegend">ADD ITEM</div>
                    <div className="fieldset d-flex flex-row align-items-center px-3">
                        {this.state.imageUpload === null ? null : <div className="legend">image</div>}
                        {this.state.imageUpload === null ? <label className="pe-4 text-muted" htmlFor="image_input">image</label> : null}
                        <input id='image_input' className="auth_input" type="file" multiple accept=".jpg, .jpeg, .png" onChange={(event) => this.updateImage(event)}/>
                    </div>
                    <div className="fieldset d-flex flex-row align-items-center px-3">
                        {this.state.name.length > 0 ? <div className="legend">name</div> : null}
                        <input className="auth_input" type="text" placeholder="name" onChange={(event) => this.updateFormData(event, 'name')}/>
                    </div>
                    <div>
                        <div className="d-flex">
                            <div className="fieldset d-flex flex-row align-items-center px-3 me-1">
                                {this.state.bp.length > 0 ? <div className="legend">buying price(ksh)</div> : null}
                                <input className="auth_input" type="number" pattern="[0-9]*" inputMode="numeric" placeholder="buying price(ksh)" onChange={(event) => this.updateFormData(event, 'BP')}/>
                            </div>
                            <div className="fieldset d-flex flex-row align-items-center px-3 ms-1">
                                {this.state.price.length > 0 ? <div className="legend">price(ksh)</div> : null}
                                <input className="auth_input" type="number" placeholder="price(ksh)" onChange={(event) => this.updateFormData(event, 'price')}/>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            {this.getPercentageProfit()}
                        </div>

                    </div>
                    {/* <div className="fieldset d-flex flex-row align-items-center px-3">
                        {this.state.description.length > 0 ? <div className="legend">description</div> : null}
                        <textarea className="auth_input pt-3" placeholder="description (raw)" style={{height: 'auto'}} onChange={(event) => this.updateFormData(event, 'description')}></textarea>
                    </div>
                    <input className="auth_input" type="text" placeholder={this.state.description}/> */}

                    <textarea className="auth_input pt-3 fieldset d-flex flex-row align-items-center px-3" placeholder="description (raw)" style={{height: 'fit-content'}} onChange={(event) => this.updateFormData(event, 'description')}>
                        
                    </textarea>

                    {/* <span style={{whiteSpace: 'pre-wrap'}}>
                        {this.state.description}
                    </span> */}


                    <div className="fieldset d-flex flex-row align-items-center px-3">
                        {this.state.size.length > 0 ? <div className="legend">size</div> : null}
                        <input className="auth_input" type="text" placeholder="size" onChange={(event) => this.updateFormData(event, 'size')}/>
                    </div>
                    
                    <div className="px-3" style={{border: '1px dotted #454545'}}>
                        <ul className="px-0" style={{listStyle: 'none', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: '0', color: '#676767'}}>
                            <li style={{cursor: 'pointer', borderRight: '1px solid #676767', paddingRight: '.5em'}} onClick={() => this.changeCategory('TOP')}>TOP</li>
                            <li style={{cursor: 'pointer', borderRight: '1px solid #676767', paddingRight: '.5em'}} onClick={() => this.changeCategory('BOTTOM')}>BOTTOM</li>
                            <li style={{cursor: 'pointer', borderRight: '1px solid #676767', paddingRight: '.5em'}} onClick={() => this.changeCategory('HEAD')}>HEAD</li>
                            <li style={{cursor: 'pointer', borderRight: '1px solid #676767', paddingRight: '.5em'}} onClick={() => this.changeCategory('FEET')}>FEET</li>
                            <li style={{cursor: 'pointer'}} onClick={() => this.changeCategory('UNDER')}>UNDER</li>
                        </ul>
                        <div className="fieldset d-flex flex-row align-items-center px-3 mt-2">
                            {this.state.category.length > 0 ? <div className="legend">category</div> : null}
                            <input id='category' className="auth_input" type="text" placeholder="category" onChange={(event) => this.updateFormData(event, 'category')}/>
                        </div>
                    </div>

                    <div className="fieldset d-flex flex-row align-items-center px-3">
                        {this.state.keywords.length > 0 ? <div className="legend">keywords</div> : null}
                        <input className="auth_input" type="text" placeholder="keywords" onChange={(event) => this.updateFormData(event, 'keywords')}/>
                    </div>

                    <div className="fieldset d-flex flex-row align-items-center px-3">
                        <label className="me-5 text-muted" htmlFor="male_selector">male</label>
                        <input id="male_selector" className="auth_input" type="checkbox" style={{width: '1.5em', height: '1.5em', cursor: 'pointer'}} onChange={(event) => this.updateFormData(event, 'male')}/>
                        <span className="ms-5">{this.state.male ? <span style={{color: '#0055bb'}}>true</span> : <span style={{color: '#770000'}}>false</span>}</span>
                    </div>
                    <div className="fieldset d-flex flex-row align-items-center px-3">
                        <label className="me-5 text-muted" htmlFor="male_selector">female</label>
                        <input id="female_selector" className="auth_input" type="checkbox" style={{width: '1.5em', height: '1.5em', cursor: 'pointer'}} onChange={(event) => this.updateFormData(event, 'female')}/>
                        <span className="ms-5">{this.state.female ? <span style={{color: '#0055bb'}}>true</span> : <span style={{color: '#770000'}}>false</span>}</span>
                    </div>
                    <button className="action_btn bn mt-4" type='submit' onClick={(event) => this.handleSubmit(event)}>
                        SEND
                    </button>
                </form>
            </div>
        )
    }
}





const AddItemPage = () => {

    const location = useLocation()

    const navigate = useNavigate()


    useEffect(() => {

        if(location.state && location.state.authed){
        
        axios.get(settings.SERVER_AUTH + '/authenticate_superuser', {withCredentials: true, headers: {'access_token' : window.sessionStorage.access_token, 'username' : window.sessionStorage.username}})
            .catch((err) => {
                navigate('/admin', {replace: true})
            })
        }
        else{
            navigate('/admin', {replace: true})
        }

        window.scrollTo({top: 0})
    },[location.state, navigate])

    return(
        <div>
            <AdminNavBar/>
            <div className="row mx-2 mt-4">
                <div className='col-md-4 m-0 p-0'></div>
                <div className='main_body col-12 col-md-4 mx-0 p-0'>
                    <AddItemForm/>
                </div>
                <div className='col-md-4 m-0 p-0'></div>
            </div>
        </div>
    )
}



export default AddItemPage
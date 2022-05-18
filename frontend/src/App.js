import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Home from './home/HomeView';
import HomeView from './home/ShopView';
import SingleView from './home/SingleView';
import CartView from './cart/CartView';
import SignupPage from './auth/SignUp';
import LoginPage from './auth/Login';
import OrdersView from './profile/Orders';
import CheckoutView from './checkout/Checkout';
import ChangePasswordPage from './auth/ChangePass';
import ErrorPage from './components/ErrorPage';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';

import AdminLogin from './admin/AdminLogin';
import AdminUsersView from './admin/AdminUsers';
import AdminOrdersView from './admin/AdminOrders';
import AddItemPage from './admin/AdminAddItems';
import ItemsView from './admin/AdminItems';


function App() {
  return (
    <div>
      <ToastContainer
          hideProgressBar={true}
          position={'top-center'}
          limit={2}/>

      <Provider store={store}>
        <Router>
          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route exact path='/shop' element={<HomeView/>}/>
            <Route exact path='/viewItem/:id' element={<SingleView/>}/>
            <Route exact path='/cart' element={<CartView/>}/>
            <Route exact path='/signup' element={<SignupPage/>}/>
            <Route exact path='/login' element={<LoginPage/>}/>
            <Route exact path='/profile' element={<OrdersView/>}/>
            <Route exact path='/checkout' element={<CheckoutView/>}/>
            <Route exact path='/change_password/:modify_token' element={<ChangePasswordPage/>}/>

            <Route exact path='/admin' element={<AdminLogin/>}/>
            <Route exact path='/admin/users' element={<AdminUsersView/>}/>
            <Route exact path='/admin/orders' element={<AdminOrdersView/>}/>
            <Route exact path='/admin/items' element={<ItemsView/>}/>
            <Route exact path='/admin/item/upload' element={<AddItemPage/>}/>
            <Route exact path='*' element={<ErrorPage/>}/>
          </Routes>
        </Router>
      </Provider>
      <Footer/>
    </div>
  );
}

export default App;

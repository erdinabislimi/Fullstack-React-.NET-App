import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Registration from "./Registration";
import Home from "./Home";
import Dashboard from "./dashboard/Dashboard";
import Klienti from "./dashboard/Klienti";
import Libri from "./dashboard/Libri";
import Autori from "./dashboard/Autori";
import Qyteti from "./dashboard/Qyteti";
import Profile from "./components/Navbar/Profile";
import Manga from "./components/Manga/Manga";
import Biography from "./components/Bio/Biography";
import Fiction from "./components/Fiction/Fiction";
import Crime from "./components/Crime/Crime";
import Anime from "./components/Anime/Anime";
import ShtepiaBotuese from "./dashboard/ShtepiaBotuese";
import zhanri from "./dashboard/zhanri";
import ProductView from "./components/ProductView/ProductView";
import Product from "./components/Products/Product/Product";
import Products from "./components/Products/Products";
import Ratings from "./dashboard/Ratings";
import ExchangeForm from "./Exchange/ExchangeForm";
import ExchangeList from "./Exchange/ExchangeList";
import ExchangeApprove from "./Exchange/ExchangeApprove";
import apiService from "./Exchange/apiService";
import getNotifications from "./Noitification/getNotifications";
import Notification from "./Noitification/Notification";
import PendingApproval from "./Exchange/PendingApproval";
import Exchange from "./Exchange/Exchange";
import Events from "./dashboard/Events";
import UserListEvent from "./components/Events/UserListEvent";
import Payments from "./dashboard/Payments";
import PaymentForm from "./dashboard/PaymentForm";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import NotificationsPolling from "./Noitification/NotificationsPolling";

const stripePromise = loadStripe('pk_test_51QdwaXCkSXNzrMraazlatb03FsqDq2E3x4xjWU8gUqk95gtJpm52FjOGKufMxFa9IAbmCeOGREdyvC8Zp4JSMuW100VE1jVlxV');


function App() {
  return (
    <AuthProvider>
      <Router>
      <Elements stripe={stripePromise}>
        <Switch>
          <ProtectedRoute path="/home" component={Home} allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/Events" component={Events}  allowedRoles={['admin']}/>
          <ProtectedRoute path="/UserListEvent" component={UserListEvent}  allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/NotificationsPolling" component={NotificationsPolling}  allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/dashboard" component={Dashboard}  allowedRoles={['admin']}/>
          <ProtectedRoute path="/klienti" component={Klienti} allowedRoles={['admin']} />
          <ProtectedRoute path="/autori" component={Autori}  allowedRoles={['admin']} />
           <ProtectedRoute path="/profile" component={Profile}  allowedRoles={['admin', 'user']}/>
          <ProtectedRoute path="/qyteti" component={Qyteti} allowedRoles={['admin']} />
          <ProtectedRoute path="/libri" component={Libri}  allowedRoles={['admin']}/>
          <ProtectedRoute path="/manga" component={Manga}  allowedRoles={['admin', 'user']}/>
          <ProtectedRoute path="/zhanri" component={zhanri} allowedRoles={['admin']} />
          <ProtectedRoute path="/biography" component={Biography}  allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/fiction" component={Fiction}  allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/crime" component={Crime}  allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/anime" component={Anime}  allowedRoles={['admin', 'user']}/>
          <ProtectedRoute path="/shtepiabotuese" component={ShtepiaBotuese}   allowedRoles={['admin']}/>
          <ProtectedRoute path="/Product" component={Product}  allowedRoles={['admin', 'user']}/>
          <ProtectedRoute path="/Products" component={Products}  allowedRoles={['admin', 'user']}/>
          <ProtectedRoute path="/ratings" component={Ratings} allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/product-view/:id" component={ProductView}  allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/exchangeForm" component={ExchangeForm}  allowedRoles={['admin', 'user']}/>
          <ProtectedRoute path="/exchangeList" component={ExchangeList}  allowedRoles={['admin']}/>
          <ProtectedRoute path="/exchangeApprove" component={ExchangeApprove} />
          <ProtectedRoute path="/getNotifications" component={getNotifications} allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/Notificationss" component={Notification}  allowedRoles={['admin', 'user']} />
          <ProtectedRoute path="/Exchange" component={Exchange}  allowedRoles={['admin', 'user']}/>
          <ProtectedRoute path="/PendingApproval" component={PendingApproval} allowedRoles={['admin', 'user']} />
         
          <ProtectedRoute path="/apiService" component={apiService} />
 <ProtectedRoute path="/Payments" component={Payments}allowedRoles={['admin', 'user']} />
 <ProtectedRoute path="/PaymentForm" component={PaymentForm} allowedRoles={['admin', 'user']} />
          <Route path="/registration" component={Registration} />
          <Route path="/" component={Login} />
        </Switch>
        </Elements>
      </Router>
    </AuthProvider>
  );
}

export default App;

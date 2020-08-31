import React, { Component } from 'react';
import NotificationAlert from "react-notification-alert";
import Cookies from 'universal-cookie';
import "./login.css"
let { PrivateKey, key_utils } = require('voilk/lib/auth/ecc');
require('isomorphic-fetch');

class Login extends Component {
   constructor(props) {
      super(props);
      let cookies = new Cookies();
      this.state = {
        username: cookies.get("BEARS_USERNAME"),
        pass: cookies.get("BEARS_posting"),
        posting_pubkey: cookies.get("BEARS_postingPUB")
      };
      this.onDismiss = this.onDismiss.bind(this);
      this.notify = this.notify.bind(this);
    }
  state = {
      username: "",
      pass: "",
      msg: "",
      posting_pubkey: "",
      available: false
  }
  onDismiss() { }
  notify(place, msg) {
    var color = Math.floor(Math.random() * 5 + 1);
    var type;
    switch (color) {
      case 1:
        type = "primary";
        break;
      case 2:
        type = "success";
        break;
      case 3:
        type = "danger";
        break;
      case 4:
        type = "warning";
        break;
      case 5:
        type = "info";
        break;
      default:
        break;
    }
    type = "info";
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          {msg}
        </div>
      ),
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 10
    };
    this.refs.notificationAlert.notificationAlert(options);
  }
  validate_account_name = (value) => {
    let i, label, len, length, ref;

    if (!value) {
      return "Account name Should not be empty";
    }
    length = value.length;
    if (length < 3) {
      return "Account name should be at least 3 characters";
    }
    if (length > 16) {
      return "Account name should be shorter than 16 characters";
    }
    ref = value.split('.');
    for (i = 0, len = ref.length; i < len; i++) {
      label = ref[i];
      if (!/^[a-z]/.test(label)) {
        return "Account name can only consist upon small letters, digits, and dashes!";
      }
      if (!/^[a-z0-9-]*$/.test(label)) {
        return "Account name can only consist upon letters, digits and dashes";
      }
      if (/--/.test(label)) {
        return "Account name can only have 1 dash in a row";
      }
      if (!/[a-z0-9]$/.test(label)) {
        return "Account name should end with a letter or digit";
      }
      if (!(label.length >= 3)) {
        return "each account segment should be longer";
      }

    }
    
    return null;
  }
  username_exists = (e) => {
    //this.notify("tr", (<div>Contacting blockchain <b> for verification</b> - of your account </div>))
    //this.validate_account_name(e);
    
    fetch('https://graphql.voilk.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ account(name: "' + e + '") { name posting {key_auths} } }' }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res.data);
        if (res.data.account !== null) {
          this.setState(
            {
              error: "Account exists on blockchain  ✅",
              available: true,
              username: res.data.account.name,
              posting_pubkey: res.data.account.posting.key_auths[0][0]
            }
          );
          this.notify("tr", (<div>Notification alert - {this.state.error} - <b>{this.state.username}</b></div>))
          this.verifykey(this.state.pass);
          return;
        }
        else {
          this.setState(
            {
              error: "Account does not exist ",
              availbtn: true,
              username: ""
            }
          );
          this.notify("tr", (<div>Notification alert - {this.state.error} - <b>{this.state.username}</b></div>))

          return;
        }
      });
  }
  handlechange = (e) => {
    console.log(e.target.value);
    let msg = this.validate_account_name(e.target.value);
    if (msg !== null) {
      this.setState(
        {
          username: "",
          error: msg
        }
      );
      return;
      //this.notify("tr", (<div>Notification alert - {this.state.error}</div>))
    }
    else {
      this.setState({
        username: e.target.value,
        error: "Username is Valid  ✅"
      });
      //this.notify("tr", (<div>Notification alert - {this.state.error}</div>))
    }
    
  }
  get_public_key(privWif) {
    var pubWif = PrivateKey.fromWif(privWif);
    pubWif = pubWif.toPublic().toString();
    return pubWif;
  };
  handlekey = (e) => {
    
    this.setState({
      pass: e.target.value
    });
    
  }
  verifykey = (e) => {
    let pub;
    try {
      pub = this.get_public_key(e);
    } catch (error) {
      this.setState({ error: "Invalid Key" })
    }
    if (pub === this.state.posting_pubkey) {
      this.setState({
        pass: e,
        error: "Your key is valid ✅"
      })
    }
    this.notify("tr", (<div>Notification Alert: {this.state.error}</div>))
    if (pub === this.state.posting_pubkey && this.state.available == true)
    {
      const cookies = new Cookies();
      cookies.set('BEARS_USERNAME', this.state.username);
      cookies.set('BEARS_posting', this.state.pass);
      cookies.set('BEARS_postingPUB', this.state.posting_pubkey); 
      this.notify("tr", (<div>Logging you in with <b>{cookies.get("BEARS_USERNAME")} </b>  
      {cookies.get("BEARS_posting")}
      </div>))
      this.notify("tr", (<div>We are redirecting you to <b>Dashboard</b> - in 5 seconds</div>))
      this.wait(5000);
      window.location.href = "/home"
    }
    else {
      const cookies = new Cookies();
      cookies.set('BEARS_USERNAME', null);
      cookies.set('BEARS_posting', null);
      this.notify("tr", (<div>Notification Alert: We Could not login {cookies.get("BEARS_USERNAME")} -
      {cookies.get("BEARS_posting")}
      </div>))    
    }
  }
    wait = (ms) =>
    {
        var d = new Date();
        var d2 = null;
        do { d2 = new Date(); }
        while(d2-d < ms);
    }
  handleLogin = (e) => {
      e.preventDefault()
      const msg = (
        <div>
          <img
                  height={"30px"}
                  src={
                    "https://loading.io/spinners/pies/lg.pie-chart-loading-gif.gif"
                  }
                  alt={"Loading..."}
                />
                Hold on <b>We are contacting blockchain</b><br />- to verify your information.
        </div>
      );
      this.notify("tr", msg);
      this.username_exists(this.state.username);    
      
  }
  componentDidMount() {

      if(!(this.state.username=="null"||this.state.username==undefined))
      {
        window.location.href = "/home";
      }
  }
    render() { 
        return ( 
         <div>
        <NotificationAlert ref="notificationAlert" />

        <div class="sidenav">
                    <div class="login-main-text">
                      
                    <h2>BearGrid<br/> Login</h2>
                    <p>Login to your account, by typing your account's username and Posting private key</p>
                    <p>Or <a href="/home"> click here </a>to go back and upload anonymously</p>
                    </div>
         </div>
     <div class="main">
        <div class="col-md-6 col-sm-12">
           <div class="login-form">
           <img src="../images/logo.png" alt=""/>

              <form>
                 <div class="form-group">
                    <label>User Name</label>
                    <input type="text" class="form-control" autofocus="autofocus" onChange={this.handlechange.bind(this)} placeholder="Insert username here"/>
                 </div>
                 <div class="form-group">
                    <label>Posting Private Key</label>
                    <input type="password" class="form-control"  onChange={this.handlekey.bind(this)} placeholder="Posting Private Key"/>
                 </div>
                 <button class="btn btn-black"  onClick={this.handleLogin.bind(this)}>Login</button>
                 <a href="https://voilk.com/register" class="btn btn-secondary">Register</a>
              </form>
           </div>
        </div>
     </div> 
     
     </div>);
    }
}
 
export default Login;
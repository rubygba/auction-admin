import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route, BrowserRouter, MemoryRouter } from 'react-router-dom';
import './styles/index.css';
// import App from './App';
import Guest from './guest/Guest';
import Login from './Login';
import LoginAdmin from './LoginAdmin';
import Admin from './admin/Admin';
import registerServiceWorker from './registerServiceWorker';

var doms = (
  <HashRouter>
    <Switch>
      <Route exact path='/' component={Login}/>
      <Route path='/qd/:subqd' component={Guest}/>
      <Route exact path='/login' component={Login}/>
      <Route exact path='/qd' component={Login}/>
    </Switch>
  </HashRouter>
)

// if (window.location.hostname.indexOf('dev.mop.com') > -1 ||
// window.location.hostname.indexOf('push.mop.com') > -1 ||
// window.location.hostname.indexOf('localhost') > -1 ||
// window.location.hostname.indexOf('testing.eastday.com') > -1 ||
// window.location.hostname.indexOf('novelpromotion.mop.com') > -1) {
  doms = (
    <HashRouter>
      <Switch>
        <Route exact path='/' component={Admin}/>
        <Route path='/qd/:subqd' component={Guest}/>
        <Route path='/push/:subpush' component={Admin}/>
        <Route exact path='/login' component={Login}/>
        {/*
          <Route exact path='/mangement' component={LoginAdmin}/>
          <Route exact path='/push' component={LoginAdmin}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/qd' component={Login}/>
        */}
      </Switch>
    </HashRouter>
  )
// }

ReactDOM.render(doms, document.getElementById('root'));
registerServiceWorker();

// <Route path='/roster' component={Roster}/>
// <Route path='/schedule' component={Schedule}/>

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import './App.css';
// import registerServiceWorker from './registerServiceWorker';


// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       date: '',
//     };
//   }
//   handleChange(date) {
//     message.info('您选择的日期是: ' + (date ? date.toString() : ''));
//     this.setState({ date });
//   }
//   render() {
//     return (
//       <div className="App">
//       </div>
//     );
//   }
// }

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
import React, { Component } from 'react';
import logo from '../logo.png';
import avatar from '../images/silhouette.jpg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MuiAppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { firebaseAuth } from '../config/constants';
import registerServiceWorker from '../registerServiceWorker';
import Login from './login/Login';
import Home from './home/Home';
import NewLesson from './newlesson/NewLesson';
import About from './about/About';
import PrepNote from './prepnote/PrepNote';

function AdminRoute({ component: Component, authed, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true &&
        (user.email === 'jerryhanksokafor@gmail.com' ||
          user.email === 'ezechekwubechukwu@gmail.com') ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
}

function PublicRoute({ component: Component, authed, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authed === false ? <Component {...props} /> : <Redirect to="/home" />
      }
    />
  );
}

class App extends Component {
  state = {
    authenticated: false,
    loading: false,
    user: {},
    splashPageHidden: true,
    drawerOpen: true,
  };

  handleToggle = () => this.setState({ drawerOpen: !this.state.drawerOpen });

  componentDidMount() {
    this.removeListener = firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
          user: user,
        });
        this.avatar.src = user.photoURL || avatar;
        this.displayName.textContent = user.displayName || 'User Display Name';
        console.log('Signed in!', user);
      } else {
        this.setState({
          authenticated: false,
          loading: false,
          user: null,
        });
        console.log('Not Signed in!');
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }
  render() {
    let containerStyle = { top: '64px', bottom: '0px' };
    const appBarStyle = { position: 'fixed', top: 0 };
    return (
      <MuiThemeProvider>
        <BrowserRouter>
          <div>
            <MuiAppBar
              title="Sunday School Lesson: New Lesson"
              style={appBarStyle}
              iconClassNameRight="muidocs-icon-navigation-expand-more"
              onLeftIconButtonClick={this.handleToggle.bind(this)}
            >
              <Drawer
                open={this.state.drawerOpen}
                containerStyle={containerStyle}
              >
                <div>
                  <Avatar
                    src={avatar}
                    ref={avatar => (this.avatar = avatar)}
                    style={{
                      width: '80px',
                      height: '80px',
                      margin: '20px 20px 5px 20px',
                    }}
                  />
                  <p
                    style={{ margin: '20px' }}
                    ref={displayName => (this.displayName = displayName)}
                  >
                    User Display Name
                  </p>
                  <hr />
                </div>

                <MenuItem containerElement={<Link to="/home" />}>Home</MenuItem>
                <MenuItem containerElement={<Link to="/new/lesson" />}>
                  New Lessons
                </MenuItem>
                <MenuItem containerElement={<Link to="/new/prepNote" />}>
                  New Prep Note
                </MenuItem>
                <MenuItem containerElement={<Link to="/about" />}>
                  About
                </MenuItem>
              </Drawer>
            </MuiAppBar>
            <div className="App">
              <Switch>
                <Route
                  path="/"
                  exact
                  render={() =>
                    this.state.authenticated ? (
                      <Redirect to="/home" />
                    ) : (
                      <Redirect to="/login" />
                    )
                  }
                />
                <PublicRoute
                  authed={this.state.authenticated}
                  path="/login"
                  component={Login}
                />
                <Route path="/login" component={Login} />
                <Route path="/home" exact component={Home} />
                <AdminRoute
                  authed={this.state.authenticated}
                  user={this.state.user}
                  path="/new/lesson"
                  exact
                  component={NewLesson}
                />
                <AdminRoute
                  path="/new/prepNote"
                  authed={this.state.authenticated}
                  user={this.state.user}
                  exact
                  component={PrepNote}
                />
                <Route path="/about" exact component={About} />
              </Switch>
            </div>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';

/* Icons */
import AddIcon from '@material-ui/icons/Add';
import AddCircle from '@material-ui/icons/AddCircle';
import HomeIcon from '@material-ui/icons/Home'
import InfoIcon from '@material-ui/icons/Info'
import HelpIcon from '@material-ui/icons/Help'

import Login from './components/login/Login';
import Home from './components/home/Home';
import NewLesson from './components/newlesson/NewLesson';


import { firebaseAuth } from './config'
import logo from './logo.png';
import avatar from './images/silhouette.jpg';
import './App.css';


const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'display',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  avatar: {
    textAlign: 'center',
    margin: 'auto'
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    height: '100%',
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
    },
  },
  content: {
    height: '100%',
    flexGrow: 1,
    padding: theme.spacing.unit * 5,
    [theme.breakpoints.up('md')]: {
      marginLeft: drawerWidth
    },
  },
});



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

const theme = createMuiTheme();

class App extends Component {
  state = {
    mobileOpen: false,
    authenticated: false,
    loading: false,
    user: {},
    splashPageHidden: true,
    drawerOpen: true,
  };

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

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { classes, theme } = this.props;

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <div className={classes.avatar}>
          <Avatar
            src={avatar}
            ref={avatar => (this.avatar = avatar)}
            style={{
              width: '100px',
              height: '100px',
              margin: 'auto',
            }}
          />
          <p style={{ margin: '20px' }}
            ref={displayName => (this.displayName = displayName)}>
            User Display Name
            </p>
        </div>
        <Divider />
        <List>

          <Link to="/home" >
            <MenuItem className={classes.menuItem}>
              <ListItemIcon className={classes.icon}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary='Home' />
            </MenuItem>
          </Link>
          <Link to="/new/lesson">
            <MenuItem className={classes.menuItem}>
              <ListItemIcon className={classes.icon}>
                <AddIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary='New Lessons' />
            </MenuItem>
          </Link>
          <Link to="/new/prepnote">
            <MenuItem className={classes.menuItem}>
              <ListItemIcon className={classes.icon}>
                <AddCircle />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="New Pre Note" />
            </MenuItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link to="/about">
            <MenuItem className={classes.menuItem}>
              <ListItemIcon className={classes.icon}>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="About" />
            </MenuItem>
          </Link>
          <Link to="/contact">
            <MenuItem className={classes.menuItem}>
              <ListItemIcon className={classes.icon}>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText classes={{ primary: classes.primary }} inset primary="Contact Us" />
            </MenuItem>
          </Link>
        </List>
      </div>
    );

    return (
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <div className={classes.root}>
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerToggle}
                  className={classes.navIconHide}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="title" color="inherit" noWrap>
                  &nbsp;&nbsp; Sunday Schhool Lessons.
            </Typography>
                {/* <Button variant="outlined" color="primary">
                  AppStore
                  </Button> */}
              </Toolbar>

            </AppBar>
            <Hidden mdUp>
              <Drawer
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={this.state.mobileOpen}
                onClose={this.handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden smDown implementation="css">
              <Drawer
                variant="permanent"
                open
                classes={{ paper: classes.drawerPaper, }}
              >
                {drawer}
              </Drawer>
            </Hidden>

            {/* Main */}
            <main className={classes.content}>
              <div className={classes.toolbar} />
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
              </Switch>
            </main>
          </div>
        </BrowserRouter>
      </MuiThemeProvider>)
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);

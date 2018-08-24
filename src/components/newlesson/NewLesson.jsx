import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

/* Form and form Control */
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import FormHelperText from '@material-ui/core/FormHelperText'
import MenuItem from '@material-ui/core/MenuItem'


import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DatePicker from '../custom/DatePicker';
import Swal from 'sweetalert2';
import './NewLesson.css';
import { fireStoreDb } from '../../config';
import { BOOKS_COLLECTION } from './../../utils'
import update from 'immutability-helper';

const styles = theme => ({
  root: {
    flexGrow: 1,
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 1,
  },
  container: {
    paddingTop: theme.spacing.unit * 3,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
  },
  paper_inner: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200,
  },
  selectSession: {
    marginTop: theme.spacing.unit * 2,
  },
});


class NewLesson extends Component {
  constructor(props) {
    super(props)
    this.registrations = []
    this.state = {
      session: '201802',
      sessions: []
    }

    this.handleSelectionChange = this.handleSelectionChange.bind(this)
  }


  handleSelectionChange = event => {
    console.log("onhandleSelectionChange: ", event.target)
    this.setState({ [event.target.name]: event.target.value })
  }

  componentDidMount() {
    let sessionSubscription = fireStoreDb
      .collection(BOOKS_COLLECTION)
      .onSnapshot(onSnapshot => {
        let sessions = onSnapshot.docChanges().map(session => session.doc.id)
        console.log("Sessions: ", sessions)
        this.setState({ sessions: sessions })
      })

    this.registrations.push(sessionSubscription)
  }

  componentWillUnmount() {
    this.registrations.map(unsubscribe => { unsubscribe() })
  }
  render() {
    const { classes } = this.props;
    const sessionsOptions = this.state.sessions.map((s, key) => {
      return <MenuItem key={key} value={s}>{s}</MenuItem>
    })
    console.log("Options: ", sessionsOptions)
    return (
      <div className={classes.root}>
        <Paper className={classes.paper} elevation={1}>
          <Typography variant="headline" component="h3" align="center">
            Add New Sunday School Lesson!
            </Typography>
          <Grid container spacing={24} className={classes.container}>
            <Grid item xs={3}>
              <FormControl className={classes.formControl}>
                <Select
                  value={this.state.session}
                  onChange={this.handleSelectionChange}
                  name="session"
                  displayEmpty
                  className={classes.selectSession}>
                  <MenuItem value="" disabled>Avaiable Sessions</MenuItem>
                  {sessionsOptions}
                </Select>
                <FormHelperText>Select Session</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper_inner}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper_inner}>xs=3</Paper>
            </Grid>
            <Grid item xs={3}>
              <Paper className={classes.paper_inner}>xs=3</Paper>
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

NewLesson.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NewLesson)

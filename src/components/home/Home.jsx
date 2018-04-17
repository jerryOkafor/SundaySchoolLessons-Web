import React, { Component } from 'react';
import {firebaseAuth} from '../../config/constants'

function logout(){
    firebaseAuth.signOut()
}
class Home extends Component {
  render() {
    return (
      <div>
        <p>This is the Home Page!</p>
        <p>
          <button onClick={() => logout()}>Logout</button>
        </p>
      </div>
    );
  }
}

export default Home;

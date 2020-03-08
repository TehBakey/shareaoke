import React from 'react';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';

class SignUpLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Jumbotron style={{ textAlign: 'center', background: 'orange' }}>
        <h1 style={{ color: 'white' }}>Welcome to Shareaoke!</h1>
        <p style={{ color: 'white' }}>
          Please login with Spotify to begin creating your very own Shareaoke playlist!
        </p>
        <a href="http://shareaoke.appspot.com/spotify/login">
          <Button variant="success">Login with Spotify</Button>
        </a>
      </Jumbotron>
    );
  }
}

export default SignUpLogin;

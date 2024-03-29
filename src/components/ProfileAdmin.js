import React, { Component, Fragment } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
export default class ProfileAdmin extends Component {
  state = {
    email: "",
    cognitoID: "",
    username: "",
    loading: true,
  };

  componentDidMount() {
    fetchAuthSession().then((response) => {
      this.setState({
        email: response.tokens.idToken.payload.email,
        cognitoID: response.identityId,
        username: response.tokens.accessToken.payload.username,
        loading: false,
      });
    });
  }

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Profile Admin</h1>
            <p className="subtitle is-5">Manage your user profile below:</p>
            <br />
            <div className="columns">
              <div className="column is-one-third">
                <form action="/ChangePassword">
                  <input type="submit" value="Change Password" />
                </form>
                <br />
                {this.state.loading ? (
                  <span>Loading... </span>
                ) : (
                  <span>
                    <h2>
                      <strong>Username:</strong> {this.state.username}
                    </h2>
                    <h2>
                      <strong>Email Address:</strong> {this.state.email}
                    </h2>
                    <h2>
                      <strong>Cognito ID: </strong> {this.state.cognitoID}
                    </h2>
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

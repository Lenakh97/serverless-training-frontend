import React, { Component } from "react";
import { confirmSignUp } from "aws-amplify/auth";
import FormErrors from "../FormErrors";
import Validate from "../../lib/formValidation";
import withNavigateHook from "../withNavigateHook";
class VerifyAccount extends Component {
  state = {
    username: "",
    verificationcode: "",
    errors: {
      cognito: null,
      blankfield: false,
    },
  };

  componentDidMount() {
    const locationState = location;

    if (locationState && locationState.username) {
      this.setState({ username: locationState.username });
    }
  }

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
      },
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error },
      });
    }

    // AWS Cognito integration here
    try {
      await confirmSignUp({
        username: this.state.username,
        confirmationCode: this.state.verificationcode,
      });
      this.props.navigate("/welcome");
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err,
        },
      });
    }
  };

  onInputChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  render() {
    return (
      <section className="section auth">
        <div className="container">
          <h1>Verification</h1>
          <p>
            We've sent you a email with a confirmation code. Please fill out the
            form below with the code.
          </p>
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="text"
                  id="username"
                  aria-describedby="usernameHelp"
                  placeholder="Enter username"
                  value={this.state.username}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="text"
                  id="verificationcode"
                  aria-describedby="verificationcodeHelp"
                  placeholder="Enter Verification Code"
                  value={this.state.verificationcode}
                  onChange={this.onInputChange}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <a href="/resendverification">Re-send verification code?</a>
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-success">Verify account</button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default withNavigateHook(VerifyAccount);

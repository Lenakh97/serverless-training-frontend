import React, { Component, useEffect, useState } from "react";
import { confirmSignUp } from "aws-amplify/auth";
import { FormErrors } from "../FormErrors";
import { Validate } from "../../lib/formValidation";

export const VerifyAccount = () => {
  const [username, setUsername] = useState<string>("");
  const [verificationcode, setVerificationCode] = useState<string>("");
  const [errors, setErrors] = useState<{ cognito: any; blankfield: boolean }>({
    cognito: null,
    blankfield: false,
  });

  useEffect(() => {
    const locationState = location;

    if (locationState && locationState.username) {
      setUsername(locationState.usename);
      this.setState({ username: locationState.username });
    }
  });

  const clearErrorState = () => {
    setErrors({
      cognito: null,
      blankfield: false,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, this.state);
    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    try {
      await confirmSignUp({
        username: username,
        confirmationCode: verificationcode,
      });
      this.props.navigate("/welcome");
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      setErrors({
        ...errors,
        cognito: err,
      });
      setErrors({
        ...errors,
        cognito: err,
      });
    }
  };

  const onInputChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  return (
    <section className="section auth">
      <div className="container">
        <h1>Verification</h1>
        <p>
          We've sent you a email with a confirmation code. Please fill out the
          form below with the code.
        </p>
        <FormErrors formerrors={errors} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Enter username"
                value={username}
                onChange={onInputChange}
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
                value={verificationcode}
                onChange={onInputChange}
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
};

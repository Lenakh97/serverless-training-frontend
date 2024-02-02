import React, { Component, useState } from "react";
import { resendSignUpCode } from "aws-amplify/auth";
import { FormErrors } from "../FormErrors";
import Validate from "../../lib/formValidation";

export const ResendVerification = () => {
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState<{
    cognito: any;
    blankfield: boolean;
  }>({
    cognito: null,
    blankfield: false,
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
    const error = Validate(event, { username, errors });
    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    try {
      await resendSignUpCode({ username: username });
      this.props.navigation("/verify", { username: username });
    } catch (error) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      setErrors({
        ...errors,
        cognito: err,
      });
    }
  };

  const onInputChange = (event: { target: { id: string; value: any } }) => {
    setUsername(event.target.value);
    document.getElementById(event.target.id).classList.remove("is-danger");
  };

  return (
    <section className="section auth">
      <div className="container">
        <h1>Resend verification code</h1>
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
              <button className="button is-success">Resend Verify code</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

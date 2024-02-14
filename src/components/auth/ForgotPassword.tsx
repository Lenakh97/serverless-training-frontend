import React, { useState } from "react";
import { resetPassword } from "aws-amplify/auth";
import { FormErrors } from "../FormErrors";
import Validate from "../../lib/formValidation";
import type { cognitoType } from "components/types";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [errors, setErrors] = useState<{
    cognito: cognitoType;
    blankfield: boolean;
  }>({ cognito: null, blankfield: false });

  const clearErrorState = () => {
    setErrors({
      cognito: null,
      blankfield: false,
    });
  };

  const forgotPasswordHandler = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, { email, errors });
    if (error) {
      setErrors({
        ...errors,
        ...error,
      });
    }

    // AWS Cognito integration here
    try {
      await resetPassword({ username: email });
      navigate("/forgotpasswordverification");
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = (event: { target: { id: string; value: string } }) => {
    setEmail(event.target.value);
    const id = document.getElementById(event.target.id);
    if (id !== null) {
      id.classList.remove("is-danger");
    }
  };

  return (
    <section className="section auth">
      <div className="container">
        <h1>Forgot your password?</h1>
        <p>
          Please enter the email address associated with your account and we'll
          email you a password reset link.
        </p>
        <FormErrors formerrors={errors} />

        <form onSubmit={forgotPasswordHandler}>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
              <input
                type="email"
                className="input"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <a href="/forgotpassword">Forgot password?</a>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success">Submit</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

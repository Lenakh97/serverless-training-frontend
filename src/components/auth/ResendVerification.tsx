import React, { useState } from "react";
import { resendSignUpCode } from "aws-amplify/auth";
import { FormErrors } from "../FormErrors";
import Validate from "../../lib/formValidation";
import type { cognitoType } from "components/types";
import { useNavigate } from "react-router-dom";

export const ResendVerification = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [errors, setErrors] = useState<{
    cognito: cognitoType;
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

  const handleSubmit = async (event: { preventDefault: () => void }) => {
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
      navigate("/verify", { state: { username: username } });
    } catch (error: any) {
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
    const id = document.getElementById(event.target.id);
    if (id !== null) {
      id.classList.remove("is-danger");
    }
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

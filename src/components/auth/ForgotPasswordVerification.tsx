import React, { useState } from "react";
import { confirmResetPassword } from "aws-amplify/auth";
import { FormErrors } from "../FormErrors";
import Validate from "../../lib/formValidation";
import type { cognitoType } from "components/types";
import { useNavigate } from "react-router-dom";

export const ForgotPasswordVerification = () => {
  const navigate = useNavigate();
  const [verificationcode, setVerificationcode] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [newpassword, setNewPassword] = useState<string>("");
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

  const passwordVerificationHandler = async (event: {
    preventDefault: () => void;
  }) => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, {
      verificationcode,
      email,
      newpassword,
      errors,
    });
    if (error) {
      setErrors({
        ...errors,
        ...error,
      });
    }

    // AWS Cognito integration here
    try {
      await confirmResetPassword({
        username: email,
        newPassword: newpassword,
        confirmationCode: verificationcode,
      });
      navigate("/changepasswordconfirmation");
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = (event: { target: { id: string; value: any } }) => {
    const id = document.getElementById(event.target.id);
    if (id !== null) {
      id.classList.remove("is-danger");
    }
  };

  return (
    <section className="section auth">
      <div className="container">
        <h1>Set new password</h1>
        <p>
          Please enter the verification code sent to your email address below,
          your email address and a new password.
        </p>
        <FormErrors formerrors={errors} />

        <form onSubmit={passwordVerificationHandler}>
          <div className="field">
            <p className="control">
              <input
                type="text"
                className="input"
                id="verificationcode"
                aria-describedby="verificationCodeHelp"
                placeholder="Enter verification code"
                value={verificationcode}
                onChange={() => {
                  setVerificationcode(verificationcode);
                  onInputChange;
                }}
              />
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="email"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={() => {
                  setEmail(email);
                  onInputChange;
                }}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                type="password"
                className="input"
                id="newpassword"
                placeholder="New password"
                value={newpassword}
                onChange={() => {
                  setNewPassword(newpassword);
                  onInputChange;
                }}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
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

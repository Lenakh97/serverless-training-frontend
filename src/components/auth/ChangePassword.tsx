import React, { useState } from "react";
import { updatePassword } from "aws-amplify/auth";
import { FormErrors } from "../FormErrors";
import Validate from "../../lib/formValidation";
import type { cognitoType } from "components/types";
import { useNavigate } from "react-router-dom";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldpassword, setOldPassword] = useState<string>("");
  const [newpassword, setNewPassword] = useState<string>("");
  const [confirmpassword, setConfirmpassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    cognito: cognitoType;
    blankfield: boolean;
    passwordmatch: boolean;
  }>({
    cognito: null,
    blankfield: false,
    passwordmatch: false,
  });

  const clearErrorState = () => {
    setErrors({
      cognito: null,
      blankfield: false,
      passwordmatch: false,
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Form validation
    clearErrorState();
    const error = Validate(event, {
      oldpassword,
      newpassword,
      confirmpassword,
      errors,
    });

    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    try {
      await updatePassword({
        oldPassword: oldpassword,
        newPassword: newpassword,
      });
      navigate("/changepasswordconfirmation");
    } catch (error: any) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      setErrors({
        ...errors,
        cognito: err,
      });
      console.log(err);
    }
  };

  const onInputChange = (event: { target: { id: string; value: any } }) => {
    const targetId = document.getElementById(event.target.id);
    if (targetId !== null) {
      targetId.classList.remove("is-danger");
    }
  };

  return (
    <section className="section auth">
      <div className="container">
        <h1>Change Password</h1>
        <FormErrors formerrors={errors} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="oldpassword"
                placeholder="Old password"
                value={oldpassword}
                onChange={() => {
                  setOldPassword(oldpassword);
                  onInputChange;
                }}
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
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
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                id="confirmpassword"
                placeholder="Confirm password"
                value={confirmpassword}
                onChange={() => {
                  setConfirmpassword(confirmpassword);
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
              <a href="/forgotpassword">Forgot password?</a>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success">Change password</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

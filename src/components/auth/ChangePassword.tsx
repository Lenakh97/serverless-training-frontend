import React, { Component, useState } from "react";
import { updatePassword } from "aws-amplify/auth";
import FormErrors from "../FormErrors";
import Validate from "../../lib/formValidation";

export const ChangePassword = () => {
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [errors, setErrors] = useState<{
    cognito: any;
    blankfield: boolean;
    passwordmatch: boolean;
  }>({
    cognito: null,
    blankfield: false,
    passwordmatch: false,
  });
  const [password, setPassword] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
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
    const error = Validate(event, this.state);

    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    try {
      await updatePassword({
        oldPassword: oldpassword,
        newPassword: newpassword,
      });
      this.props.navigation("/changepasswordconfirmation");
    } catch (error) {
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
    const id = event.target.id;
    const pass = { ...password, id: event.target.value };
    setPassword(pass);
    document.getElementById(event.target.id).classList.remove("is-danger");
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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

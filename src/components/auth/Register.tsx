import React, { useState } from "react";
import { signUp } from "aws-amplify/auth";
import { FormErrors } from "../FormErrors";
import Validate from "../../lib/formValidation";
import type { cognitoType } from "components/types";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
      username,
      email,
      password,
      confirmpassword,
      errors,
    });

    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    //const { username, email, password } = this.state;

    try {
      const signUpResponse = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email: email,
          },
        },
      });
      console.log(signUpResponse);
      navigate("/verify", { state: { username } });
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
    const id = document.getElementById(event.target.id);
    if (id !== null) {
      id.classList.remove("is-danger");
    }
  };

  return (
    <section className="section auth">
      <div className="container">
        <h1>Register</h1>
        <FormErrors formerrors={errors} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                id="username"
                aria-describedby="userNameHelp"
                placeholder="Enter username"
                value={username}
                onChange={() => {
                  setUsername(username);
                  onInputChange;
                }}
              />
            </p>
          </div>
          <div className="field">
            <p className="control has-icons-left has-icons-right">
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
                className="input"
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={() => {
                  setPassword(password);
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
              <button className="button is-success">Register</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

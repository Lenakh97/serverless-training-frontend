import React, { useState } from "react";

import { FormErrors } from "../FormErrors";
import Validate from "../../lib/formValidation";
import type { cognitoType } from "components/types";
import { useNavigate } from "react-router-dom";

export const LogIn = ({
  auth,
  handleLogIn,
}: {
  auth: {
    isAuthenticated: boolean;
    user: null;
  };
  handleLogIn: (username: string, password: string) => Promise<void>;
}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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
    const error = Validate(event, { username, password, errors });
    if (error) {
      setErrors({ ...errors, ...error });
    }

    // AWS Cognito integration here
    try {
      await handleLogIn(username, password);
      navigate("/");
    } catch (error: any) {
      let err = null;
      !error.message ? (err = { message: error }) : (err = error);
      setErrors({
        ...errors,
        cognito: err,
      });
    }
  };

  const onInputChange = (event: { target: { id: string } }) => {
    const id = document.getElementById(event.target.id);
    if (id !== null) {
      id.classList.remove("is-danger");
    }
  };

  return (
    <section className="section auth">
      <div className="container">
        <h1>Log in</h1>
        <FormErrors formerrors={errors} />

        <form onSubmit={handleSubmit}>
          <div className="field">
            <p className="control">
              <input
                className="input"
                type="text"
                id="username"
                aria-describedby="usernameHelp"
                placeholder="Enter username or email"
                value={username}
                onChange={() => {
                  setUsername(username);
                  onInputChange;
                }}
              />
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
            <p className="control">
              <a href="/forgotpassword">Forgot password?</a>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <button className="button is-success">Login</button>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

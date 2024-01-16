import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {signIn, signOut, fetchAuthSession } from "aws-amplify/auth";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import "./App.css";

import Navbar from "./components/Navbar.js";
import Home from "./components/Home.js";
import Photos from "./components/photos/Photos.js";
import PhotosAdmin from "./components/PhotosAdmin.js";
import ProfileAdmin from "./components/ProfileAdmin.js";
import LogIn from "./components/auth/LogIn.js";
import Register from "./components/auth/Register.js";
import ForgotPassword from "./components/auth/ForgotPassword.js";
import ForgotPasswordVerification from "./components/auth/ForgotPasswordVerification.js";
import ChangePassword from "./components/auth/ChangePassword.js";
import ChangePasswordConfirm from "./components/auth/ChangePasswordConfirm.js";
import Welcome from "./components/auth/Welcome.js";
import Footer from "./components/Footer.js";
import VerifyAccount from "./components/auth/VerifyAccount.js";
import ResendVerification from "./components/auth/ResendVerification.js";
import { getAuthenticatedUser } from "./components/getAuthenticatedUser.js";

library.add(faEdit);

const ProtectedRoute = ({
  component: Comp,
  loggedIn,
  verified,
  path,
  ...rest
}) => {
  const wrapper = (render) => <Route path={path} {...rest} render={render} />;
  const redirect = (to, error) =>
    wrapper(() => {
      return (
        <Navigate
          to={{
            pathname: to,
            state: {
              prevLocation: path,
              error,
            },
          }}
        />
      );
    });

  if (!loggedIn) {
    return redirect("/login", "You need to login first!");
  }

  if (!verified) {
    return redirect("/verify", "You need to verify your account first!");
  }

  return wrapper((props) => <Comp {...props} />);
};

class App extends Component {
  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    isVerified: false,
    user: null,
  };

  handleLogOut = async () => {
    try {
      await signOut();
      this.setState({
        user: null,
        isAuthenticated: false,
        isAuthenticating: false,
        isVerified: false,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleLogIn = async (username, password) => {
    try {
      const user = await signIn(username, password);
      console.log(user);
      this.setState({
        user: user,
        isAuthenticated: true,
      });
    } catch (error) {
      if (error.code && error.code === "UserNotConfirmedException") {
        window.location.href = "/verify";
      }
      console.log(error.message);
    }
  };

  async componentDidMount() {
    try {
      const session = await fetchAuthSession();
      this.setState({
        isAuthenticated: true,
      });
      console.log(session);

      const user = await getAuthenticatedUser();
      this.setState({
        user,
      });

      if (user.attributes.email_verified) {
        this.setState({
          isVerified: true,
        });
      }
    } catch (error) {
      if (error !== "No current user") {
        console.log(error);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  render() {
    const authProps = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
    };
    return (
      !this.state.isAuthenticating && (
        <div className="App">
          <Router>
            <div>
              <Navbar auth={authProps} handleLogOut={this.handleLogOut} />
              <Routes>
                <Route
                  exact
                  path="/"
                  render={(props) => <Home {...props} auth={authProps} />}
                />
                {/* <Route exact path="/products" render={(props) => <Products {...props} auth={authProps} />} /> */}
                <ProtectedRoute
                  path="/photos"
                  loggedIn={this.state.isAuthenticated}
                  verified={this.state.isVerified}
                  component={Photos}
                />
                <ProtectedRoute
                  path="/admin"
                  loggedIn={this.state.isAuthenticated}
                  verified={this.state.isVerified}
                  component={PhotosAdmin}
                />
                <ProtectedRoute
                  path="/profile"
                  loggedIn={this.state.isAuthenticated}
                  verified={this.state.isVerified}
                  component={ProfileAdmin}
                />
                <Route
                  exact
                  path="/admin"
                  render={(props) => (
                    <PhotosAdmin {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/login"
                  render={(props) => (
                    <LogIn
                      {...props}
                      auth={authProps}
                      handleLogIn={this.handleLogIn}
                    />
                  )}
                />
                <Route
                  exact
                  path="/verify"
                  render={(props) => (
                    <VerifyAccount {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/resendverification"
                  render={(props) => (
                    <ResendVerification {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/register"
                  render={(props) => <Register {...props} auth={authProps} />}
                />
                <Route
                  exact
                  path="/forgotpassword"
                  render={(props) => (
                    <ForgotPassword {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/forgotpasswordverification"
                  render={(props) => (
                    <ForgotPasswordVerification {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/changepassword"
                  render={(props) => (
                    <ChangePassword {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/changepasswordconfirmation"
                  render={(props) => (
                    <ChangePasswordConfirm {...props} auth={authProps} />
                  )}
                />
                <Route
                  exact
                  path="/welcome"
                  render={(props) => <Welcome {...props} auth={authProps} />}
                />
              </Routes>
              <Footer />
            </div>
          </Router>
        </div>
      )
    );
  }
}

export default App;

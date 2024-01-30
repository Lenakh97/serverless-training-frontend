import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { signOut, signIn } from "aws-amplify/auth";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Photos from "./components/photos/Photos";
import PhotosAdmin from "./components/PhotosAdmin";
import ProfileAdmin from "./components/ProfileAdmin";
import LogIn from "./components/auth/LogIn";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ForgotPasswordVerification from "./components/auth/ForgotPasswordVerification";
import ChangePassword from "./components/auth/ChangePassword";
import ChangePasswordConfirm from "./components/auth/ChangePasswordConfirm";
import Welcome from "./components/auth/Welcome";
import Footer from "./components/Footer";
import VerifyAccount from "./components/auth/VerifyAccount";
import ResendVerification from "./components/auth/ResendVerification";
import { getAuthenticatedUser } from "./components/getAuthenticatedUser.js";

library.add(faEdit);

const ProtectedRoute = ({ children, loggedIn, verified }) => {
  if (!loggedIn) {
    return <Navigate to={"/login"} />;
  }
  if (!verified) {
    return <Navigate to={"/verify"} />;
  }
  return children;
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
      const { isSignedIn, nextStep } = await signIn({ username, password });
      console.log(isSignedIn, nextStep);
    } catch (error) {
      if (error.code && error.code === "UserNotConfirmedException") {
        window.location.href = "/verify";
      }
      console.log(error.message);
    }
  };

  async componentDidMount() {
    try {
      this.setState({
        isAuthenticated: true,
      });
      const user = await getAuthenticatedUser();
      this.setState({
        user,
      });
      if (user.session.idToken.payload.email_verified) {
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
                <Route exact path="/" element={<Home auth={authProps} />} />
                {/* <Route exact path="/products" render={(props) => <Products {...props} auth={authProps} />} /> */}
                <Route
                  path="/photos"
                  element={
                    <ProtectedRoute
                      loggedIn={this.state.isAuthenticated}
                      verified={this.state.isVerified}
                    >
                      <Photos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute
                      loggedIn={this.state.isAuthenticated}
                      verified={this.state.isVerified}
                    >
                      <PhotosAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute
                      loggedIn={this.state.isAuthenticated}
                      verified={this.state.isVerified}
                    >
                      <ProfileAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  exact
                  path="/admin"
                  element={<PhotosAdmin auth={authProps} />}
                />
                <Route
                  exact
                  path="/login"
                  element={
                    <LogIn auth={authProps} handleLogIn={this.handleLogIn} />
                  }
                />
                <Route
                  exact
                  path="/verify"
                  element={<VerifyAccount auth={authProps} />}
                />
                <Route
                  exact
                  path="/resendverification"
                  element={<ResendVerification auth={authProps} />}
                />
                <Route
                  exact
                  path="/register"
                  element={<Register auth={authProps} />}
                />
                <Route
                  exact
                  path="/forgotpassword"
                  element={<ForgotPassword auth={authProps} />}
                />
                <Route
                  exact
                  path="/forgotpasswordverification"
                  element={<ForgotPasswordVerification auth={authProps} />}
                />
                <Route
                  exact
                  path="/changepassword"
                  element={<ChangePassword auth={authProps} />}
                />
                <Route
                  exact
                  path="/changepasswordconfirmation"
                  element={<ChangePasswordConfirm auth={authProps} />}
                />
                <Route
                  exact
                  path="/welcome"
                  element={<Welcome auth={authProps} />}
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

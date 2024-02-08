import React, { useEffect, useState } from "react";
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

import { Navbar } from "./components/Navbar.js";
import { Home } from "./components/Home.js";
import { Photos } from "./components/photos/Photos.js";
import { PhotosAdmin } from "./components/PhotosAdmin.js";
import { ProfileAdmin } from "./components/ProfileAdmin.js";
import { LogIn } from "./components/auth/LogIn.js";
import { Register } from "./components/auth/Register.js";
import { ForgotPassword } from "./components/auth/ForgotPassword.js";
import { ForgotPasswordVerification } from "./components/auth/ForgotPasswordVerification.js";
import { ChangePassword } from "./components/auth/ChangePassword.js";
import ChangePasswordConfirm from "./components/auth/ChangePasswordConfirm.js";
import { Welcome } from "./components/auth/Welcome.js";
import { Footer } from "./components/Footer.js";
import { VerifyAccount } from "./components/auth/VerifyAccount.js";
import { ResendVerification } from "./components/auth/ResendVerification.js";
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

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [user, setUser] = useState<{username: string, session: any}>({username:'', session:''})

  const handleLogOut = async () => {
    try {
      await signOut();
      setUser({username: '', session:''})
      setIsAuthenticated(false)
      setIsAuthenticating(false)
      setIsVerified(false)
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const handleLogIn = async (username: string, password: string) => {
    try {
      const { isSignedIn, nextStep } = await signIn({ username, password });
      console.log(isSignedIn, nextStep);
    } catch (error) {
      if (error.code && error.code === "UserNotConfirmedException") {
        window.location.href = "/verify";
      }
      console.log((error as Error).message);
    }
  };
  useEffect(() => {
    try {
      setIsAuthenticated(true)
      const user = await getAuthenticatedUser();
      setUser(user)
      if (user.session.idToken.payload.email_verified) {
        setIsVerified(true)
      }
    } catch (error) {
      if (error !== "No current user") {
        console.log(error);
      }
    }
    setIsAuthenticating(false)
  })    

  render() {
    const authProps = {
      isAuthenticated: isAuthenticated,
      user: user,
    };
    return (
      !isAuthenticating && (
        <div className="App">
          <Router>
            <div>
              <Navbar auth={authProps} handleLogOut={handleLogOut} />
              <Routes>
                <Route path="/" element={<Home auth={authProps} />} />
                {/* <Route exact path="/products" render={(props) => <Products {...props} auth={authProps} />} /> */}
                <Route
                  path="/photos"
                  element={
                    <ProtectedRoute
                      loggedIn={isAuthenticated}
                      verified={isVerified}
                    >
                      <Photos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute
                      loggedIn={isAuthenticated}
                      verified={isVerified}
                    >
                      <PhotosAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute
                      loggedIn={isAuthenticated}
                      verified={isVerified}
                    >
                      <ProfileAdmin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={<PhotosAdmin auth={authProps} />}
                />
                <Route
                  path="/login"
                  element={
                    <LogIn auth={authProps} handleLogIn={handleLogIn} />
                  }
                />
                <Route
                  path="/verify"
                  element={<VerifyAccount auth={authProps} />}
                />
                <Route
                  path="/resendverification"
                  element={<ResendVerification auth={authProps} />}
                />
                <Route
                  path="/register"
                  element={<Register auth={authProps} />}
                />
                <Route
                  path="/forgotpassword"
                  element={<ForgotPassword auth={authProps} />}
                />
                <Route
                  path="/forgotpasswordverification"
                  element={<ForgotPasswordVerification auth={authProps} />}
                />
                <Route
                  path="/changepassword"
                  element={<ChangePassword auth={authProps} />}
                />
                <Route
                  path="/changepasswordconfirmation"
                  element={<ChangePasswordConfirm auth={authProps} />}
                />
                <Route path="/welcome" element={<Welcome auth={authProps} />} />
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

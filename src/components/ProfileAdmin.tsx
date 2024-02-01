import { fetchAuthSession } from "aws-amplify/auth";
import React, { useState, useEffect, Fragment } from "react";

export const ProfileAdmin = () => {
  const [email, setEmail] = useState<string>("");
  const [cognitoID, setCognitoID] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    fetchAuthSession().then((response): void => {
      setEmail(response.tokens.idToken.payload.email);
      setCognitoID(response.identityId ?? "");
      setUsername(response.tokens.accessToken.payload.username ?? "");
      setLoading(false);
    });
  });

  return (
    <Fragment>
      <section className="section">
        <div className="container">
          <h1>Profile Admin</h1>
          <p className="subtitle is-5">Manage your user profile below:</p>
          <br />
          <div className="columns">
            <div className="column is-one-third">
              <form action="/ChangePassword">
                <input type="submit" value="Change Password" />
              </form>
              <br />
              {loading ? (
                <span>Loading... </span>
              ) : (
                <span>
                  <h2>
                    <strong>Username:</strong> {username}
                  </h2>
                  <h2>
                    <strong>Email Address:</strong> {email}
                  </h2>
                  <h2>
                    <strong>Cognito ID: </strong> {cognitoID}
                  </h2>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

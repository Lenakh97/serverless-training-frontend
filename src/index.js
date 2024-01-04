import React from "react";
import ReactDOM from "react-dom";
import "bulma/css/bulma.min.css";
import "react-image-gallery/styles/css/image-gallery.css";
import "./index.css";
import App from "./App";
import Amplify, { Auth } from "aws-amplify";
import * as serviceWorker from "./serviceWorker";
import { fromEnv } from "@nordicsemiconductor/from-env";

const { region, userPoolId, userPoolWebClientId, identityPoolId, bucket } =
  fromEnv({
    region: "REGION",
    userPoolId: "USER_POOL_ID",
    userPoolWebClientId: "APP_CLIENT_ID",
    identityPoolId: "IDENTITY_POOL_ID",
    bucket: "BUCKET",
    invokeUrl: "INVOKEURL",
  });

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: region,
    userPoolId: userPoolId,
    userPoolWebClientId: userPoolWebClientId,
    identityPoolId: identityPoolId,
  },
  Storage: {
    region: region,
    bucket: bucket,
  },
  API: {
    endpoints: [
      {
        name: "imageAPI",
        endpoint: invokeUrl,
        path: "/images",
        custom_header: async () => {
          //   return { Authorization : 'token' }
          //   // Alternatively, with Cognito User Pools use this:
          //   // return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
          // return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
          return {
            Authorization: `Bearer ${(await Auth.currentSession())
              .getIdToken()
              .getJwtToken()}`,
          };
        },
      },
    ],
  },
});

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

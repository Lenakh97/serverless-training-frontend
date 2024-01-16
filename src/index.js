import React from "react";
import "bulma/css/bulma.min.css";
import "react-image-gallery/styles/css/image-gallery.css";
import "./index.css";
import App from "./App";
import { Amplify } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import config from "./config";
import * as serviceWorker from "./serviceWorker";
import { createRoot } from "react-dom/client";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
  },
  Storage: {
    region: config.cognito.REGION,
    bucket: config.s3.bucket,
  },
  API: {
    endpoints: [
      {
        name: "imageAPI",
        endpoint: config.api.invokeUrl,
        path: "/images",
        custom_header: async () => {
          //   return { Authorization : 'token' }
          //   // Alternatively, with Cognito User Pools use this:
          //   // return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
          // return { Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}` }
          return {
            Authorization: `Bearer ${(await fetchAuthSession())
              .getIdToken()
              .getJwtToken()}`,
          };
        },
      },
    ],
  },
});
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

//ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

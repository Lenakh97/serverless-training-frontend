import React from "react";
import "bulma/css/bulma.min.css";
import "react-image-gallery/styles/css/image-gallery.css";
import "./index.css";
import App from "./App";
import { Amplify } from "aws-amplify";
import config from "./config";
import * as serviceWorker from "./serviceWorker";
import { createRoot } from "react-dom/client";

Amplify.configure({
  Auth: {
    Cognito: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
    },
  },
  Storage: {
    S3: {
      bucket: config.s3.bucket,
      region: config.cognito.REGION,
    },
  },
  API: {
    REST: {
      imageAPI: {
        endpoint: config.api.invokeUrl,
      },
    },
  },
});

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

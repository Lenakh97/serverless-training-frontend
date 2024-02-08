import React from "react";

export const FormErrors = (props: {
  formerrors: {
    blankfield: boolean;
    passwordmatch?: boolean;
    cognito: {
      message:
        | string
        | number
        | boolean
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | Iterable<React.ReactNode>
        | React.ReactPortal
        | null
        | undefined;
    } | null;
  };
  apierrors?:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
}) => {
  if (
    props.formerrors &&
    (props.formerrors.blankfield || props.formerrors.passwordmatch)
  ) {
    return (
      <div className="error container help is-danger">
        <div className="row justify-content-center">
          {props.formerrors.passwordmatch
            ? "Password value does not match confirm password value"
            : ""}
        </div>
        <div className="row justify-content-center help is-danger">
          {props.formerrors.blankfield ? "All fields are required" : ""}
        </div>
      </div>
    );
  } else if (props.apierrors) {
    return (
      <div className="error container help is-danger">
        <div className="row justify-content-center">{props.apierrors}</div>
      </div>
    );
  } else if (props.formerrors && props.formerrors.cognito) {
    return (
      <div className="error container help is-danger">
        <div className="row justify-content-center">
          {props.formerrors.cognito.message}
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

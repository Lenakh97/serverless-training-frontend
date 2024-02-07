import type { cognitoType } from "components/auth/ForgotPassword";

export const validateForm = (
  event: {
    preventDefault: () => void;
  },
  state: {
    oldpassword?: string;
    newpassword?: string;
    confirmpassword?: string;
    errors?: {
      cognito: cognitoType;
      blankfield: boolean;
      passwordmatch?: boolean;
    };

    email?: string;
    verificationcode?: string;
    username?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
  }
): { blankfield: boolean } | { passwordmatch: boolean } => {
  // clear all error messages
  const inputs = document.getElementsByClassName("is-danger");

  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].classList.contains("error")) {
      inputs[i].classList.remove("is-danger");
    }
  }

  // Field contains a value
  if (state.username && state.username.trim() === "") {
    const id = document.getElementById("username");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    return { blankfield: true };
  }
  if (state.firstname && state.firstname.trim() === "") {
    const id = document.getElementById("firstname");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    return { blankfield: true };
  }
  if (state.lastname && state.lastname.trim() === "") {
    const id = document.getElementById("lastname");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    return { blankfield: true };
  }
  if (state.email && state.email.trim() === "") {
    const id = document.getElementById("email");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    return { blankfield: true };
  }
  if (state.verificationcode && state.verificationcode.trim() === "") {
    const id = document.getElementById("verificationcode");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    return { blankfield: true };
  }
  if (state.password && state.password.trim() === "") {
    const id = document.getElementById("password");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    return { blankfield: true };
  }
  if (state.oldpassword && state.oldpassword.trim() === "") {
    const id = document.getElementById("oldpassword");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    return { blankfield: true };
  }
  if (state.newpassword && state.newpassword.trim() === "") {
    const id = document.getElementById("newpassword");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    return { blankfield: true };
  }
  if (state.confirmpassword && state.confirmpassword.trim() === "") {
    const id = document.getElementById("confirmpassword");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    return { blankfield: true };
  }
  if (
    state.password &&
    state.confirmpassword &&
    state.password !== state.confirmpassword
  ) {
    const id = document.getElementById("password");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    const confirmId = document.getElementById("confirmpassword");
    if (confirmId !== null) {
      confirmId.classList.add("is-danger");
    }
    return { passwordmatch: true };
  }
  if (
    state.newpassword &&
    state.confirmpassword &&
    state.newpassword !== state.confirmpassword
  ) {
    const id = document.getElementById("newpassword");
    if (id !== null) {
      id.classList.add("is-danger");
    }
    const confirmId = document.getElementById("confirmpassword");
    if (confirmId !== null) {
      confirmId.classList.add("is-danger");
    }
    return { passwordmatch: true };
  }
  return;
};

export default validateForm;

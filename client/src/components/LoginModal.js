import React from "react";
import ReactModalLogin from "react-modal-login";
import "../style/Dashboard.css";
import Cookies from 'js-cookie';

const facebookConfig = {
  appId: "1408167076108",
  cookie: true,
  xfbml: true,
  version: "v3.2",
  scope: "email",
};

const googleConfig = {
  client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com",
  scope: "profile email",
};

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      loading: false,
      error: null,
    };
  }

  onLogin() {
    console.log("__onLogin__");
    console.log("username: " + document.querySelector("#username").value);
    console.log("password: " + document.querySelector("#password").value);

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    if (!username || !password) {
      this.setState({
        error: true,
      });
    } else {
      fetch(`http://localhost:8081/login/${username}` , {
      method: "GET",
    })
      .then(
        (res) => {
          return res.json();
        },
        (err) => {
          console.log(err);
        }
      )
      .then(
        (res) => {
          console.log('password match', res.rows[0][0] === password);

          if (res.rows[0].length > 0 && res.rows[0][0] === password) {
            this.onLoginSuccess("form");
            this.closeModal();

            this.props.onLoginAttemptSuccess(username);
            Cookies.set('username', username);
          } else {
            this.onLoginFail("form", "could not find user");
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  onRegister() {
    console.log("__onRegister__");
    console.log("username: " + document.querySelector("#username").value);
    console.log("password: " + document.querySelector("#password").value);

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    fetch(`http://localhost:8081/register/${username}/${password}` , {
      method: "POST",
    })
      .then(
        (res) => {
          if (res.status === 201) {
            console.log('registration success');
            this.onLoginSuccess("form");
            this.closeModal();
  
            this.props.onLoginAttemptSuccess(username);
            Cookies.set('username', username);
          } else {
            this.setState({
              error: 'Registration failed',
              loading: false,
            });
          }
        },
        (err) => {
          console.log('register failed');
          console.log(err);
        }
      );
  }

  onRecoverPassword() {
    console.log("__onFotgottenPassword__");
  }

  openModal() {
    this.setState({
      showModal: true,
    });
  }

  closeModal() {
    this.setState({
      showModal: false,
      error: null,
    });
  }

  onLoginSuccess(method, response) {
    console.log("logged successfully with " + method);
  }

  onLoginFail(method, response) {
    console.log("logging failed with " + method);
    this.setState({
      error: response,
      loading: false,
    });
  }

  startLoading() {
    this.setState({
      loading: true,
    });
  }

  finishLoading() {
    this.setState({
      loading: false,
    });
  }

  afterTabsChange() {
    this.setState({
      error: null,
    });
  }

  render() {
    return (
      <div>
        <button className="btn-1" onClick={() => this.openModal()}>
          Login / Register
        </button>

        <ReactModalLogin
          visible={this.state.showModal}
          onCloseModal={this.closeModal.bind(this)}
          loading={this.state.loading}
          error={this.state.error}
          tabs={{
            afterChange: this.afterTabsChange.bind(this),
          }}
          form={{
            onLogin: this.onLogin.bind(this),
            onRegister: this.onRegister.bind(this),
            onRecoverPassword: this.onRecoverPassword.bind(this),

            recoverPasswordSuccessLabel: this.state.recoverPasswordSuccess
              ? {
                  label: "New password has been sent to your mailbox!",
                }
              : null,
            recoverPasswordAnchor: {
              label: "Forgot your password?",
            },
            loginBtn: {
              label: "Sign in",
            },
            registerBtn: {
              label: "Sign up",
            },
            recoverPasswordBtn: {
              label: "Send new password",
            },
            loginInputs: [
              {
                containerClass: "RML-form-group",
                label: "Username",
                type: "text",
                inputClass: "RML-form-control",
                id: "username",
                name: "username",
                placeholder: "Username",
              },
              {
                containerClass: "RML-form-group",
                label: "Password",
                type: "password",
                inputClass: "RML-form-control",
                id: "password",
                name: "password",
                placeholder: "Password",
              },
            ],
            registerInputs: [
              {
                containerClass: "RML-form-group",
                label: "Username",
                type: "text",
                inputClass: "RML-form-control",
                id: "username",
                name: "username",
                placeholder: "Username",
              },
              {
                containerClass: "RML-form-group",
                label: "Password",
                type: "password",
                inputClass: "RML-form-control",
                id: "password",
                name: "password",
                placeholder: "Password",
              },
            ],
            recoverPasswordInputs: [
              {
                containerClass: "RML-form-group",
                label: "Email",
                type: "email",
                inputClass: "RML-form-control",
                id: "email",
                name: "email",
                placeholder: "Email",
              },
            ],
          }}
          separator={{
            label: "or",
          }}
          loginError={{
            label: "Couldn't sign in, please try again.",
          }}
          registerError={{
            label: "Couldn't sign up, please try again.",
          }}
          startLoading={this.startLoading.bind(this)}
          finishLoading={this.finishLoading.bind(this)}
          providers={{
            facebook: {
              config: facebookConfig,
              onLoginSuccess: this.onLoginSuccess.bind(this),
              onLoginFail: this.onLoginFail.bind(this),
              label: "Continue with Facebook",
            },
            google: {
              config: googleConfig,
              onLoginSuccess: this.onLoginSuccess.bind(this),
              onLoginFail: this.onLoginFail.bind(this),
              label: "Continue with Google",
            },
          }}
        />
      </div>
    );
  }
}

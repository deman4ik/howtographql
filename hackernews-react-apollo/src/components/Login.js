import React, { Component } from "react";
import PropTypes from "prop-types";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import { AUTH_TOKEN } from "../constants";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      login: true, // switch between Login and SignUp
      email: "",
      password: "",
      name: ""
    };
  }
  async confirm() {
    const { name, email, password } = this.state;
    if (this.state.login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password
        }
      });
      const { token } = result.data.login;
      this.saveUserData(token);
    } else {
      const result = await this.props.signupMutation({
        variables: {
          name,
          email,
          password
        }
      });
      const { token } = result.data.signup;
      this.saveUserData(token);
    }
    this.props.history.push("/");
  }

  saveUserData(token) {
    localStorage.setItem(AUTH_TOKEN, token);
  }

  render() {
    return (
      <div>
        <h4 className="mv3">{this.state.login ? "Login" : "Sign Up"}</h4>
        <div className="flex flex-column">
          {!this.state.login && (
            <input
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <button className="pointer mr2 button" onClick={() => this.confirm()}>
            {this.state.login ? "login" : "create account"}
          </button>
          <button
            className="pointer button"
            onClick={() => this.setState({ login: !this.state.login })}
          >
            {this.state.login
              ? "need to create an account?"
              : "already have an account?"}
          </button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  loginMutation: PropTypes.func.isRequired,
  signupMutation: PropTypes.func.isRequired
};

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;
const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export default compose(
  graphql(SIGNUP_MUTATION, { name: "signupMutation" }),
  graphql(LOGIN_MUTATION, { name: "loginMutation" })
)(Login);

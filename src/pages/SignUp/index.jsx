import { useEffect, useState } from "react";

import axios from "axios";
import { signUp } from "./api";
import { Input } from "./components/input";

export function SignUp() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordRepeat, setPasswordRepeat] = useState();
  const [apiProgress, setApiProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState();
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState();

  useEffect(() => {
    setErrors(function(lastErrors){ //call-back fonksiyon verip hatayi sirayla cancelladik
      return {
        ...lastErrors, //kopyasini olusturup
        username: undefined //spesifik olarak istedigimiz ile oynadik sadece
      }
    });
  }, [username])

  useEffect(() => {
    setErrors(function(lastErrors){
      return {
        ...lastErrors,
        email: undefined
      }
    });
  }, [email])

  const onSubmit = async (event) => {
    event.preventDefault(); // to prevent default, to prevent unneccesarry second one
    setSuccessMessage();
    setGeneralError();
    setApiProgress(true);

    try {
      const response = await signUp({
        username,
        email,
        password,
      });
      setSuccessMessage(response.data.message);
    } catch (axiosError) {
      if (
        axiosError.response?.data &&
        axiosError.response.data.status === 400
      ) {
        setErrors(axiosError.response.data.validationErrors);
      } else{
        setGeneralError("unexpected error just emerge pls try again")
      }
    } finally {
      setApiProgress(false);
    }
  };

  let passwordRepeatError = '';
  if(password !== passwordRepeat){
    passwordRepeatError = 'Password mis-match soz konusu';
  }

  return (
    <div className="container">
      <div className="col-lg-6 offset-lg-3">
        <form className="card" onSubmit={onSubmit}>
          <div className="text-center card-header">
            <h1>Sign Up</h1>
          </div>
          <div className="card-body">
            <Input id="username" label="Username" error={errors.username} onChange={(event) => setUsername(event.target.value)}/>
            <Input id="email" label="E-mail" error={errors.email} onChange={(event) => setEmail(event.target.value)} />

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                className="form-control"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                style={{ border: "4px solid #ccc", padding: "10px" }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="passwordRepeat" className="form-label">
                Password Repeat
              </label>
              <input
                id="passwordRepeat"
                className="form-control"
                type="password"
                onChange={(event) => setPasswordRepeat(event.target.value)}
                style={{ border: "4px solid #ccc", padding: "10px" }}
              />
            </div>
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
            {generalError && (
              <div className="alert alert-danger">{generalError}</div>
            )}
            <div className="text-center">
              <button
                className="btn btn-primary"
                disabled={
                  apiProgress || !password || password !== passwordRepeat
                }
              >
                {apiProgress && (
                  <span
                    className="spinner-border spinner-border-sm"
                    aria-hidden="true"
                  ></span>
                )}
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

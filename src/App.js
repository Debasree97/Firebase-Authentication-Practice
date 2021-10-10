import "./App.css";
import initializeAuthentication from "./firebase/firebase.init";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";

initializeAuthentication();

const googleProvider = new GoogleAuthProvider();

function App() {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogIn, setIsLogIn] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider).then((result) => {
      const user = result.user;
      console.log(user);
    });
  };

  const handleEmailField = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordField = (e) => {
    setPassword(e.target.value);
  };

  const toggoleLogIn = (e) => {
    setIsLogIn(e.target.checked);
  };

  const userLogIn = (password, email) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        // const user = result.user;
        setError("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const createNewUser = (password, email) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        // const user = result.user;
        setError("");
        verifyEmail();
        setName();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const setName = () => {
    updateProfile(auth.currentUser, {
      displayName: userName
    })
      .then(() => {
        // Profile updated!
        // ...
      })
      .catch((error) => {
        // An error occurred
        // ...
      });

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be 6 characters long");
      return;
    } else
      isLogIn ? userLogIn(password, email) : createNewUser(email, password);
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      // Email verification sent!
      // ...
    });
  };

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        setError(error.message);
        // ..
      });
  };

  const handleUserName = (e) => {
    setUserName(e.target.value);
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <h2>{isLogIn ? "Log In" : "Register"} With Email</h2>
          <br />
          {!isLogIn && (
            <div className="col">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="First name"
                aria-label="First name"
                onBlur={handleUserName}
              />
            </div>
          )}
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            onBlur={handleEmailField}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            onBlur={handlePasswordField}
            required
          />
          <button
            onClick={handleResetPassword}
            className="mt-3 btn btn-secondary"
          >
            Reset Password
          </button>
        </div>
        <div className="text-danger">{error}</div>
        <div className="mb-3 form-check">
          <input
            onChange={toggoleLogIn}
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Already Registered?
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          {isLogIn ? "Log In" : "Register"}
        </button>
      </form>
      <hr />
      <h2> Sign Up with Google</h2>
      <br />
      <button
        onClick={handleGoogleSignIn}
        type="submit"
        className="btn btn-primary"
      >
        Sign Up
      </button>
    </div>
  );
}
export default App;

import React, { useState, useContext } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const navigate = useNavigate();

  const { axios, setToken, setAuthUser, login } = useContext(AuthContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (currentState == "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    } else {
      login(currentState === "Sign Up" ? "signup" : "login", {
        fullName,
        email,
        password,
        bio,
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center 
    justify-center gap-24 sm:justify-evenly max-sm:flex-col 
    backdrop-blue-2xl"
    >
      {/** left  */}
      <img className="w-[min(30vw,250px)]" src={assets.logo_big} alt="" />
      {/** Right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              onClick={() => {
                setIsDataSubmitted(false);
              }}
              className="w-5 cursor-pointer"
              src={assets.arrow_icon}
              alt=""
            />
          )}
        </h2>
        {currentState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md 
            focus:outline-none "
            placeholder="Full Name"
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              type="text"
              className="p-2 border border-gray-500 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email"
              required
            />
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              type="password"
              className="p-2 border border-gray-500 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              required
            />
          </>
        )}
        {currentState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(e) => {
              setBio(e.target.value);
            }}
            rows={4}
            value={bio}
            placeholder="Provide a short bio"
            required
            className="p-2 border border-gray-500 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}
        <button
          className="py-3 bg-gradient-to-r from-purple-400 
        to-violet-600 text-white rounded-md cursor-pointer"
          type="submit"
        >
          {currentState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-gray-600">
              Already have an Account{" "}
              <span
                onClick={() => {
                  setCurrentState("Log In");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an Account{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign Up");
                }}
                className="font-medium text-violet-500 cursor-pointer"
              >
                Sign Up Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

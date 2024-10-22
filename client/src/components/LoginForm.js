import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="form-container">
      <h2>Login</h2>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm, setErrors }) => {
          fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              username: values.username,
              password: values.password,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                setErrors({ username: "Invalid username or password." });
              } else {
                alert("Login successful");
                onLogin(data.role); // Pass the user role to the onLogin function
                resetForm();
                navigate("/");
              }
            })
            .catch((error) => {
              console.error("There was an error!", error);
              setErrors({ username: "An error occurred. Please try again." });
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <Field id="username" type="text" name="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <Field id="password" type="password" name="password" />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;

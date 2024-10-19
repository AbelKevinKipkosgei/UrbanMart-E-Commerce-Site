import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./SignUpForm.css"; // Import the CSS

// Validation schema
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Username must be at least 4 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  bio: Yup.string() // Optional bio validation
    .max(100, "Bio cannot exceed 100 characters"), // You can set a limit
});

const SignUpForm = () => {
  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <Formik
        initialValues={{
          username: "",
          password: "",
          password_confirmation: "",
          bio: "", // Initial value for bio
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          fetch("/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: values.username,
              password: values.password,
              password_confirmation: values.password_confirmation,
              bio: values.bio,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                alert(data.error.message || data.error);
              } else {
                alert("User registered successfully");
                // Clear the form fields after successful sign-up
                resetForm({
                  values: {
                    username: "",
                    password: "",
                    password_confirmation: "",
                    bio: "",
                  },
                });
              }
            })
            .catch((error) => {
              console.error("There was an error!", error);
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <Field type="text" name="username" autoComplete="username"/>
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <Field type="password" name="password" autoComplete="new-password"/>
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <div className="form-field">
              <label htmlFor="password_confirmation">Confirm Password</label>
              <Field type="password" name="password_confirmation" autoComplete="new-password"/>
              <ErrorMessage
                name="password_confirmation"
                component="div"
                className="error"
              />
            </div>
            <div className="form-field">
              <label htmlFor="bio">Bio</label>
              <Field as="textarea" name="bio" rows="4" />
              <ErrorMessage name="bio" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>
              Sign Up
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUpForm;

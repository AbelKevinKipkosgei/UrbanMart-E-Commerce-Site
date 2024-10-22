import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./SignUpForm.css";

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
  bio: Yup.string()
    .max(100, "Bio cannot exceed 100 characters")
    .required("Bio is required"),
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
          bio: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm, setFieldError }) => {
          fetch("/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(values),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.error) {
                // Check for field-specific errors and set them using setFieldError
                Object.keys(data.error).forEach((field) => {
                  setFieldError(field, data.error[field]);
                });
              } else {
                alert("User registered successfully");
                resetForm();
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
              <Field type="text" name="username" autoComplete="username" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                autoComplete="new-password"
              />
              <ErrorMessage name="password" component="div" className="error" />
            </div>
            <div className="form-field">
              <label htmlFor="password_confirmation">Confirm Password</label>
              <Field
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
              />
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

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/authSlice";
import { AuthDispatch, RootState } from "../../redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./LoginForm.css";

const LoginForm: React.FC = () => {
  const authError = useSelector((state: RootState) => state.auth.error);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AuthDispatch>();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await dispatch(
          login({ username: values.username, password: values.password })
        );
        formik.resetForm();
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else if (
          error &&
          (error as any).response &&
          (error as any).response.status === 401
        ) {
          setError(
            "Invalid credentials. Please check your username and password."
          );
        } else if (
          error &&
          (error as any).response &&
          (error as any).response.status === 500
        ) {
          setError("Server error. Please try again later.");
        } else {
          setError("An error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    checkError();
  }, [authError]);

  const checkError = () => {
    if (authError) {
      setError("" + authError);
    }
  };
  const clearError = () => {
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    clearError();
  };

  return (
    <div className="wrapper">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formik.values.username}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="error">{formik.errors.username}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={handleInputChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="error">{formik.errors.password}</p>
            )}
          </div>
          {error && <p className="error">{error}</p>}
          <div className="form-group">
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

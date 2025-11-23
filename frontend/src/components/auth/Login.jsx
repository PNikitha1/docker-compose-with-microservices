
// src/pages/Login.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectUserLoading, selectUserError } from "../../store/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

const schema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min 6 chars").required("Required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  return (
    <div className="auth-container">
      <h2>Owner Login</h2>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await dispatch(loginUser(values)).unwrap();
            navigate("/dashboard");
          } catch (e) {
            console.error("Login error:", e);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="auth-form">
            <label>Email</label>
            <Field name="email" type="email" placeholder="owner@example.com" />
            <ErrorMessage name="email" component="div" className="error" />

            <label>Password</label>
            <Field name="password" type="password" placeholder="••••••••" />
            <ErrorMessage name="password" component="div" className="error" />

            <button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? "Logging in..." : "Login"}
            </button>

            {error ? <div className="error">{error}</div> : null}

            <div className="auth-foot">
              <span>
                New here? <Link to="/register">Create an account</Link>
              </span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

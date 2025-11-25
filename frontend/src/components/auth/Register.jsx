
// src/pages/Register.jsx
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // <-- lowercase
import { useDispatch, useSelector } from "react-redux";
import { registerUser, selectUserLoading, selectUserError } from "../../store/auth/authSlice"; // <-- fixed path
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

const schema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Invalid phone")
    .required("Required"),
  password: Yup.string().min(6, "Min 6 chars").required("Required"),
});

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);

  return (
    <div className="auth-container">
      <h2>Owner Registration</h2>

      <Formik
        initialValues={{ name: "", email: "", phone: "", password: "" }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const res = await dispatch(registerUser(values)).unwrap();
            if (res?.token) navigate("/dashboard");
            else navigate("/login");
          } catch (e) {
            console.error("Register error:", e);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="auth-form">
            <label>Name</label>
            <Field name="name" placeholder="Owner full name" />
            <ErrorMessage name="name" component="div" className="error" />

            <label>Email</label>
            <Field name="email" type="email" placeholder="owner@example.com" />
            <ErrorMessage name="email" component="div" className="error" />

            <label>Phone</label>
            <Field name="phone" placeholder="9XXXXXXXXX" />
            <ErrorMessage name="phone" component="div" className="error" />

            <label>Password</label>
            <Field name="password" type="password" placeholder="••••••••" />
            <ErrorMessage name="password" component="div" className="error" />

            <button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? "Creating..." : "Register"}
            </button>

            {error ? <div className="error">{error}</div> : null}

            <div className="auth-foot">
              <span>
                Already have an account? <Link to="/login">Login</Link>
              </span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

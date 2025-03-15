import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { User, Mail } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AuthLayout from "../components/layout/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import AuthImagePattern from "../components/auth/AuthImagePattern";
import PasswordInput from "../components/auth/AuthPasswordInput";
import Button from "../components/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const { signUp, isSigningUp } = useAuthStore();

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };
  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) {
      formData.passwordConfirm = formData.password;
      signUp(formData).then(() => {
        navigate("/"); // ✅ Correct way to navigate
      });
    }
  };

  return (
    <AuthLayout
      leftSide={
        <>
          <AuthHeader
            title="Create Account"
            subtitle="Get started with your free account"
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange("name")}
            />

            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange("email")}
            />

            <PasswordInput
              value={formData.password}
              onChange={handleChange("password")}
            />

            <Button type="submit" isLoading={isSigningUp}>
              Create Account
            </Button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </>
      }
      rightSide={
        <>
          <AuthImagePattern
            title="Join our community"
            subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
          />
        </>
      }
    ></AuthLayout>
  );
};

export default SignUpPage;

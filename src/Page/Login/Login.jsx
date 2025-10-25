import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnim from "../../assets/Signup.json";
import useAuth from "../../Hook/useAuth";



const Login = () => {
    const { signIn } = useAuth();

    const [icon, setIcon] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // ✅ React Hook Form Setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    // ✅ Submit Function
    const onSubmit = (data) => {
        console.log("Form Data:", data);

        signIn(data.email, data.password)
            .then(() => {
                reset();
                navigate("/Dashboard");
            })
            .catch(() => setError("Invalid email or password"));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            {/* Main Card */}
            <div className="relative flex flex-col lg:flex-row items-center gap-10 bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/30 max-w-6xl w-11/12 mx-auto">

                {/* Left Section */}
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold  mb-4">
                        Welcome Back!
                    </h1>
                    <p className="text-sm md:text-lg  mb-6">
                        Enter your credentials to access your account.
                    </p>
                    <div className="w-60 sm:w-80 mx-auto lg:mx-0">
                        <Lottie animationData={loginAnim} loop={true} />
                    </div>
                </div>

                {/* Right Section (Form) */}
                <div className="flex-1 w-full max-w-md bg-white/30 backdrop-blur-lg p-6 md:p-8 rounded-xl shadow-lg border border-white/40">
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* Email */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-1 ">
                                Email
                            </label>
                            <input
                                {...register("email", {
                                    required: "Email is required",
                                })}
                                type="email"
                                placeholder="Enter your email"
                                className={`w-full px-4 py-3 rounded-lg text-black bg-white focus:outline-none focus:ring-2 transition-all duration-300 ${errors.email
                                    ? "border-red-400 focus:ring-red-500 border"
                                    : "border-transparent focus:ring-indigo-400"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-5 relative">
                            <label className="block text-sm font-medium mb-1 ">
                                Password
                            </label>
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                                type={icon ? "text" : "password"}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-3 rounded-lg text-black bg-white focus:outline-none focus:ring-2 transition-all duration-300 ${errors.password
                                    ? "border-red-400 focus:ring-red-500 border"
                                    : "border-transparent focus:ring-indigo-400"
                                    }`}
                            />
                            <span
                                className="absolute right-4 top-10 text-xl cursor-pointer text-gray-700"
                                onClick={() => setIcon(!icon)}
                            >
                                {icon ? <IoMdEye /> : <IoMdEyeOff />}
                            </span>
                            {errors.password && (
                                <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-700 text-sm mb-3 text-center">{error}</p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700  font-semibold py-3 rounded-lg transition duration-300 shadow-lg"
                        >
                            Login
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

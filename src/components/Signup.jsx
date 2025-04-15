import React, { useCallback, useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice.js'
import { Button, Input, Logo } from './index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
// import { setUsername } from '../store/authSlice.js'
import emailjs from '@emailjs/browser';

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()





    const create = async (data) => {    // In data it automatacly get the input filds (name password ,email) with the help of 'const {register, handleSubmit} = useForm()'
        setError("");
        try {
            // create account + login
            await authService.createAccount(data);
            //   console.log( "data->" ,data.email)
            

            // wait for session to be properly set
            const user = await authService.getCurrentUser();

            if (user) {
                dispatch(login(user));


                const { email, name, password } = data;
                // dispatch(setUsername(name));
                await emailjs
                    .send(
                        "service_i0t9bpv", // your EmailJS service ID
                        "template_s8ef4y8", // your template ID
                        { email, password, name }, // template parameters
                        "QMKFTu5x_NXNlkHVQ" // your public key
                    )
                    .then(
                        (response) => {
                            alert("Signup successful 🎉. Check your email!");
                        },
                        (error) => {
                            alert("Failed to send email. Try again later.");
                            console.error("EmailJS error:", error);
                        }
                    );




                // sendPasswordToEmail()
                window.location.reload()
                navigate("/");
            } else {
                setError("Session not established. Please try logging in again.");
            }
        } catch (error) {
            console.log("Signup error:", error);
            setError(error.message);
        }
    };



    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Signup
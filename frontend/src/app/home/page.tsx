"use client";

import Link from "next/link";
import {getCurrentUser, loginAccount} from "@/src/helper/api";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import Message from "@/src/components/Message";

type LoginRequest = {
    email: string
    password: string
}

type LoginResponse = LoginSuccess | LoginFailure

type LoginSuccess = {
    success: true,
    access_token: string
}

type LoginFailure = {
    success: false,
    message: string
}

export default function Home() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [messageType, setMessageType] = useState("success")
    const [message, setMessage] = useState("")

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) {
                router.push("/dashboard")
            }
        })

        if (searchParams.get("status") === "registration-successful") {
            setMessageType("success")
            setMessage("Successfully registered an account")
        }
    }, [])

    const handleFormSubmission = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page refresh

        const formData = new FormData(event.target);

        const request: LoginRequest = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        }

        console.log(request.email)

        const response: LoginResponse = await loginAccount(request);

        console.log(response)

        if (response.success) {
            router.push("/dashboard")
        } else if (response.message) {
            setMessageType("error")
            setMessage(response.message);
        }
    }

    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <h1 className="text-xl underline">Login</h1>
            <form className="flex flex-col items-center" onSubmit={handleFormSubmission}>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="email">E-mail:</label>
                    <input name="email" id="email" type="text"/>
                </div>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="password">Password:</label>
                    <input name="password" id="password" type="password"/>
                </div>
                <input type="submit" value="Login"/>
            </form>
            <Link className="text-sm" href="/register">If you don't already have an account, you can register
                here!</Link>
            <Message type={messageType} message={message}/>
        </div>
    );
}

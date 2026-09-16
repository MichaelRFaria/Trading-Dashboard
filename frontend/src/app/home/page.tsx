"use client";

import Link from "next/link";
import {getCurrentUser, loginAccount} from "@/src/helper/api";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect} from "react";
import {LoginRequest, LoginResponse} from "@/src/types/account";
import {useNotification} from "@/src/components/common/NotificationProvider";

export default function HomePage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const {showNotification} = useNotification()

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) {
                router.push("/dashboard")
            }
        })

        if (searchParams.get("status") === "registration-successful") {
            showNotification("Successfully registered an account")
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

        const response: LoginResponse | null = await loginAccount(request);

        if (response === null) {
            console.error("login response is null, something went wrong")
            return
        }

        console.log(response)

        if (response.success) {
            router.push("/dashboard")
        } else if (response.message) {
            showNotification(response.message)
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
        </div>
    );
}

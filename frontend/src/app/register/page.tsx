"use client";

import {registerAccount} from "@/src/app/_helper/api";
import {useState} from "react";
import {useRouter} from "next/navigation";

type RegisterRequest = {
    email: string
    password: string
}

type RegisterResponse = {
    success: string,
    message?: string,
}

export default function Home() {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState("");

    const handleFormSubmission = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page refresh todo does not work

        const formData = new FormData(event.target);

        const request: RegisterRequest = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        }

        const response: RegisterResponse = await registerAccount(request);

        if (response.success) {
            //router.push("/dashboard")
        } else if (response.message) {
            setErrorMessage(response.message);
        }
    }

    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <h1 className="text-xl underline">Register</h1>
            <form className="flex flex-col items-center" onSubmit={handleFormSubmission}>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="email">E-mail:</label>
                    <input name="email" id="email" type="text"/>
                </div>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="password">Password:</label>
                    <input name="password" id="password" type="password"/>
                </div>
                <input type="submit" value="Register"/>
            </form>
            <p className="text-red-600">{errorMessage}</p>
        </div>
    );
}

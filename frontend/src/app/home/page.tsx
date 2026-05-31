import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <h1 className="text-xl underline">Login</h1>
            <form className="flex flex-col items-center">
                <div className="flex justify-between min-w-full">
                    <label htmlFor="email">E-mail:</label>
                    <input name="email" id="email" type="text"/>
                </div>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="password">Password:</label>
                    <input name="password" id="password" type="password"/>
                </div>
                <input type="submit" value="Submit"/>
            </form>
            <Link className="text-sm" href="/register">If you don't already have an account, you can register
                here!</Link>
        </div>
    );
}

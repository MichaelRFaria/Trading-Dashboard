import {NavbarLink} from "@/src/types/misc";
import Link from "next/link";
import React, {useEffect} from "react";

export default function Navbar({navbarLinks}: { navbarLinks: NavbarLink[] }) {
    useEffect(() => {
        console.log(navbarLinks)
    }, []);

    return (
        <div className="fixed w-full h-10 top-0 opactity-90 bg-gray">
            <ul className="list-none m-0 p-0 bg-[#23272d] flex justify-center flex-wrap text-left">
                {navbarLinks.map((link) => {
                    return (
                        <li className="text-white px-2 py-3 no-underline">
                            <Link className="flex justify-center flex-wrap text-base color-black cursor-pointer"
                                  href={link.location}>{link.text}</Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
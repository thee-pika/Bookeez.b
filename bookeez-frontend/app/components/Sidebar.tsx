"use client"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        router.push('/auth/login');
    };
    return (
        <>
            <div className="sidebar w-64 h-[88.5vh] flex flex-col justify-between bg-[rgb(9,9,11)]">
                <div className="dashboard">
                    <div className="text-white text-2xl p-3 bg-[#91898992] rounded-md m-2 ">
                        Admin Dashboard
                    </div>
                    <Link href="/">
                        <div className="templates text-white p-4 bg-[#352d2d92] rounded-md m-2 hover:bg-[#37323234]">
                            Templates
                        </div>
                    </Link>
                    <Link href={"/users"}>
                        <div className="users text-white p-4 bg-[#352d2d92] rounded-md m-2 hover:bg-[rgba(55,50,50,0.2)]">
                            Users
                        </div>
                    </Link>
                    <Link href={"/reviews"}>
                        <div className="reviews text-white p-4 bg-[#352d2d92] rounded-md m-2 hover:bg-[#37323234]">
                            Reviews
                        </div>
                    </Link>
                </div>

                <div className="text-white p-4 bg-[#352d2d92] rounded-md m-2 hover:bg-[#37323234]">
                    {!isLoggedIn ? <button  ><Link href={"/auth/login"}>Login</Link></button> : <button onClick={handleLogout}>Logout</button>}
                </div>
            </div>
        </>
    )
}

export default Sidebar
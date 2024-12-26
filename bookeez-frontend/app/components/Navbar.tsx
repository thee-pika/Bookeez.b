"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token); 
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        router.push('/auth/login');
    };
    return (
        <>
            <div className="navbar w-100% flex h-20 bg-[rgb(9,9,11)] items-center">
                <div className="logo">
                    <Image
                        className="ml-8"
                        src={"/assests/logo.png"}
                        width={40}
                        height={40}
                        alt='logo'
                    />
                </div>
                <div className="home">
                    <Link href={"/"} className="text-white ">Bookeez</Link>
                </div>

                <div className="searchbar ml-8 w-[40vw]">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 ">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="text" id="simple-search" className=" text-gray-900 text-sm rounded-lg focus:outline-none border-none block w-full ps-10 p-2.5 "
                            placeholder="Search templates , users ..." required />
                    </div>
                </div>
               
                <div className="login ml-[35rem]">
                    {!isLoggedIn ? <button className='bg-gray-700 hover:bg-gray-950 rounded-md p-2 w-[7rem]  text-[#F1FBFB] ml-8 mr-8' ><Link href={"/auth/login"}>Login</Link></button> : <button className='bg-gray-900 hover:bg-gray-950 rounded-md p-2 w-[7rem] text-[#F1FBFB] ml-8 mr-10' onClick={handleLogout}>Logout</button>}
                </div>
            </div>
        </>
    )
}

export default Navbar
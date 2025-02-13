"use client"
import Image from "next/image";
import Link from "next/link";
import dotenv from 'dotenv';
import { useEffect, useState } from "react";

interface Template {
    template_name: string,
    _id: string,
    defaultValues: {
        title: string,
        author: string,
        price: number,
        isbn: string,
        subject: string,
        stream: string,
        description: string,
        semester: string,
        condition: string,
        imageUrl: string,
    }
}

const Templates = () => {
    dotenv.config();
    const [templates, settemplates] = useState<Template[]>([])
    const [loading, setloading] = useState(true)

    const fetchTemplates = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template`);

            const data = await response.json();
            console.log("data", data);
            settemplates(data.template)

        } catch (error) {
            console.log("Error!:", error)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        fetchTemplates()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <>
            <div className="">
                <div className="templates flex justify-end me-4 ">
                    <Link href="/new-Template">
                        <button className="bg-white p-4  shadow-lg translate-x-1 px-4 py-4 rounded-md focus:outline-none focus:ring-black focus:ring-4">New Template</button></Link>
                </div>
                <div className="templates grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 p-4  ">
                    {
                        templates.map((template: Template, index) => (
                            <Link href={`/template/${template._id}`} key={template._id}>
                                <div key={index} className=" flex flex-col justify-evenly rounded-md  w-[340px] h-[70vh] items-center bg-white shadow-[#ffffff] shadow-md hover:shadow-xl transition-shadow">
                                    <p className="mt-4 font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap">{template.template_name}</p>
                                    <div className="w-[190px] h-[250px] overflow-hidden">
                                        <Image
                                            src={template.defaultValues.imageUrl}
                                            alt={template.template_name}
                                            priority
                                            width={190}
                                            height={250}
                                            className="rounded-t-lg transition-all duration-300 object-cover w-[190px] h-[250px]"
                                        />
                                    </div>
                                    <h1 className="font-semibold text-lg overflow-hidden text-ellipsis whitespace-nowrap w-full px-2 text-center">{template.defaultValues.title}</h1>
                                    <p className="truncate">
                                        <span className="font-bold">Author:</span>
                                        <span className="hover:underline"> {template.defaultValues.author}</span>
                                    </p>
                                    <p className="truncate">
                                        <span className="font-bold">Stream:</span>
                                        <span className="hover:underline"> {template.defaultValues.stream}</span>
                                    </p>
                                    <p className="truncate">
                                        <span className="font-bold">Subject:</span>
                                        <span className="hover:underline"> {template.defaultValues.subject}</span>
                                    </p>
                                </div>
                            </Link>
                        )
                        )}
                </div>
            </div>
        </>
    )
}

export default Templates

"use client"
import Image from "next/image";
import dotenv from 'dotenv';
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

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

const Template = () => {
    dotenv.config();
    const { id } = useParams()
    const router = useRouter()
    const [template, setTemplate] = useState<Template | undefined>()
    const [loading, setloading] = useState(true);
    useEffect(() => {
        if (id) {
            fetchTemplate()
        }
    }, [id])

    const fetchTemplate = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}`)
            if (!res.ok) {
                console.log("eeror");
            }
            const { template } = await res.json();
            console.log(template)
            setTemplate(template)

            if (!template.defaultValues.imageUrl) {
                console.log("Image not found!!!");
            }
        } catch (error) {
            console.log("eror!!", error)
        } finally {
            setloading(true)
        }

    }
   if(loading) {
    return <div className="h-screen">Loading ...</div>
   }
    const handleDelete = async () => {

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/api/template/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (!res.ok) {
                toast.error("Template Deletion Failed!!");
            } else {
                toast.success("Template Deleted successfully!!")
                router.push("/")
            }

        } catch (error) {
            console.log(error);
            toast.error("some error occured");
        }
    }
    return (
        <>

            <div className="mx-auto w-[60rem] p-6">
                <div className="bg-white shadow-md rounded-lg h-[75vh] flex hover:shadow-2xl border transition-shadow overflow-hidden">
                    {/* Left Side: Image */}
                    <div className="w-2/5 flex justify-center items-center p-6">
                        {template?.defaultValues.imageUrl && (
                            <Image
                                src={template?.defaultValues.imageUrl}
                                alt={template._id}
                                width={280}
                                height={380}
                                className="w-[300px] h-[400px] object-cover rounded-md hover:shadow-2xl"
                            />
                        )}
                    </div>

                    {/* Right Side: Details */}
                    <div className="w-3/5 p-6 flex flex-col justify-start">
                        <h1 className="text-3xl font-bold mb-4 mt-6 overflow-hidden text-ellipsis whitespace-nowrap w-full">{template?.defaultValues.title}</h1>
                        <p className="text-gray-700 mb-4">{template?.defaultValues.description}</p>
                        <p className="text-lg mb-2">
                            <span className="font-bold">Stream:</span> {template?.defaultValues.stream}
                        </p>
                        <p className="text-lg mb-2">
                            <span className="font-bold">Subject:</span> {template?.defaultValues.subject}
                        </p>
                        <p className="text-lg mb-2">
                            <span className="font-bold">Author:</span> {template?.defaultValues.author}
                        </p>
                        <p className="text-lg mb-4">
                            <span className="font-bold">Condition:</span> {template?.defaultValues.condition}
                        </p>
                        <p className="text-2xl font-semibold mb-6">
                            Price: <span className="text-[#d80032]">${template?.defaultValues.price}</span>
                        </p>
                        <div className="flex ">
                            <Link href={`/edit-template/${template?._id}`} key={template?._id}>
                                <button
                                    className="bg-[#366977] hover:bg-[#153943] text-white py-2 px-4 rounded w-48"
                                    aria-label="Buy this template"
                                >
                                    Edit
                                </button>
                            </Link>

                            <button
                                className="bg-[#d80032] text-white py-2 px-4 ml-4 rounded hover:bg-[rgba(210,4,4,0.64)] w-48"
                                aria-label="Buy this template"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>


    )
}

export default Template
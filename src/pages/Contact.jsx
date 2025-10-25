import API from "../api/config";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BiPhone } from "react-icons/bi";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { RiMvAiLine } from "react-icons/ri";
export default function Contact() {
    const [inputvalue, setinputvalue] = useState({
        name: "",
        email: "",
        number: "",
        message: ""
    })
    let handleinp = (e) => {
        setinputvalue({ ...inputvalue, [e.target.name]: e.target.value })
    }
    let handlecontact = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/api/contact/', inputvalue);
            if (res.data.status === 201 || res.data.status === 200) {
                toast.success(res.data.message || 'Message sent successfully!');
                setinputvalue({ name: "", email: "", number: "", message: "" });
            } else {
                toast.error(res.data.message || 'Failed to send message');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            toast.error(err.response?.data?.message || 'Failed to send message');
        }
    }

    return (
        <div className="flex justify-center py-10 bg-gray-50">
            <Toaster position="top-right" reverseOrder={false}/>
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Side Info */}
                <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
                    {/* Call Us */}
                    <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <BiPhone className="text-red-500 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Call To Us</h3>
                            <p className="text-gray-600 text-sm">
                                We are available 24/7, 7 days a week.
                            </p>
                            <p className="text-sm mt-2 flex items-center">
                                <FaPhoneAlt className="mr-2" />
                                <a href="tel:+919079001762" className="hover:underline">
                                    +91 9079001762
                                </a>
                            </p>
                            <p className="text-sm flex items-center">
                                <FaPhoneAlt className="mr-2" />
                                <a href="tel:+919351722408" className="hover:underline">
                                    +91 9351722408
                                </a>
                            </p>
                        </div>
                    </div>

                    <hr />

                    {/* Write To Us */}
                    <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <RiMvAiLine className="text-red-500 w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Write To Us</h3>
                            <p className="text-gray-600 text-sm">
                                Fill out our form and we will contact you within 24 hours.
                            </p>
                            <p className="text-sm mt-2 flex items-center">
                                <FaEnvelope className="mr-2" />
                                <a
                                    href="mailto:pixelgenixitsolution@gmail.com"
                                    className="hover:underline"
                                >
                                    pixelgenixitsolutions@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="md:col-span-2 bg-white shadow-md rounded-lg p-6">
                    <form className="space-y-4" onSubmit={handlecontact}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                name="name"
                                onChange={handleinp}
                                required
                                placeholder="Your Name *"
                                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none"
                            />
                            <input
                                type="email"
                                name="email"
                                required
                                onChange={handleinp}
                                placeholder="Your Email *"
                                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none"
                            />
                            <input
                                type="number"
                                name="number"
                                required
                                onChange={handleinp}
                                placeholder="Your Phone *"
                                className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none"
                            />
                        </div>

                        <textarea
                            placeholder="Your Message"
                            rows="5"
                            name="message"
                            onChange={handleinp}
                            className="w-full px-4 py-2 border rounded-md bg-gray-50 focus:outline-none"
                        ></textarea>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-red-500 text-white px-6 py-2 cursor-pointer rounded-md hover:bg-red-600 transition"
                            >
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

import React from "react";
import { Link } from "react-router-dom";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-10">
            <div className="container mx-auto grid md:grid-cols-4 gap-8 px-6">
                {/* Exclusive Subscribe */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Exclusive</h3>
                    <p className="mb-2">Subscribe</p>
                    <p className="text-sm mb-3">Get 10% off your first order</p>
                    <div className="flex items-center bg-transparent border border-gray-500 rounded px-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-transparent text-sm p-2 flex-grow outline-none text-white"
                        />
                        <button className="text-white px-2">➤</button>
                    </div>
                </div>

                {/* Account */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Account</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/editprofile" className="hover:underline">
                                My Account
                            </Link>
                        </li>
                        <li>
                            <Link to="/Signup" className="hover:underline">
                                Login / Register
                            </Link>
                        </li>
                        <li>
                            <Link to="/cart" className="hover:underline">
                                Cart
                            </Link>
                        </li>
                        <li>
                            <Link to="/wishlist" className="hover:underline">
                                Wishlist
                            </Link>
                        </li>
                        <li>
                            <Link to="/" className="hover:underline">
                                Shop
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Quick Link */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Link</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/privacy-policy" className="hover:underline">
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link to="/terms-of-use" className="hover:underline">
                                Terms Of Use
                            </Link>
                        </li>
                        <li>
                            <Link to="/faq" className="hover:underline">
                                FAQ
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:underline">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Support - Right Side */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Support</h3>
                    <p className="text-sm flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-xl" />
                        662 Jyoti Kiran,Vivek Vihar,New Sanganer Road,Sodala,Jaipur
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
                    <p className="text-sm flex items-center">
                        <FaEnvelope className="mr-2" />
                        <a
                            href="mailto:pixelgenixedutech@gmail.com"
                            className="hover:underline"
                        >
                            pixelgenixedutech@gmail.com
                        </a>
                    </p>
                    <p className="text-sm flex items-center">
                        <FaEnvelope className="mr-2" />
                        <a href="mailto:oneroofedu@gmail.com" className="hover:underline">
                            oneroofedu@gmail.com
                        </a>
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
            <div className="flex text-center justify-center space-x-4 ">
                <div className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full bg-white hover:bg-blue-500 text-black hover:text-white transition">
                    <a
                        href="https://www.facebook.com/profile.php?id=61577101538076&sk=about"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <FaFacebookF />
                    </a>
                </div>
                <div className="w-8 h-8 flex items-center justify-center  cursor-pointer rounded-full bg-white hover:bg-blue-400  text-black hover:text-white transition">

                    <a
                        href="https://x.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <FaTwitter />
                    </a>
                </div>
                <div className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full bg-white text-black 
                hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-600 
                hover:text-white transition">
                    <a
                        href="https://www.instagram.com/pixelgenixitsolutions/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaInstagram />
                    </a>
                </div>

                <div className="w-8 h-8 flex items-center justify-center cursor-pointer rounded-full bg-white hover:bg-blue-400 text-black hover:text-white transition">
                    <a
                        href="https://www.linkedin.com/in/pixelgenix-itsolutions-0b0607378"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=""
                    >
                        <FaLinkedinIn />
                    </a>
                </div>
            </div>
            {/* Bottom Bar with Social Icons */}
            <div className="border-t border-gray-700 mt-8 py-4 px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
                <p>
                    © Copyright PixelGenix IT Solutions 2025. All rights reserved
                </p>

            </div>
        </footer>
    );
};

export default Footer;

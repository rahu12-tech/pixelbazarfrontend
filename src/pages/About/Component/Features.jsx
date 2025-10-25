import React from "react";
import { FaTruck, FaHeadphones, FaShieldAlt } from "react-icons/fa";

export default function Features() {
    const features = [
        {
            id: 1,
            icon: <FaTruck size={26} />,
            title: "FREE AND FAST DELIVERY",
            desc: "Free delivery for all orders over $140",
        },
        {
            id: 2,
            icon: <FaHeadphones size={26} />,
            title: "24/7 CUSTOMER SERVICE",
            desc: "Friendly 24/7 customer support",
        },
        {
            id: 3,
            icon: <FaShieldAlt size={26} />,
            title: "MONEY BACK GUARANTEE",
            desc: "We return money within 30 days",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 py-12 text-center">
            {features.map((feature) => (
                <div key={feature.id} className="flex flex-col items-center">
                    {/* Circle with Icon */}
                    <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-black text-white relative z-10">
                            {feature.icon}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-gray-300 -z-0 scale-125"></div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold uppercase mb-1">
                        {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
            ))}
        </div>
    );
}

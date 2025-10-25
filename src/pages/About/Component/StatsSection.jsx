import React, { useState } from "react";
import { BiCoinStack, BiShoppingBag, BiStore } from "react-icons/bi";
import { FaDollarSign } from "react-icons/fa";

export default function StatsSection() {
    const [activeId, setActiveId] = useState(null);

    const stats = [
        {
            id: 1,
            icon: <BiStore size={28} />,
            value: "10.5k",
            label: "Sellers active our site",
        },
        {
            id: 2,
            icon: <FaDollarSign size={28} />,
            value: "33k",
            label: "Monthly Product Sale",
        },
        {
            id: 3,
            icon: <BiShoppingBag size={28} />,
            value: "45.5k",
            label: "Customer active in our site",
        },
        {
            id: 4,
            icon: <BiCoinStack size={28} />,
            value: "25k",
            label: "Annual gross sale in our site",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-6 py-12">
            {stats.map((stat) => (
                <button
                    key={stat.id}
                    onClick={() => setActiveId(stat.id)}
                    className={`flex flex-col items-center justify-center p-6 border rounded-lg shadow-sm transition cursor-pointer ${activeId === stat.id
                            ? "bg-red-500 text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                >
                    {/* Icon */}
                    <div
                        className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${activeId === stat.id
                                ? "bg-white text-red-500"
                                : "bg-black text-white"
                            }`}
                    >
                        {stat.icon}
                    </div>

                    {/* Value */}
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>

                    {/* Label */}
                    <p
                        className={`text-sm text-center ${activeId === stat.id ? "text-white" : "text-gray-600"
                            }`}
                    >
                        {stat.label}
                    </p>
                </button>
            ))}
        </div>
    );
}

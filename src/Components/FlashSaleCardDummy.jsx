import React, { useState } from "react";
import { FaRegHeart, FaEye, FaStar } from "react-icons/fa";

const FlashSaleCardDummy = ({ product }) => {
    // State for toggling wishlist icon
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleWishlistToggle = () => {
        setIsWishlisted(!isWishlisted);
    };

    return (
        <div className="relative bg-white shadow-sm rounded-lg p-4 group hover:shadow-lg transition">
            {/* Discount Badge */}
            {product.discount && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    -{product.discount}%
                </span>
            )}

            {/* Wishlist & Quick View */}
            <div className="absolute top-2 right-2 space-y-2 opacity-0 group-hover:opacity-100 transition">
                <button
                    onClick={handleWishlistToggle}
                    className="bg-white p-2 rounded-full shadow transition"
                    style={{ color: isWishlisted ? "red" : "gray" }}
                >
                    <FaRegHeart />
                </button>
                <button className="bg-white p-2 rounded-full shadow hover:text-red-500 transition">
                    <FaEye />
                </button>
            </div>

            {/* Product Image */}
            <img
                src={product.image}
                alt={product.name}
                className="h-32 mx-auto object-contain mt-4"
            />

            {/* Product Name */}
            <h3 className="mt-3 text-sm font-semibold">{product.name}</h3>

            {/* Price */}
            <div className="flex items-center gap-2 mt-1">
                <span className="text-red-500 font-bold">${product.price}</span>
                {product.oldPrice && (
                    <span className="line-through text-gray-400 text-sm">
                        ${product.oldPrice}
                    </span>
                )}
            </div>

            {/* Rating */}
            <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                        key={i}
                        className={`${i < product.rating ? "text-yellow-400" : "text-gray-300"} text-sm`}
                    />
                ))}
                <span className="ml-2 text-xs text-gray-500">({product.reviews})</span>
            </div>

            {/* Add To Cart Button (hover effect) */}
            <button className="mt-3 w-full bg-black text-white text-sm py-2 rounded opacity-0 group-hover:opacity-100 transition">
                Add To Cart
            </button>
        </div>
    );
};

export default FlashSaleCardDummy;

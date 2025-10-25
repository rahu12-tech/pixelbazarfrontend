import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";
import { addToWishlist } from "../redux/wishlist/wishlistSlice";
import { BsHeart, BsEye, BsStar, BsStarFill } from "react-icons/bs";

const ProductCardDummy = ({ product, showRating = false }) => {
    const dispatch = useDispatch();
    const [wishlistClicked, setWishlistClicked] = useState(false);

    if (!product) return null;

    const handleAddToCart = () => {
        dispatch(
            addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.image,
                qty: 1,
            })
        );
    };

    const handleToggleWishlist = () => {
        setWishlistClicked((prev) => !prev);
        dispatch(
            addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.image,
            })
        );
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) =>
            i < (rating || 0) ? (
                <BsStarFill key={i} className="text-yellow-400" />
            ) : (
                <BsStar key={i} className="text-gray-300" />
            )
        );
    };

    return (
        <div className="border rounded-lg p-4 flex flex-col items-center relative group w-60 h-80 transition">
            {/* Wishlist & Eye icons */}
            <button
                onClick={handleToggleWishlist}
                className="absolute top-2 right-10 text-gray-500 opacity-0 group-hover:opacity-100 transition"
                style={{ color: wishlistClicked ? "red" : "gray" }}
            >
                <BsHeart size={18} />
            </button>

            <button className="absolute top-2 right-2 text-gray-500 opacity-0 group-hover:opacity-100 transition">
                <BsEye size={18} />
            </button>

            {/* Product Image */}
            <div className="w-full h-32 rounded-md mb-3 flex items-center justify-center">
                {product?.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full rounded-md"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        No Image
                    </div>
                )}
            </div>

            {/* Title */}
            <h3 className="font-semibold mt-2 text-center">{product?.name || "No Name"}</h3>

            {/* Price */}
            <p className="mt-1 text-center">
                <span className="font-bold text-red-500">${product?.price || 0}</span>{" "}
                {product?.oldPrice && (
                    <span className="line-through text-gray-400">${product?.oldPrice}</span>
                )}
            </p>

            {/* Rating (optional) */}
            {showRating && (
                <div className="flex items-center mt-1">
                    {renderStars(product?.rating)}
                    <span className="ml-2 text-sm text-gray-500">
                        ({product?.reviews || 0})
                    </span>
                </div>
            )}

            {/* Add to Cart */}
            <button
                onClick={handleAddToCart}
                className="mt-3 w-full bg-black text-white text-sm py-2 rounded opacity-0 group-hover:opacity-100 cursor-pointer transition"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default ProductCardDummy;

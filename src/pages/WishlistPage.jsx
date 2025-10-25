import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../redux/wishlist/wishlistSlice";
import { MdOutlineDelete } from "react-icons/md";

export default function WishlistPage() {
  const wishlist = useSelector(state => state.wishlist.items);
  const dispatch = useDispatch();

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Wishlist ({wishlist.length})</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 text-center lg:grid-cols-4 gap-6">
          {wishlist.map(item => (
            <div key={item.id} className="border p-4 rounded-lg items-center relative group">
              <div className="flex items-center justify-center">
              <img src={item.img} className="w-40 h-40 " />
              </div>
              <h3 className="mt-2 font-semibold">{item.name}</h3>
              <p>${item.price}</p>
              <p>Qty: {item.qty}</p>
              <button
                onClick={() => dispatch(removeFromWishlist(item.id))}
                className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                <MdOutlineDelete className="text-2xl" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

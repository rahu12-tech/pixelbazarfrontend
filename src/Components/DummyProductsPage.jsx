// src/pages/DummyProductsPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaMobileAlt,
    FaDesktop,
    FaClock,
    FaCamera,
    FaHeadphones,
    FaGamepad,
} from "react-icons/fa";

const DummyProductsPage = () => {
    const navigate = useNavigate();

    const categories = [
        { id: 1, name: "Phones", icon: <FaMobileAlt size={20} /> },
        { id: 2, name: "Computers", icon: <FaDesktop size={20} /> },
        { id: 3, name: "SmartWatch", icon: <FaClock size={20} /> },
        { id: 4, name: "Camera", icon: <FaCamera size={20} /> },
        { id: 5, name: "HeadPhones", icon: <FaHeadphones size={20} /> },
        { id: 6, name: "Gaming", icon: <FaGamepad size={20} /> },
    ];

    const products = [
        { id: 1, name: "iPhone 14 Pro", price: 1200, category: 1, image: "https://img.freepik.com/free-photo/elegant-smartphone-composition_23-2149437107.jpg?t=st=1755921873~exp=1755925473~hmac=6442dfa5caf4342b476e36ddac835634e2fa69e93cdc3379ad128a73d2abfa4f&w=1480" },
        { id: 2, name: "Samsung Galaxy S23", price: 1000, category: 1, image: "https://images.samsung.com/is/image/samsung/p6pim/in/sm-s911bzadeua/gallery/in-galaxy-s23-s911-435247-sm-s911bzadeua-534735179" },
        { id: 3, name: "OnePlus 11", price: 850, category: 1, image: "https://image01.oneplus.net/ebp/202302/14/1-m00-16-3b-rb8bwl9jxgaas6b0aajy-640.png" },
        { id: 4, name: "Dell XPS 13", price: 1500, category: 2, image: "https://i.dell.com/is/image/DellContent//content/dam/global-site-design/product_images/dell_client_products/notebooks/xps_notebooks/xps_13_9310_laptop/xps-13-9310-laptop-black-gallery-504x350.png?fmt=png-alpha&wid=504&hei=350" },
        { id: 5, name: "MacBook Pro", price: 2000, category: 2, image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202110?wid=904&hei=840&fmt=jpeg&qlt=80&.v=1632788573000" },
        { id: 6, name: "Asus ROG Laptop", price: 1800, category: 2, image: "https://dlcdnwebimgs.asus.com/gain/EFC44BC0-6119-49C5-99EC-B3E4293D86D1/w717" },
        { id: 7, name: "Apple Watch Ultra", price: 900, category: 3, image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ML7G3_VW_34FR+watch-44-alum-silver-nc-se?wid=940&hei=1112&fmt=png-alpha&.v=1660672335700" },
        { id: 8, name: "Samsung Galaxy Watch 5", price: 450, category: 3, image: "https://images.samsung.com/is/image/samsung/assets/in/wearables/galaxy-watch-5/galaxy-watch5_mystic_silver.png" },
        { id: 9, name: "Noise SmartWatch", price: 150, category: 3, image: "https://cdn.shopify.com/s/files/1/0557/9748/2970/products/noise-colorfit-pro-4-max-smart-watch_black_800x.png" },
        { id: 10, name: "Canon EOS 1500D", price: 700, category: 4, image: "https://m.media-amazon.com/images/I/81nNf0SbOWL._SL1500_.jpg" },
        { id: 11, name: "Sony Alpha A7", price: 1200, category: 4, image: "https://cdn.mos.cms.futurecdn.net/VmPqgqZSS1ov24Vw9gkFhm.jpg" },
        { id: 12, name: "Nikon D3500", price: 650, category: 4, image: "https://cdn.mos.cms.futurecdn.net/dwbkgmmHuSC9cnEkgZyQd4.jpg" },
        { id: 13, name: "Sony WH-1000XM5", price: 400, category: 5, image: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg" },
        { id: 14, name: "Bose QC 45", price: 350, category: 5, image: "https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc45/product_silo_images/qc45_black_EC_hero.psd/_jcr_content/renditions/cq5dam.web.320.320.png" },
        { id: 15, name: "JBL Tune 760NC", price: 150, category: 5, image: "https://www.jbl.com/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwb88dfc26/JBL_TUNE_760NC_Product_Image_Hero_Black.png" },
        { id: 16, name: "PS5 Console", price: 500, category: 6, image: "https://www.sony.com/image/2f92839b7a6d10e0a76ff547b3e28c1b?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF" },
        { id: 17, name: "Xbox Series X", price: 500, category: 6, image: "https://compass-ssl.xbox.com/assets/88/55/8855ed01-3f7c-41f4-b3c2-01a008db3efb.jpg?n=Xbox-Series-X_Hero-0_Large.jpg" },
        { id: 18, name: "Nintendo Switch", price: 350, category: 6, image: "https://m.media-amazon.com/images/I/61-PblYntsL._SL1500_.jpg" },
        ...Array.from({ length: 20 }, (_, i) => ({
            id: 19 + i,
            name: `Dummy Product ${i + 1}`,
            price: Math.floor(Math.random() * 2000) + 100,
            category: (i % 6) + 1,
            image: "https://via.placeholder.com/150?text=Product", // Generic image for extra products
        })),
    ];

    const [active, setActive] = useState(1);

    const filteredProducts = products.filter(
        (prod) => prod.category === active
    );

    return (
        <section className="container mx-auto px-6 my-12">
            <div className="flex flex-wrap gap-4 justify-center mb-8">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActive(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md border transition
              ${active === cat.id
                                ? "bg-red-500 text-white"
                                : "bg-white border-gray-200 hover:border-red-500"}`}
                    >
                        {cat.icon}
                        {cat.name}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredProducts.map((prod) => (
                    <div
                        key={prod.id}
                        onClick={() =>
                            navigate(`/productdetailpage/${prod.id}`, { state: prod })
                        }
                        className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    >
                        <div className="w-full h-32 rounded-md mb-3 flex items-center justify-center">
                            <img
                                src={prod.image}
                                alt={prod.name}
                                className="object-cover w-full h-full rounded-md"
                            />
                        </div>
                        <h3 className="text-sm font-semibold">{prod.name}</h3>
                        <p className="text-red-500 font-bold mt-1">${prod.price}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DummyProductsPage;

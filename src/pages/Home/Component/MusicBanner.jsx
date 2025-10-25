import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../../../api/config";
import toast, { Toaster } from "react-hot-toast";

const MusicBanner = () => {
    const [bannerData, setBannerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    const [timeLeft, setTimeLeft] = useState({
        days: 5,
        hours: 23,
        minutes: 59,
        seconds: 35,
    });

    useEffect(() => {
        const fetchMusicBanner = async () => {
            try {
                const res = await API.get('/api/music-banner/');
                setBannerData(res.data.banner || res.data);
            } catch (err) {
                console.error('Music banner fetch error:', err);
                // Fallback data
                setBannerData({
                    title: 'Enhance Your Music Experience',
                    subtitle: 'Categories',
                    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=400&fit=crop',
                    category: 'music',
                    isActive: true
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchMusicBanner();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { days, hours, minutes, seconds } = prev;

                if (seconds > 0) return { ...prev, seconds: seconds - 1 };
                if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
                if (hours > 0)
                    return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
                if (days > 0)
                    return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };

                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleBuyNow = () => {
        // Navigate to music category products
        navigate('/products', {
            state: {
                filter: {
                    category: 'music'
                },
                category: 'Music Products'
            }
        });
    };

    if (loading) {
        return (
            <div className="bg-gray-200 rounded-md h-64 flex items-center justify-center my-12">
                <div className="text-gray-500">Loading music banner...</div>
            </div>
        );
    }

    // Always show banner with fallback data
    const displayData = bannerData || {
        title: 'Enhance Your Music Experience',
        subtitle: 'Categories',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=400&fit=crop',
        category: 'music',
        isActive: true
    };

    return (
        <section className="bg-black text-white rounded-md overflow-hidden my-12 container mx-auto px-4">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="grid grid-cols-1 md:grid-cols-2 items-center px-3 md:px-12 py-10 gap-8">
                {/* Left Content */}
                <div>
                    <p className="text-green-500 font-semibold mb-3">{displayData.subtitle}</p>
                    <h2 className="text-3xl font-bold leading-snug mb-6">
                        {displayData.title}
                    </h2>

                    {/* Countdown */}
                    <div className="flex gap-4 mb-6 flex-wrap">
                        <div className="bg-white text-black rounded-full px-4 py-3 text-center min-w-[70px]">
                            <p className="font-bold text-lg">
                                {String(timeLeft.days).padStart(2, "0")}
                            </p>
                            <span className="text-xs">Days</span>
                        </div>
                        <div className="bg-white text-black rounded-full px-4 py-3 text-center min-w-[70px]">
                            <p className="font-bold text-lg">
                                {String(timeLeft.hours).padStart(2, "0")}
                            </p>
                            <span className="text-xs">Hours</span>
                        </div>
                        <div className="bg-white text-black rounded-full px-4 py-3 text-center min-w-[70px]">
                            <p className="font-bold text-lg">
                                {String(timeLeft.minutes).padStart(2, "0")}
                            </p>
                            <span className="text-xs">Minutes</span>
                        </div>
                        <div className="bg-white text-black rounded-full px-4 py-3 text-center min-w-[70px]">
                            <p className="font-bold text-lg">
                                {String(timeLeft.seconds).padStart(2, "0")}
                            </p>
                            <span className="text-xs">Seconds</span>
                        </div>
                    </div>

                    {/* Button */}
                    <button 
                        onClick={handleBuyNow}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-semibold transition"
                    >
                        Shop Music Products
                    </button>
                </div>

                {/* Right Image */}
                    <div className="flex justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop"
                            alt="Music Banner"
                            className="w-full max-w-[500px] object-contain"
                        />
                    </div>
            </div>
        </section>
    );
};

export default MusicBanner;

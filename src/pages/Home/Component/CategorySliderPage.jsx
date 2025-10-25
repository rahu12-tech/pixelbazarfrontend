import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categories = [
  { id: 1, name: 'Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=200&fit=crop', slug: 'phones' },
  { id: 2, name: 'Laptops', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop', slug: 'laptops' },
  { id: 3, name: 'Speakers', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop', slug: 'speakers' },
  { id: 4, name: 'Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', slug: 'headphones' },
  { id: 5, name: 'Cameras', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=200&fit=crop', slug: 'cameras' }
];

const CategorySliderPage = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate('/products', {
      state: {
        filter: { category: category.slug },
        category: category.name
      }
    });
  };

  return (
    <div className="w-full mt-8 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Shop by Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-32 object-cover"
            />
            <div className="p-3 text-center">
              <h3 className="font-semibold text-gray-800">{category.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySliderPage;
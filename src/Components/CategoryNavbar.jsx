import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

const CategoryNavbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCategoryInteraction = (index) => {
    if (isMobile) {
      setActiveDropdown(activeDropdown === index ? null : index);
    } else {
      setActiveDropdown(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveDropdown(null);
    }
  };

  const categories = [
    {
      name: 'Mobiles & Tablets',
      subcategories: [
        'Smartphones',
        'Tablets',
        'Mobile Accessories',
        'Cases & Covers',
        'Power Banks',
        'Screen Guards'
      ]
    },
    {
      name: 'Electronics',
      subcategories: [
        'Laptops',
        'Cameras',
        'Headphones',
        'Speakers',
        'Gaming',
        'Smart Watches'
      ]
    },
    {
      name: 'Fashion',
      subcategories: [
        "Men's Clothing",
        "Women's Clothing",
        'Footwear',
        'Watches',
        'Bags & Luggage',
        'Jewellery'
      ]
    },
    {
      name: 'Home & Furniture',
      subcategories: [
        'Furniture',
        'Home Decor',
        'Kitchen & Dining',
        'Bed & Bath',
        'Garden & Outdoor',
        'Tools & Hardware'
      ]
    },
    {
      name: 'TV & Appliances',
      subcategories: [
        'Televisions',
        'Air Conditioners',
        'Refrigerators',
        'Washing Machines',
        'Kitchen Appliances',
        'Small Appliances'
      ]
    },
    {
      name: 'Beauty',
      subcategories: [
        'Makeup',
        'Skincare',
        'Hair Care',
        'Fragrances',
        'Personal Care',
        'Health & Wellness'
      ]
    },
    {
      name: 'Food & Grocery',
      subcategories: [
        'Fresh Produce',
        'Packaged Food',
        'Beverages',
        'Snacks',
        'Dairy Products',
        'Organic Food'
      ]
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && !event.target.closest('.category-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile]);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto">
        <nav className="flex items-center justify-center space-x-2 md:space-x-8 py-3 overflow-x-auto">
          {categories.map((category, index) => (
            <div
              key={index}
              className="relative group category-dropdown"
              onMouseEnter={() => !isMobile && handleCategoryInteraction(index)}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium py-2 px-2 md:px-3 rounded-md transition-colors whitespace-nowrap text-sm md:text-base"
                onClick={() => isMobile && handleCategoryInteraction(index)}
              >
                <span>{category.name}</span>
                <FaChevronDown className={`text-xs transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === index && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="py-2">
                    {category.subcategories.map((subcategory, subIndex) => (
                      <Link
                        key={subIndex}
                        to={`/products?category=${encodeURIComponent(subcategory)}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {subcategory}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                        className="block px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        View All {category.name}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CategoryNavbar;
import React from "react";
import { BsHeadphones, BsShieldCheck, BsTruck } from "react-icons/bs";
import { motion } from "framer-motion";

const ServiceInfo = () => {
  const services = [
    {
      id: 1,
      icon: <BsTruck className="w-10 h-10 text-gray-700" />,
      title: "Free and Fast Delivery",
      desc: "Free delivery for all orders over $140",
    },
    {
      id: 2,
      icon: <BsHeadphones className="w-10 h-10 text-gray-800" />,
      title: "24/7 Customer Service",
      desc: "Friendly 24/7 customer support",
    },
    {
      id: 3,
      icon: <BsShieldCheck className="w-10 h-10 text-gray-700" />,
      title: "Money Back Guarantee",
      desc: "We refund money within 30 days",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1, y: 0, transition: { duration: 1, ease: "easeInOut",},
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
      {services.map((service) => (
        <motion.div
          key={service.id}
          className="flex flex-col items-center text-center bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          variants={cardVariants}
        >
          <div className="mb-3">{service.icon}</div>
          <h3 className="text-lg font-semibold mb-1">{service.title}</h3>
          <p className="text-gray-600 text-sm">{service.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ServiceInfo;

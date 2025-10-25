import React from "react";
import StatsSection from "../../pages/About/Component/StatsSection";
import TeamSlider from "./Component/TeamSlider";
import Features from "./Component/Features";

export default function About() {
  return (

    <>
      <div className="flex flex-col md:flex-row items-center gap-8 px-8 py-16">
        {/* Left Text Section */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to GenixBazar, your trusted online shopping destination! Over the past 5 years, we have grown from a small local store into a dynamic e-commerce platform, serving thousands of happy customers across the country. Our journey is a story of dedication, passion, and relentless pursuit of excellence.

From the very beginning, our mission has been simple: to bring quality products, unbeatable deals, and an exceptional shopping experience to every home. We believe that shopping should not just be a transaction—it should be exciting, convenient, and rewarding.


          </p>
          <p className="text-gray-700 leading-relaxed">
            At GenixBazar, we carefully curate every product, ensuring top-notch quality and affordability. Whether it’s electronics, fashion, home essentials, or lifestyle products, we focus on trust, reliability, and customer satisfaction above all. Our team works tirelessly behind the scenes to make sure every order reaches you on time and in perfect condition.

Over the years, we have faced challenges, adapted to changing trends, and embraced new technologies—all with one goal in mind: to serve you better. Our growth is not just measured in numbers, but in the relationships we’ve built, the trust we’ve earned, and the smiles we’ve created.

We are proud of our journey so far, but we are even more excited for the future. Every day, we strive to innovate, improve, and provide an online shopping experience that feels personal, seamless, and memorable.

Thank you for being a part of our story. With your support, GenixBazar continues to grow, inspire, and deliver the best to every doorstep. Here’s to many more years of amazing products, unbeatable deals, and happy customers!

GenixBazar – Where Quality Meets Trust, and Shopping Feels Like Home.
          </p>
        </div>

        {/* Right Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="https://img.freepik.com/free-photo/front-view-couple-talking-real-estate-agent_23-2150322109.jpg?t=st=1755876047~exp=1755879647~hmac=835c31c87956ee4db13001b33ea803003c920bc87abf28cf8041e94658ce4f22&w=1480" // replace with your actual image
            alt="Happy customers shopping"
            className="rounded-lg shadow-md"
          />
        </div>

      </div>
      <StatsSection />
      {/* <TeamSlider/> */}
      <Features/>
      
    </>
  );
}

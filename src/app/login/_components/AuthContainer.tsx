'use client';

import type React from 'react';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Slider, { type Settings } from 'react-slick';

interface LoginLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const testimonials = [
  {
    title: 'Simplify your Car business',
    name: 'Arya',
    role: 'Founder, Flo and Wer shop',
    background: 'bg-gradient-to-br from-green-600 to-green-700',
    quote:
      'This platform transformed how we manage our automotive business. Everything is now streamlined and efficient.',
  },
  {
    title: 'Transform your Restaurant operations',
    name: 'Sarah Chen',
    role: 'Owner, Bistro Delight',
    background: 'bg-gradient-to-br from-blue-600 to-blue-700',
    quote:
      'Managing orders, inventory, and staff has never been easier. Our revenue increased by 40% in just 3 months.',
  },
  {
    title: 'Streamline your Retail store',
    name: 'Mike Rodriguez',
    role: 'CEO, Fashion Forward',
    background: 'bg-gradient-to-br from-purple-600 to-purple-700',
    quote:
      'The analytics and inventory management features helped us reduce costs and improve customer satisfaction.',
  },
  {
    title: 'Optimize your Healthcare practice',
    name: 'Dr. Emily Watson',
    role: 'Medical Director, WellCare Clinic',
    background: 'bg-gradient-to-br from-teal-600 to-teal-700',
    quote:
      'Patient scheduling and record management became effortless. We can now focus more on patient care.',
  },
  {
    title: 'Scale your E-commerce business',
    name: 'James Park',
    role: 'Founder, TechGear Pro',
    background: 'bg-gradient-to-br from-orange-600 to-orange-700',
    quote:
      'From inventory to customer support, everything is integrated. Our online sales grew by 200% this year.',
  },
];

export const LoginLayout: React.FC<LoginLayoutProps> = ({ children, title, subtitle }) => {
  const sliderRef = useRef<Slider | null>(null);
  const [currentSlide, setCurrentSlide] = useState(1);

  const handlePrevSlide = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNextSlide = () => {
    sliderRef.current?.slickNext();
  };

  const sliderSettings: Settings = {
    arrows: false,
    dots: false,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 350,
    afterChange: (current) => setCurrentSlide(current + 1),
  };

  return (
    <div className="min-h-screen bg-[#EAEBEC] flex rounded-3xl items-center justify-center p-4">
      <div className="w-full max-w-6xl rounded-3xl  overflow-hidden bg-white">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Panel - Form */}
          <div className="flex-1 bg-white px-9 pt-12 mb-6">
            <div className=" ">
              {/* Form Header */}
              <div className="mb-8 text-center space-y-2">
                <h1 className="text-4xl text-[#2B3545] font-bold font-lato leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-lg text-[#2B3545] font-lato leading-6">{subtitle}</p>
                )}
              </div>

              {/* Form Content */}
              {children}
            </div>
          </div>

          {/* Right Panel - Branding with Swiper */}
          <div
            className="flex-1 p-8  px-9 flex flex-col justify-end text-white relative rounded-3xl"
            style={{ background: 'linear-gradient(135deg,#089A00, #034300)' }}
          >
            <div className="relative z-10 max-w-lg  h-full flex flex-col justify-end">
              <Slider ref={sliderRef} {...sliderSettings} className="w-full">
                {testimonials.map((testimonial, index) => (
                  <div key={index}>
                    <div className="mb-6 space-y-8">
                      <h2 className="text-5xl font-bold font-lato text-white leading-tight">
                        {testimonial.title}
                      </h2>

                      <div className="space-y-2">
                        <h3 className="text-lg text-[#FFFFFF] font-lato font-bold">
                          {testimonial.name}
                        </h3>
                        <p className="text-base text-[#EEF5EE]/50 font-lato font-normal">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>

              <div className="flex items-center justify-between relative z-20">
                <div className="flex items-center gap-4">
                  <span className="text-base text-[#BDC0C5] font-lato font-normal space-x-1">
                    <span className="text-[#FFFFFF]/40">{String(currentSlide).padStart(2)}</span>
                    <span> of </span>
                    <span>{String(testimonials.length).padStart(2)}</span>
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handlePrevSlide}
                    className={`w-8.5 h-8.5 bg-transparent border-2 border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-200 ${
                      currentSlide === 1 ? 'opacity-30' : 'opacity-100'
                    }`}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className={`w-8.5 h-8.5 bg-transparent border-2 border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-200 ${
                      currentSlide === testimonials.length ? 'opacity-30' : 'opacity-100'
                    }`}
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

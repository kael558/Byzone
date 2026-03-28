import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const highlights = [
  'Licensed and insured for your peace of mind',
  'Serving local homeowners with quality workmanship',
  'Windows & doors specialists with broader handyman expertise',
  'Honest communication and transparent pricing',
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-surface-gray">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
              About Us
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue mb-6 leading-tight">
              Byzone CONSTRUCTION — Your Reliable Local Home Services Partner
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Byzone CONSTRUCTION provides practical home improvement services for homeowners who need quality
              work without unnecessary complications. Whether it's a window replacement, a door
              installation, or a list of handyman repairs — we show up on time, work clean, and
              finish the job right.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              We're a local service focused on doing one thing well: making your home better.
              No upsells, no surprises — just honest work at a fair price.
            </p>
            <ul className="space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700">
                  <FaCheckCircle className="text-brand-green mt-0.5 flex-shrink-0" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gray-200">
              <img
                src="/about.jpg"
                alt="By Zone professional at work"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                  e.target.parentNode.innerHTML =
                    '<span class="text-gray-400 text-sm text-center px-8">Photo of our work coming soon</span>';
                }}
              />
            </div>
            {/* Accent badge */}
            <div className="absolute -bottom-4 -left-4 bg-brand-green text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="font-bold text-lg leading-none">Local</p>
              <p className="text-green-100 text-xs mt-1">& Trusted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

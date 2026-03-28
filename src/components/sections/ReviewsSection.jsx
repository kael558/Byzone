import React from 'react';
import { FaStar, FaGoogle } from 'react-icons/fa';

const REVIEWS = [
  {
    name: 'Client Name',
    date: 'Recent',
    rating: 5,
    text:
      'By Zone did an amazing job replacing our front door and two windows. The work was clean, professional, and finished on time. Highly recommend for anyone needing windows and doors work done right.',
    platform: 'Google',
  },
  {
    name: 'Client Name',
    date: 'Recent',
    rating: 5,
    text:
      'We called By Zone for a list of handyman repairs around the house — drywall patching, a broken cabinet, and some caulking work. Everything was done neatly and at a fair price. Will definitely call again.',
    platform: 'Google',
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <FaStar
        key={i}
        size={16}
        className={i < rating ? 'text-yellow-400' : 'text-gray-200'}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="font-semibold text-gray-900">{review.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>
      </div>
      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
        <FaGoogle size={12} className="text-blue-500" />
        <span className="text-xs text-gray-500 font-medium">{review.platform}</span>
      </div>
    </div>

    <StarRating rating={review.rating} />

    <p className="text-gray-600 text-sm leading-relaxed italic">"{review.text}"</p>
  </div>
);

const ReviewsSection = () => {
  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-3">
            Client Reviews
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real feedback from real homeowners. We let our work speak for itself.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {REVIEWS.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          {[
            { label: '5-Star Rated', sub: 'on Google' },
            { label: '100% Satisfaction', sub: 'guarantee' },
            { label: 'Licensed & Insured', sub: 'for your peace of mind' },
          ].map(({ label, sub }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="flex mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar key={i} size={14} className="text-yellow-400" />
                ))}
              </div>
              <p className="font-bold text-brand-blue text-sm">{label}</p>
              <p className="text-gray-400 text-xs">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

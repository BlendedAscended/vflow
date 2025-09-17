
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Alex Morgan",
      title: "Business Owner",
      image: "/api/placeholder/64/64",
      testimonial: "Verbaflow LLC made launching our online presence seamless. Their team handled everything from our website to social media and local listings."
    },
    {
      name: "Taylor Kim",
      title: "Operations Manager", 
      image: "/api/placeholder/64/64",
      testimonial: "The AI-powered scheduling and customer support tools have saved us hours every week. Highly recommend their services."
    },
    {
      name: "Jordan Patel",
      title: "Marketing Director",
      image: "/api/placeholder/64/64", 
      testimonial: "We saw a noticeable increase in leads within the first month. Their marketing strategies are data-driven and effective."
    },
    {
      name: "Morgan Lee",
      title: "Small Business Owner",
      image: "/api/placeholder/64/64",
      testimonial: "The website redesign and SEO optimization brought us 3x more customers. Professional team with excellent results."
    }
  ];

  return (
    <section className="w-full gradient-secondary py-24 lg:py-40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-300/15 to-pink-300/15 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-20 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-black mb-8 leading-tight">
            What our <span className="gradient-text">clients</span> are saying
          </h2>
          <p className="text-gray-700 text-xl max-w-3xl leading-relaxed">
            Real feedback from businesses we&apos;ve helped with web, marketing, and automation 
            solutions in Montgomery County, MD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-10 lg:p-12 shadow-hover hover:shadow-glow border border-white/50 transition-all duration-500 transform hover:scale-105 animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden">
                    {/* Placeholder avatar */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <h4 className="font-semibold text-black text-xl mb-2">{testimonial.name}</h4>
                    <p className="text-gray-600 text-lg">{testimonial.title}</p>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {testimonial.testimonial}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

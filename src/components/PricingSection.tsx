const PricingSection = () => {
  const pricingPlans = [
    {
      name: "Starter",
      description: "Essential website and online presence setup for new businesses.",
      price: "$19",
      period: "/mo",
      yearlyPrice: "or $199 yearly",
      features: [
        "Custom website build",
        "Google Business setup",
        "Basic SEO optimization"
      ],
      buttonText: "Start free",
      isPopular: false
    },
    {
      name: "Growth",
      description: "Advanced marketing and automation tools for growing teams.",
      price: "$29",
      period: "/mo",
      yearlyPrice: "or $299 yearly",
      features: [
        "Social media integration",
        "Yelp & review management",
        "Lead generation campaigns",
        "AI appointment scheduling"
      ],
      buttonText: "Start free",
      isPopular: false,
      badge: "EVERYTHING IN STARTER PLUS:"
    },
    {
      name: "Scale",
      description: "Full-service automation, analytics, and compliance for scaling operations.",
      price: "$49",
      period: "/mo",
      yearlyPrice: "or $499 yearly",
      features: [
        "Conversational AI support",
        "Cloud migration services"
      ],
      buttonText: "Start free",
      isPopular: false,
      badge: "EVERYTHING IN GROWTH PLUS:"
    }
  ];

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-24 lg:py-40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-24 animate-fade-in-up">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-black mb-8 leading-tight">
            Plans to grow your <span className="gradient-text">business</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Choose the right solution for your needs. Simple, transparent pricing for all business sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-3xl p-10 lg:p-12 relative shadow-hover hover:shadow-glow border-2 transition-all duration-500 transform hover:scale-105 animate-fade-in-up ${
                index === 1 ? 'border-green-300 shadow-glow scale-105' : 'border-gray-200 hover:border-green-300'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {plan.badge && (
                <div className="text-xs text-green-600 font-bold mb-6 uppercase tracking-wider bg-green-50 px-4 py-2 rounded-full border border-green-200">
                  ✨ {plan.badge}
                </div>
              )}
              
              <div className="mb-10">
                <h3 className="text-3xl font-bold text-black mb-6">{plan.name}</h3>
                <p className="text-gray-600 text-lg mb-10 leading-relaxed">{plan.description}</p>
                
                <div className="mb-10">
                  <div className="flex items-baseline mb-4">
                    <span className="text-5xl font-extrabold gradient-text">{plan.price}</span>
                    <span className="text-gray-600 ml-3 text-xl">{plan.period}</span>
                  </div>
                  <p className="text-gray-500 text-lg">{plan.yearlyPrice}</p>
                </div>

                <button className={`w-full font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 mb-10 text-lg ${
                  index === 1 
                    ? 'gradient-primary text-black shadow-glow hover:shadow-glow' 
                    : 'bg-gray-100 hover:bg-gray-200 text-black hover:shadow-elegant'
                }`}>
                  {plan.buttonText}
                </button>
              </div>

              <div className="space-y-4">
                {plan.badge && (
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-4">
                    INCLUDES:
                  </p>
                )}
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

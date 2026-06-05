export default function AtmanirbharPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-800 to-green-600 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Atmanirbhar Campus Index™ 2027
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-100">
            India's Sustainability Benchmarking Initiative for Educational Institutions.
          </p>
          <a
            href="https://forms.gle/KUszCL7BoPgDi5vF6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-green-800 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Register Your Institution
          </a>
          <p className="mt-4 text-green-200">Assessment Period: July 2026 – March 2027</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto py-16 px-6">
        
        {/* Why Participate */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Participate?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Benchmark your institution against sustainability best practices",
              "Demonstrate leadership in Energy, Water and Waste Management",
              "Receive Atmanirbhar Grade™ and Climate Positive Score™",
              "Showcase commitment to SDGs and Net Zero readiness",
              "Build institutional reputation among students, parents and industry",
              "Become one of the Founding 25 Institutions of India"
            ].map((item, index) => (
              <div key={index} className="flex items-start bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <span className="text-green-600 font-bold text-xl mr-3">✓</span>
                <p className="text-lg">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Assessment Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Assessment Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: "⚡", title: "Energy Self-Reliance" },
              { icon: "💧", title: "Water Self-Reliance" },
              { icon: "♻️", title: "Circular Economy" },
              { icon: "🌳", title: "Biodiversity & Green Campus" },
              { icon: "🎓", title: "Student Participation" },
              { icon: "🚀", title: "Innovation & Climate Leadership" }
            ].map((cat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center border-t-4 border-green-500">
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-lg">{cat.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* What They Receive */}
        <section className="mb-16 bg-white p-8 rounded-2xl shadow-sm">
          <h2 className="text-3xl font-bold mb-8 text-center">What Participating Institutions Receive</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              "Climate Positive Score™",
              "Atmanirbhar Grade™",
              "SDG Alignment Assessment",
              "Net Zero Readiness Snapshot",
              "Public Registry Profile",
              "Annual Impact Certificate",
              "Benchmarking Report"
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="text-green-600 font-bold text-xl mr-3">✓</span>
                <p className="text-lg">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Participation Plans</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Founding 25 */}
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 relative shadow-lg">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                LIMITED
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center mt-2">Founding 25 Institutions</h3>
              <p className="text-5xl font-bold text-center text-green-700 mb-6">₹50,000</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Founding Member Recognition</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Campus Registry Profile</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Annual Assessment</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Public Listing</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Impact Certificate</li>
                <li className="flex items-center"><span className="text-green-600 mr-2">✓</span> Benchmarking Report</li>
              </ul>
              <a href="https://forms.gle/KUszCL7BoPgDi5vF

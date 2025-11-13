// src/pages/AboutPage.jsx
const AboutPage = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About E-Sports Cart</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          E-Sports Cart is your one-stop destination for premium gaming gear,
          accessories, and performance-ready equipment trusted by competitive
          players, streamers, and e-sports athletes around the world.
        </p>
      </section>

      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <img
          src="https://gaming.lenovo.com/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-00-09/csgo_2D00_gaming-accessories.jpg"
          alt="Gaming gear"
          className="rounded-xl shadow-lg w-full object-cover"
        />

        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            We started E-Sports Cart with one vision — to provide high-quality,
            battle-tested gaming gear accessible to everyone. From casual gamers
            to pro e-sports athletes, we deliver gear designed to improve your
            speed, precision, comfort, and game performance.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Gamers Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
            <p className="text-gray-700">
              We handpick only the best gaming equipment trusted by global
              e-sports professionals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold mb-3">Affordable Pricing</h3>
            <p className="text-gray-700">
              High-performance gear at student-friendly prices — because gaming
              should be for everyone.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
            <p className="text-gray-700">
              We ship with speed, ensuring your gaming setup upgrades without
              delay.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center mt-16">
        <h2 className="text-3xl font-semibold mb-4">Ready to Level Up?</h2>
        <p className="text-gray-600 mb-6">Explore our latest products today.</p>

        <a
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Shop Now
        </a>
      </section>
    </div>
  );
};

export default AboutPage;

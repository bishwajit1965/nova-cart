const CallToAction = () => {
  return (
    <section className="py-16 bg-indigo-600 text-white text-center rounded-md">
      {/* <h2 className="text-3xl font-bold mb-4">
        Interested in working with us?
      </h2> */}
      <p className="mb-6 text-lg">
        Let’s build something amazing together. Reach out today!
      </p>
      <a
        href="/contact-us"
        className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
      >
        Contact Us
      </a>
    </section>
  );
};

export default CallToAction;

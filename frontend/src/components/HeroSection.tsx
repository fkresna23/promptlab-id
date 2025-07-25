const HeroSection = () => {
  return (
    <section className="relative container mx-auto px-6 py-20 md:py-32 text-center">
      {/* Ikon Dekoratif */}
      <div className="absolute top-1/2 left-10 hidden md:block">
        <img
          src="/assets/nama-ikon-kiri.png"
          alt="Ikon Dekoratif Kiri"
          className="w-24 h-24 opacity-80"
          onError={(e) => {
            e.currentTarget.src =
              "[https://placehold.co/96x96/cccccc/FFFFFF?text=Icon](https://placehold.co/96x96/cccccc/FFFFFF?text=Icon)";
          }}
        />
      </div>
      <div className="absolute top-1/4 right-10 hidden md:block">
        <img
          src="/assets/nama-ikon-kanan.png"
          alt="Ikon Dekoratif Kanan"
          className="w-16 h-16"
          onError={(e) => {
            e.currentTarget.src =
              "[https://placehold.co/64x64/cccccc/FFFFFF?text=Icon](https://placehold.co/64x64/cccccc/FFFFFF?text=Icon)";
          }}
        />
      </div>

      {/* Konten Utama */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          The Biggest AI
          <span className="bg-gray-900 text-white rounded-xl px-4 py-2 mt-2 inline-block mx-2">
            Prompt Library
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">by God of Prompt</p>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-700">
          Discover the best AI prompts for Generative AI like ChatGPT, Claude, &
          Gemini designed to supercharge your business and boost your
          productivity.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;

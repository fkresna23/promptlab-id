import React from "react"; // useState tidak lagi dibutuhkan karena filter dihilangkan

const HeroSection = () => {
  // State untuk activeTab sudah dihapus

  return (
    <section className="relative container mx-auto px-6 py-20 md:py-32 text-center">
      {/* Ikon Dekoratif (menggunakan gambar lokal dari langkah sebelumnya) */}
      <div className="absolute top-1/2 left-10 hidden md:block">
        {/* Pastikan nama file ini sesuai dengan file Anda di public/assets/ */}
        <img
          src="/assets/nama-ikon-kiri.png"
          alt="Ikon Dekoratif Kiri"
          className="w-24 h-24 opacity-80"
        />
      </div>
      <div className="absolute top-1/4 right-10 hidden md:block">
        {/* Pastikan nama file ini sesuai dengan file Anda di public/assets/ */}
        <img
          src="/assets/nama-ikon-kanan.png"
          alt="Ikon Dekoratif Kanan"
          className="w-16 h-16"
        />
      </div>

      {/* Konten Utama */}
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Katalog Terbesar
          <span className="block bg-gray-900 text-white rounded-xl px-4 py-2 mt-2 inline-block mx-2">
            Perpustakaan Prompt AI
          </span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">PromptLab-ID</p>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-700">
          Temukan prompt AI terbaik untuk ChatGPT, Claude, Gemini, Deepeek, dll.
          Dirancang untuk meningkatkan kinerja bisnis & produktivitas Anda.
        </p>
      </div>

      {/* --- PERUBAHAN DI SINI --- */}
      {/* Bagian Filter Tabs telah dihapus seluruhnya untuk menyederhanakan fokus */}
    </section>
  );
};

export default HeroSection;

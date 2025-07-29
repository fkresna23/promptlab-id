const MyProductsPage = () => {
  return (
    <div className="container mx-auto px-6 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">My Products</h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-lg text-gray-600">
          Anda belum memiliki produk apa pun.
        </p>
        {/* Nanti, daftar produk yang dibeli akan muncul di sini */}
      </div>
    </div>
  );
};

export default MyProductsPage;

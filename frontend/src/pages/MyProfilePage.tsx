import React from "react";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface MyProfilePageProps {
  userInfo: UserInfo | null;
}

const MyProfilePage: React.FC<MyProfilePageProps> = ({ userInfo }) => {
  if (!userInfo) {
    return (
      <div className="text-center py-16">
        Silakan login untuk melihat profil Anda.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nama
          </label>
          <p className="text-lg">{userInfo.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <p className="text-lg">{userInfo.email}</p>
        </div>
        {/* Di sini nanti kita bisa menambahkan fungsionalitas untuk mengubah password, dll. */}
      </div>
    </div>
  );
};

export default MyProfilePage;

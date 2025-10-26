import React, { useState } from "react";
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { FaPhoneAlt, FaUserMd } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const ProfileSettings = () => {
  const [profileImage, setProfileImage] = useState("https://i.ibb.co/FwM9x5L/user-avatar.png");
  const [name, setName] = useState("Dr. Apurba Roy");
  const [email, setEmail] = useState("apurba@example.com");
  const [phone, setPhone] = useState("+880123456789");
  const [profession, setProfession] = useState("Cardiologist");

  React.useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert("✅ Profile Updated Successfully!");
  };

  return (
    <div className="min-h-screen bg-base-100 px-6 py-10 font-[Poppins]">
      <div
        data-aos="fade-up"
        className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-blue-100"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          👤 Profile Settings
        </h2>

        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-md object-cover"
            />
            <label
              htmlFor="imageUpload"
              className="absolute bottom-0 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
            >
              <AiOutlineUser className="text-xl" />
            </label>
            <input
              type="file"
              id="imageUpload"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <p className="mt-3 text-blue-600 font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{profession}</p>
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label font-semibold">Full Name</label>
              <div className="relative">
                <AiOutlineUser className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label font-semibold">Email</label>
              <div className="relative">
                <AiOutlineMail className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label font-semibold">Phone</label>
              <div className="relative">
                <FaPhoneAlt className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input input-bordered w-full pl-10"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label font-semibold">Profession</label>
              <div className="relative">
                <FaUserMd className="absolute top-3 left-3 text-gray-400 text-lg" />
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="select select-bordered w-full pl-10"
                >
                  <option>Cardiologist</option>
                  <option>Neurologist</option>
                  <option>Dermatologist</option>
                  <option>Surgeon</option>
                  <option>Pediatrician</option>
                </select>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div
            data-aos="fade-up"
            className="mt-10 border-t border-blue-200 pt-6"
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              🔐 Change Password
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">Current Password</label>
                <div className="relative">
                  <AiOutlineLock className="absolute top-3 left-3 text-gray-400 text-lg" />
                  <input
                    type="password"
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">New Password</label>
                <div className="relative">
                  <AiOutlineLock className="absolute top-3 left-3 text-gray-400 text-lg" />
                  <input
                    type="password"
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <AiOutlineLock className="absolute top-3 left-3 text-gray-400 text-lg" />
                  <input
                    type="password"
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button type="submit" className="btn bg-blue-600 hover:bg-blue-700 text-white px-10">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;

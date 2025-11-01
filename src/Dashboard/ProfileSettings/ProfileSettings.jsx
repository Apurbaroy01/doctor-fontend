import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineLock,
} from "react-icons/ai";
import { FaPhoneAlt, FaUserMd } from "react-icons/fa";
import useAuth from "../../Hook/useAuth";
import { updatePassword, updateProfile } from "firebase/auth";
import axios from "axios";

const ProfileSettings = () => {
  const { user } = useAuth();
  const [previewImage, setPreviewImage] = useState("");

  const { register, handleSubmit, reset, formState: { errors }, } = useForm();

  // Profile Image Preview
  const handleImageChange = async(e) => {
    const file = e.target.files[0];

    const tempUrl = URL.createObjectURL(file);
    setPreviewImage(tempUrl);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "https://api.imgbb.com/1/upload?key=3e6bb97e2f9920f1db504fde9535a137",
        formData
      );
      const imageUrl = res.data?.data?.display_url;
      console.log(imageUrl)
      if (imageUrl) setPreviewImage(imageUrl);
    } catch (err) {
      console.error("Image upload error:", err);
    }
  };

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      // Update display name and photo in Firebase
      await updateProfile(user, {
        displayName: data.name,
        photoURL: previewImage 
      });

      // Change password if provided
      if (data.newPassword && data.newPassword === data.confirmPassword) {
        await updatePassword(user, data.newPassword);
      }

      alert("✅ Profile Updated Successfully!");
      reset();
    } catch (error) {
      alert("❌ " + error.message);
    }
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
              src={previewImage || user?.photoURL}
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
          <p className="mt-3 text-blue-600 font-semibold">{user?.displayName}</p>
          <p className="text-sm text-gray-500">{user?.profession || "Doctor"}</p>
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="form-control">
              <label className="label font-semibold">Full Name</label>
              <div className="relative">
                <AiOutlineUser className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  {...register("name", { required: true })}
                  className="input input-bordered w-full pl-10"
                  placeholder="Full Name"
                  defaultValue={user?.displayName}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">Name is required</p>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label font-semibold">Email</label>
              <div className="relative">
                <AiOutlineMail className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  defaultValue={user?.email}
                  disabled
                  className="input input-bordered w-full pl-10 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label font-semibold">Phone</label>
              <div className="relative">
                <FaPhoneAlt className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  {...register("phone")}
                  className="input input-bordered w-full pl-10"
                  placeholder="+880..."
                />
              </div>
            </div>

            {/* Profession */}
            <div className="form-control">
              <label className="label font-semibold">Profession</label>
              <div className="relative">
                <FaUserMd className="absolute top-3 left-3 text-gray-400 text-lg" />
                <select
                  {...register("profession")}
                  className="select select-bordered w-full pl-10"
                >
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Surgeon">Surgeon</option>
                  <option value="Pediatrician">Pediatrician</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="mt-10 border-t border-blue-200 pt-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              🔐 Change Password
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">New Password</label>
                <div className="relative">
                  <AiOutlineLock className="absolute top-3 left-3 text-gray-400 text-lg" />
                  <input
                    type="password"
                    {...register("newPassword")}
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
                    {...register("confirmPassword")}
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              type="submit"
              className="btn bg-blue-600 hover:bg-blue-700 text-white px-10"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;

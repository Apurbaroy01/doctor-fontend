import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    FaUser,
    FaCalendarAlt,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaMoneyBill,
    FaSearch,
} from "react-icons/fa";

const AppointmentForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [trackingId, setTrackingId] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // AOS Animation
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // Random appointment ID
    const generateTrackingId = () => {
        const randomId = "APT-" + Math.random().toString(36).substr(2, 8).toUpperCase();
        setTrackingId(randomId);
        return randomId;
    };

    const onSubmit = (data) => {
        const id = generateTrackingId();
        const appointmentData = { ...data, trackingId: id };
        setAppointments([...appointments, appointmentData]);
        reset();
        setShowModal(false);
    };

    // Filter appointments
    const filteredAppointments = appointments.filter(
        (apt) =>
            apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.trackingId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 font-[Poppins] px-4 py-8">
            <div
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl mx-auto"
                data-aos="zoom-in"
            >
                <h2
                    className="text-3xl font-bold text-center text-blue-700 mb-8"
                    data-aos="fade-up"
                >
                    Doctor Appointment System
                </h2>

                {/* Top Section: Search + Button */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-1/2">
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by Name or Tracking ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full pl-10"
                        />
                    </div>

                    {/* Open Modal Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-primary rounded-full px-6"
                    >
                        + Book New Appointment
                    </button>
                </div>

                {/* Appointment Table */}
                {appointments.length > 0 ? (
                    <div className="overflow-x-auto mt-6" data-aos="fade-up">
                        <table className="table table-zebra w-full text-center">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Address</th>
                                    <th>Mobile</th>
                                    <th>Payment</th>
                                    <th>Tracking ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((apt, index) => (
                                        <tr key={apt.trackingId}>
                                            <td>{index + 1}</td>
                                            <td>{apt.name}</td>
                                            <td>{apt.age}</td>
                                            <td>{apt.date}</td>
                                            <td>{apt.time}</td>
                                            <td>{apt.address}</td>
                                            <td>{apt.mobile}</td>
                                            <td>{apt.payment}</td>
                                            <td className="font-semibold text-blue-700">{apt.trackingId}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="py-6 text-gray-500">
                                            No matching appointments found 😔
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 mt-6">
                        No appointments yet. Click “Book New Appointment” to add one.
                    </p>
                )}
            </div>

            {/* DaisyUI Modal */}
            {showModal && (
                <dialog open className="modal">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-xl text-blue-600 mb-4">
                            Book a Doctor Appointment
                        </h3>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {/* Name */}
                            <label className="input input-bordered flex items-center gap-2 col-span-1">
                                <FaUser className="text-blue-600" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    {...register("name", { required: true })}
                                    className="grow"
                                />
                            </label>
                            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}

                            {/* Age */}
                            <label className="input input-bordered flex items-center gap-2 col-span-1">
                                <span className="font-semibold">Age:</span>
                                <input
                                    type="number"
                                    placeholder="Your Age"
                                    {...register("age", { required: true, min: 1 })}
                                    className="grow"
                                />
                            </label>
                            {errors.age && <p className="text-red-500 text-sm">Valid age required</p>}

                            {/* Date */}
                            <label className="input input-bordered flex items-center gap-2 col-span-1">
                                <FaCalendarAlt className="text-blue-600" />
                                <input
                                    type="date"
                                    {...register("date", { required: true })}
                                    className="grow"
                                />
                            </label>

                            {/* Time */}
                            <label className="input input-bordered flex items-center gap-2 col-span-1">
                                <FaCalendarAlt className="text-blue-600" />
                                <input
                                    type="time"
                                    {...register("time", { required: true })}
                                    className="grow"
                                />
                            </label>

                            {/* Address */}
                            <label className="input input-bordered flex items-center gap-2 col-span-2">
                                <FaMapMarkerAlt className="text-blue-600" />
                                <input
                                    type="text"
                                    placeholder="Your Address"
                                    {...register("address", { required: true })}
                                    className="grow"
                                />
                            </label>

                            {/* Mobile */}
                            <label className="input input-bordered flex items-center gap-2 col-span-1">
                                <FaPhoneAlt className="text-blue-600" />
                                <input
                                    type="tel"
                                    placeholder="Mobile Number"
                                    {...register("mobile", {
                                        required: true,
                                        pattern: /^[0-9]{10,15}$/,
                                    })}
                                    className="grow"
                                />
                            </label>

                            {/* Payment */}
                            <label className="input input-bordered flex items-center gap-2 col-span-1">
                                <FaMoneyBill className="text-green-600" />
                                <input
                                    type="text"
                                    placeholder="Payment Method (e.g. Bkash/Nagad)"
                                    {...register("payment", { required: true })}
                                    className="grow"
                                />
                            </label>

                            {/* Buttons */}
                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Confirm Appointment
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button onClick={() => setShowModal(false)}>close</button>
                    </form>
                </dialog>
            )}
        </section>
    );
};

export default AppointmentForm;

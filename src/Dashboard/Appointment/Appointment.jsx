import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaFilePrescription, FaSearch } from "react-icons/fa";
import useAxios from "../../Hook/useAxios";
import { Link } from "react-router-dom";

const AppointmentForm = () => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    // ✅ Patient search (by mobile number)
    const handleSearch = async (value) => {
        setQuery(value);

        if (value.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.get(`/patients/search?q=${value}`);
            setResults(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Auto-fill form after patient select
    const handleSelect = (patient) => {
        setResults([]);
        setQuery(patient.mobile || "");
        // react-hook-form এর ফিল্ডগুলো অটো ফিল করা
        setValue("mobile", patient.mobile || "");
        setValue("name", patient.name || "");
        setValue("age", patient.age || "");
        setValue("address", patient.address || "");
        setValue("payment", patient.payment || "");
    };

    // ✅ Generate time slots
    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 10) {
            const period = hour < 12 ? "AM" : "PM";
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const formattedMinute = minute.toString().padStart(2, "0");
            timeSlots.push(`${displayHour}:${formattedMinute} ${period}`);
        }
    }

    // ✅ Fetch all appointments
    const { data: appointments = [], isLoading, refetch } = useQuery({
        queryKey: ["appointments"],
        queryFn: async () => {
            const res = await axiosInstance.get("/appointments");
            return res.data;
        },
    });

    // ✅ Fetch booked times
    const { data: bookedAppointments = [] } = useQuery({
        queryKey: ["bookedTimes", selectedDate],
        queryFn: async () => {
            if (!selectedDate) return [];
            const res = await axiosInstance.get(`/appointments?date=${selectedDate}`);
            return res.data;
        },
        enabled: !!selectedDate,
    });

    const bookedTimes = bookedAppointments.map((apt) => apt.time);

    // ✅ Add appointment
    const addAppointment = useMutation({
        mutationFn: async (newAppointment) =>
            await axiosInstance.post(`/appointments`, newAppointment),
        onSuccess: () => {
            queryClient.invalidateQueries(["appointments"]);
            queryClient.invalidateQueries(["bookedTimes"]);
            reset();
            refetch();
            setShowModal(false);
            setSelectedDate("");
            setSelectedTime("");
        },
    });

    // ✅ Update appointment status
    const updateStatus = useMutation({
        mutationFn: async ({ id, status }) =>
            await axiosInstance.patch(`/appointments/${id}`, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(["appointments"]);
            refetch();
        },
    });

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // ✅ Form submit
    const onSubmit = (data) => {
        if (!selectedDate || !selectedTime) {
            alert("Please select a date and time!");
            return;
        }

        const newAppointment = {
            ...data,
            date: selectedDate,
            time: selectedTime,
        };

        addAppointment.mutate(newAppointment);
    };

    // ✅ Search filter (for main table)
    const filteredAppointments = appointments.filter(
        (apt) =>
            apt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.trackingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading)
        return <p className="text-center mt-10">Loading appointments...</p>;

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

                {/* Search + Add Button */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div className="relative w-full md:w-1/2">
                        <FaSearch className="absolute left-3 top-3 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by Name, Tracking ID or Mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input input-bordered w-full pl-10"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setShowModal(true);
                            reset();
                            setQuery("");
                            setResults([]);
                        }}
                        className="btn btn-primary rounded-full px-6"
                    >
                        + Book New Appointment
                    </button>
                </div>

                {/* Appointment Table */}
                {filteredAppointments.length > 0 ? (
                    <div className="overflow-x-auto mt-6" data-aos="fade-up">
                        <table className="table table-zebra w-full text-center">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Time</th>
                                    <th>Address</th>
                                    <th>Mobile</th>
                                    <th>Payment</th>
                                    <th>Tracking ID</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.map((apt, index) => (
                                    <tr key={apt._id}>
                                        <td>{index + 1}</td>
                                        <td>{apt.name}</td>
                                        <td>{apt.age}</td>
                                        <td>{apt.time}</td>
                                        <td>{apt.address}</td>
                                        <td>{apt.mobile}</td>
                                        <td>{apt.payment}</td>
                                        <td className="text-blue-700">{apt.trackingId}</td>
                                        <td>
                                            <select
                                                defaultValue={apt.status || "Pending"}
                                                onChange={(e) =>
                                                    updateStatus.mutate({
                                                        id: apt._id,
                                                        status: e.target.value,
                                                    })
                                                }
                                                className={
                                                    apt.status === "Completed"
                                                        ? "text-teal-500"
                                                        : "text-gray-700"
                                                }
                                            >
                                                <option>Pending</option>
                                                <option>Completed</option>
                                            </select>
                                        </td>
                                        <td>
                                            <Link
                                                to={`${apt._id}`}
                                                className="btn btn-sm btn-error text-xl text-white bg-red-400"
                                            >
                                                <FaFilePrescription />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 mt-6">
                        No appointments found 😔
                    </p>
                )}
            </div>

            {/* ✅ Modal */}
            {showModal && (
                <dialog open className="modal">
                    <div className="modal-box max-w-3xl bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-xl rounded-2xl">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="text-2xl font-semibold text-blue-700 flex items-center gap-2">
                                🩺 Book a Doctor Appointment
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn btn-sm btn-circle btn-outline hover:bg-blue-100"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* 🔍 Mobile Search Field */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Search by Mobile Number
                                </label>
                                <input
                                    {...register("mobile", { required: true })}
                                    placeholder="Enter Mobile Number..."
                                    value={query}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="input input-bordered w-full pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                                />
                                {loading && (
                                    <span className="absolute right-3 top-3 text-blue-500 text-sm">
                                        Searching...
                                    </span>
                                )}

                                {/* Search Results */}
                                {results.length > 0 && (
                                    <ul className="absolute bg-white border border-gray-200 shadow-md rounded-md mt-2 w-full z-10 max-h-56 overflow-y-auto">
                                        {results.map((p) => (
                                            <li
                                                key={p._id}
                                                onClick={() => handleSelect(p)}
                                                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-700"
                                            >
                                                <b>{p.name}</b> — {p.mobile}
                                                <span className="text-sm text-gray-500 ml-2">
                                                    {p.patientId || "N/A"}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* 🧍 Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        {...register("name", { required: true })}
                                        placeholder="Patient Name"
                                        className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Age
                                    </label>
                                    <input
                                        {...register("age", { required: true })}
                                        type="number"
                                        placeholder="Age"
                                        className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            {/* 📅 Date Picker */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Appointment Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
                                    required
                                />
                            </div>

                            {/* ⏰ Time Slots */}
                            {selectedDate && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                        Select Time Slot
                                    </h4>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                                        {timeSlots.map((time) => {
                                            const isBooked = bookedTimes.includes(time);
                                            return (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    disabled={isBooked}
                                                    onClick={() => !isBooked && setSelectedTime(time)}
                                                    className={`btn btn-sm rounded-lg ${isBooked
                                                            ? "btn-disabled bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : selectedTime === time
                                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                                : "btn-outline hover:bg-blue-100"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 🏠 Address + 💰 Payment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Address
                                    </label>
                                    <input
                                        {...register("address", { required: true })}
                                        placeholder="Patient Address"
                                        className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Payment (BDT)
                                    </label>
                                    <input
                                        {...register("payment", { required: true })}
                                        placeholder="Payment Amount"
                                        className="input input-bordered w-full focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>

                            {/* ⚡ Buttons */}
                            <div className="flex justify-end gap-3 mt-6 border-t pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-outline border-gray-400 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                                >
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

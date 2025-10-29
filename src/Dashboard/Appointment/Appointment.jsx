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
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-xl text-blue-600 mb-4">
                            Book a Doctor Appointment
                        </h3>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {/* Mobile search field */}
                            <input
                                {...register("mobile", { required: true })}
                                placeholder="Enter Mobile Number"
                                className="input input-bordered col-span-1"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                            />

                            {/* Search Results */}
                            <div className="col-span-2">
                                {loading && (
                                    <p className="text-sm text-gray-500 mt-1">Searching...</p>
                                )}
                                {results.length > 0 && (
                                    <ul className="menu bg-base-200 mt-2 rounded-box shadow-md">
                                        {results.map((p) => (
                                            <li key={p._id} onClick={() => handleSelect(p)}>
                                                <a>
                                                    {p.patientId || "N/A"} - {p.name} ({p.mobile})
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <input
                                {...register("name", { required: true })}
                                placeholder="Full Name"
                                className="input input-bordered col-span-1"
                            />
                            <input
                                {...register("age", { required: true })}
                                type="number"
                                placeholder="Age"
                                className="input input-bordered col-span-1"
                            />

                            {/* Date Picker */}
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="input input-bordered col-span-2"
                                required
                            />

                            {/* Time Slots */}
                            {selectedDate && (
                                <div className="col-span-2">
                                    <h4 className="font-semibold mt-1 mb-2 text-gray-700">
                                        Select Time Slot:
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
                                                    className={`btn btn-sm rounded-md ${isBooked
                                                            ? "btn-disabled bg-gray-300 text-gray-500 cursor-not-allowed"
                                                            : selectedTime === time
                                                                ? "btn-primary text-white"
                                                                : "btn-outline"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <input
                                {...register("address", { required: true })}
                                placeholder="Address"
                                className="input input-bordered col-span-2"
                            />

                            <input
                                {...register("payment", { required: true })}
                                placeholder="Payment BDT"
                                className="input input-bordered col-span-1"
                            />

                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Confirm
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

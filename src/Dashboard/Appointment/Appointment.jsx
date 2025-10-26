import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaSearch, FaTrash } from "react-icons/fa";
import useAxios from "../../Hook/useAxios";
import Swal from "sweetalert2";

const AppointmentForm = () => {
    const { register, handleSubmit, reset } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const axiosInstance = useAxios();
    const queryClient = useQueryClient();

    // আজকের তারিখ (Asia/Dhaka) -> "YYYY-MM-DD"
    const todayDate = useMemo(() => {
        return new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Dhaka",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(new Date());
    }, []);

    // 12-ঘণ্টা টাইম স্লট (প্রতি 10 মিনিট)
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const period = hour < 12 ? "AM" : "PM";
                const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                const formattedMinute = minute.toString().padStart(2, "0");
                slots.push(`${displayHour}:${formattedMinute} ${period}`);
            }
        }
        return slots;
    }, []);

    // ✅ আজকের সব অ্যাপয়েন্টমেন্ট (server-side date filter)
    const {
        data: appointments = [],
        isLoading,
        isError: isAllError,
        error: allError,
    } = useQuery({
        queryKey: ["appointments", todayDate, searchTerm],
        queryFn: async () => {
            const q = searchTerm.trim();
            const url = q
                ? `/appointments?date=${todayDate}&q=${encodeURIComponent(q)}`
                : `/appointments?date=${todayDate}`;
            const res = await axiosInstance.get(url);
            return res.data;
        },
        refetchOnWindowFocus: true,
    });

    // ✅ নির্বাচিত তারিখের বুকড টাইম (টাইমস্লট ব্লক)
    const {
        data: bookedAppointments = [],
        isFetching: isFetchingBooked,
        isError: isBookedError,
        error: bookedError,
    } = useQuery({
        queryKey: ["bookedTimes", selectedDate],
        queryFn: async () => {
            if (!selectedDate) return [];
            const res = await axiosInstance.get(`/appointments?date=${selectedDate}`);
            return res.data;
        },
        enabled: !!selectedDate,
    });

    const bookedTimes = (bookedAppointments || []).map((apt) => apt.time);

    // ✅ বুকিং
    const addAppointment = useMutation({
        mutationFn: async (newAppointment) =>
            await axiosInstance.post(`/appointments`, newAppointment),
        onMutate: async () => {
            Swal.fire({
                title: "Booking...",
                text: "Please wait while we confirm your appointment.",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });
        },
        onSuccess: (_, vars) => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            queryClient.invalidateQueries({ queryKey: ["bookedTimes"] });
            reset();
            setShowModal(false);
            setSelectedDate("");
            setSelectedTime("");
            Swal.fire({
                icon: "success",
                title: "Appointment booked!",
                html: `<div style="font-size:14px">Your tracking ID:<br/><b>${vars?.trackingId || "N/A"}</b></div>`,
                confirmButtonText: "Great",
            });
        },
        onError: (err) => {
            Swal.fire({
                icon: "error",
                title: "Booking failed",
                text:
                    err?.response?.data?.message ||
                    err?.message ||
                    "Something went wrong while booking.",
            });
        },
    });

    // ✅ ডিলিট
    const deleteAppointment = useMutation({
        mutationFn: async (id) => await axiosInstance.delete(`/appointments/${id}`),
        onMutate: async () => {
            Swal.fire({
                title: "Deleting...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            Swal.fire({
                icon: "success",
                title: "Deleted",
                timer: 1200,
                showConfirmButton: false,
            });
        },
        onError: (err) => {
            Swal.fire({
                icon: "error",
                title: "Delete failed",
                text:
                    err?.response?.data?.message ||
                    err?.message ||
                    "Could not delete the appointment.",
            });
        },
    });

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // ✅ সাবমিট
    const onSubmit = (data) => {
        if (!selectedDate || !selectedTime) {
            Swal.fire({
                icon: "warning",
                title: "Select date & time",
                text: "Please choose a date and an available time slot.",
            });
            return;
        }
        if (bookedTimes.includes(selectedTime)) {
            Swal.fire({
                icon: "error",
                title: "Time slot already booked",
                text: "Please pick another time.",
            });
            return;
        }
        const randomId =
            "APT-" + Math.random().toString(36).substr(2, 8).toUpperCase();
        const newAppointment = {
            ...data,
            date: selectedDate,
            time: selectedTime,
            trackingId: randomId,
        };
        addAppointment.mutate(newAppointment);
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 font-[Poppins] px-4 py-8">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl mx-auto" data-aos="zoom-in">
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-8" data-aos="fade-up">
                    Doctor Appointment System
                </h2>

                {/* Search + Add Button */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
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
                    <button onClick={() => setShowModal(true)} className="btn btn-primary rounded-full px-6">
                        + Book New Appointment
                    </button>
                </div>

                {/* Appointment Table (today only) */}
                {isLoading ? (
                    <p className="text-center mt-10">Loading appointments...</p>
                ) : (appointments || []).length > 0 ? (
                    <div className="overflow-x-auto mt-6" data-aos="fade-up">
                        <div className="mb-3 text-sm text-gray-600">
                            Showing appointments for <b>{todayDate}</b> (Asia/Dhaka)
                        </div>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((apt, index) => (
                                    <tr key={apt._id || index}>
                                        <td>{index + 1}</td>
                                        <td>{apt.name}</td>
                                        <td>{apt.age}</td>
                                        <td>{apt.date}</td>
                                        <td>{apt.time}</td>
                                        <td>{apt.address}</td>
                                        <td>{apt.mobile}</td>
                                        <td>{apt.payment}</td>
                                        <td className="font-semibold text-blue-700">{apt.trackingId}</td>
                                        <td>
                                            <button
                                                onClick={async () => {
                                                    const res = await Swal.fire({
                                                        title: "Delete this appointment?",
                                                        text: "This action cannot be undone.",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonText: "Yes, delete",
                                                        cancelButtonText: "Cancel",
                                                    });
                                                    if (res.isConfirmed) deleteAppointment.mutate(apt._id);
                                                }}
                                                className="btn btn-sm btn-error text-white"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 mt-6">No appointments found for today 😔</p>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <dialog open className="modal">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-xl text-blue-600 mb-4">Book a Doctor Appointment</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input {...register("name", { required: true })} placeholder="Full Name" className="input input-bordered col-span-1" />
                            <input {...register("age", { required: true, valueAsNumber: true })} type="number" placeholder="Age" className="input input-bordered col-span-1" min={0} />
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input input-bordered col-span-2" required />
                            {selectedDate && (
                                <div className="col-span-2">
                                    <h4 className="font-semibold mt-1 mb-2 text-gray-700">Select Time Slot:</h4>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                                        {timeSlots.map((time) => {
                                            const isBooked = bookedTimes.includes(time);
                                            const isSelected = selectedTime === time;
                                            return (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    disabled={isBooked || isFetchingBooked}
                                                    onClick={() => !isBooked && setSelectedTime(time)}
                                                    className={`btn btn-sm rounded-md ${isBooked ? "btn-disabled bg-gray-300 text-gray-500 cursor-not-allowed" : isSelected ? "btn-primary text-white" : "btn-outline"}`}
                                                    title={isBooked ? "Already booked" : "Select this time"}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            <input {...register("address", { required: true })} placeholder="Address" className="input input-bordered col-span-2" />
                            <input {...register("mobile", { required: true })} placeholder="Mobile" className="input input-bordered col-span-1" />
                            <input {...register("payment", { required: true })} placeholder="Payment Method" className="input input-bordered col-span-1" />
                            <div className="col-span-2 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Confirm</button>
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

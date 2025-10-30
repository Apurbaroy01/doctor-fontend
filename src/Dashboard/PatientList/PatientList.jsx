import React, { useEffect, useState } from "react";
import {
    FaUserInjured,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaEye,
    FaSearch,
} from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../Hook/useAxios";
import { isSameDay, parseISO, format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const PatientList = () => {
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const axiosSecure = useAxios();
    const queryClient = useQueryClient();
    const patientsPerPage = 10;

    // ✅ Fetch patients
    const { data: patients = [], isLoading } = useQuery({
        queryKey: ["appointmentsList"],
        queryFn: async () => {
            const res = await axiosSecure.get("/appointmentsList");
            return res.data;
        },
    });

    // ✅ Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await axiosSecure.delete(`/appointments/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["appointmentsList"]);
            toast.success("Patient deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete patient");
        },
    });

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // ✅ Search + Date filter
    useEffect(() => {
        const result = patients.filter((p) => {
            const matchesSearch =
                p.name?.toLowerCase().includes(search.toLowerCase()) ||
                p.address?.toLowerCase().includes(search.toLowerCase()) ||
                p.mobile?.includes(search);

            const matchesDate = selectedDate
                ? isSameDay(parseISO(p.date), parseISO(selectedDate))
                : true;

            return matchesSearch && matchesDate;
        });
        setFilteredPatients(result);
        setCurrentPage(1);
    }, [search, selectedDate, patients]);

    const handleDelete = (id) => deleteMutation.mutate(id);

    // ✅ Pagination Logic
    const indexOfLast = currentPage * patientsPerPage;
    const indexOfFirst = indexOfLast - patientsPerPage;
    const currentPatients = filteredPatients.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-[Poppins] px-4 py-8">
            <div
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl mx-auto"
                data-aos="zoom-in"
            >
                <ToastContainer position="top-center" autoClose={1500} />

                <h2
                    className="text-3xl font-bold text-blue-700 flex items-center gap-2 mb-6"
                    data-aos="fade-down"
                >
                    <FaUserInjured className="text-4xl text-blue-600" />
                    All Patients
                </h2>

                {/* 🔍 Search + Date Filter */}
                <div className="flex flex-col md:flex-row gap-3 mb-6 items-center" data-aos="fade-right">
                    <div className="flex items-center gap-2 border border-blue-300 rounded-full px-4 py-2 w-full md:w-1/2 bg-blue-50">
                        <FaSearch className="text-blue-600" />
                        <input
                            type="text"
                            placeholder="Search by name, address, or mobile..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent focus:outline-none w-full"
                        />
                    </div>

                    <div className="flex items-center gap-2 border border-blue-300 rounded-full px-4 py-2 w-full md:w-1/3 bg-blue-50">
                        <FaCalendarAlt className="text-blue-600" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent focus:outline-none w-full"
                        />
                    </div>
                </div>

                {/* ✅ Main Table */}
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner loading-lg text-blue-600"></span>
                    </div>
                ) : filteredPatients.length === 0 ? (
                    <div className="text-center py-10 text-gray-600 text-lg">No patients found.</div>
                ) : (
                    <>
                        <div className="overflow-x-auto mb-10" data-aos="fade-up">
                            <table className="table table-zebra w-full">
                                <thead className="bg-blue-600 text-white">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th><FaPhoneAlt className="inline-block mr-1" /> Mobile</th>
                                        <th><FaMapMarkerAlt className="inline-block mr-1" /> Address</th>
                                        <th><FaCalendarAlt className="inline-block mr-1" /> Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentPatients.map((p, index) => (
                                        <tr key={p._id || index} className="hover:bg-blue-50 transition-all duration-200">
                                            <td>{indexOfFirst + index + 1}</td>
                                            <td className="font-semibold">{p.name}</td>
                                            <td>{p.age}</td>
                                            <td>{p.mobile}</td>
                                            <td>{p.address}</td>
                                            <td>{format(parseISO(p.date), "MMMM dd, yyyy")}</td>
                                            <td className="flex gap-2">
                                                <Link to={`${p._id}/${p.name}`}
                                                    className="btn btn-sm btn-outline btn-primary flex items-center gap-1">
                                                    <FaEye /> View
                                                </Link
                                                >
                                                <button
                                                    onClick={() => handleDelete(p._id)}
                                                    disabled={deleteMutation.isLoading}
                                                    className="btn btn-sm btn-outline btn-error flex items-center gap-1"
                                                >
                                                    <FaDeleteLeft /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ✅ Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`btn btn-sm ${currentPage === i + 1
                                            ? "bg-blue-600 text-white"
                                            : "btn-outline btn-primary"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default PatientList;

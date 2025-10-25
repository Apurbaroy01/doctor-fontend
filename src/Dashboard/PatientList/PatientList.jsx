import React, { useEffect, useState } from "react";
import {
    FaUserInjured,
    FaPhoneAlt,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaEye,
    FaSearch,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

const PatientList = () => {
    const [search, setSearch] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([]);

    const patients = [
        { id: 1, name: "John Doe", age: 34, mobile: "01710000001", address: "Dhaka", date: "2025-10-20" },
        { id: 2, name: "Jane Smith", age: 28, mobile: "01710000002", address: "Chittagong", date: "2025-10-18" },
        { id: 3, name: "Ali Hasan", age: 45, mobile: "01710000003", address: "Rajshahi", date: "2025-10-22" },
        { id: 4, name: "Nusrat Jahan", age: 30, mobile: "01710000004", address: "Khulna", date: "2025-10-21" },
        { id: 5, name: "Rahim Uddin", age: 52, mobile: "01710000005", address: "Sylhet", date: "2025-10-19" },
        { id: 6, name: "Karim Ali", age: 39, mobile: "01710000006", address: "Barisal", date: "2025-10-23" },
        { id: 7, name: "Mitu Akter", age: 26, mobile: "01710000007", address: "Rangpur", date: "2025-10-25" },
        { id: 8, name: "Sakib Khan", age: 31, mobile: "01710000008", address: "Gazipur", date: "2025-10-17" },
        { id: 9, name: "Rafi Ahmed", age: 40, mobile: "01710000009", address: "Narsingdi", date: "2025-10-16" },
        { id: 10, name: "Tania Rahman", age: 29, mobile: "01710000010", address: "Comilla", date: "2025-10-24" },
    ];

    // ✅ AOS Initialize
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        setFilteredPatients(patients);
    }, []);

    // ✅ Search filter logic
    useEffect(() => {
        const result = patients.filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.address.toLowerCase().includes(search.toLowerCase()) ||
                p.mobile.includes(search)
        );
        setFilteredPatients(result);
    }, [search]);

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-[Poppins] px-4 py-8">
            <div
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl mx-auto"
                data-aos="zoom-in"
            >
                {/* Title */}
                <h2
                    className="text-3xl font-bold text-blue-700 flex items-center gap-2 mb-6"
                    data-aos="fade-down"
                >
                    <FaUserInjured className="text-4xl text-blue-600" />
                    All Patients
                </h2>

                {/* 🔍 Search Bar */}
                <div
                    className="flex items-center gap-2 mb-6 border border-blue-300 rounded-full px-4 py-2 w-full md:w-1/2 bg-blue-50"
                    data-aos="fade-right"
                >
                    <FaSearch className="text-blue-600" />
                    <input
                        type="text"
                        placeholder="Search by name, address, or mobile..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent focus:outline-none w-full"
                    />
                </div>

                {/* 🩺 Patient Table */}
                <div className="overflow-x-auto" data-aos="fade-up">
                    <table className="table table-zebra w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>
                                    <FaPhoneAlt className="inline-block mr-1" /> Mobile
                                </th>
                                <th>
                                    <FaMapMarkerAlt className="inline-block mr-1" /> Address
                                </th>
                                <th>
                                    <FaCalendarAlt className="inline-block mr-1" /> Date
                                </th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((p, index) => (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-blue-50 transition-all duration-200"
                                        data-aos="fade-up"
                                    >
                                        <td>{index + 1}</td>
                                        <td className="font-semibold">{p.name}</td>
                                        <td>{p.age}</td>
                                        <td>{p.mobile}</td>
                                        <td>{p.address}</td>
                                        <td>{p.date}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline btn-primary flex items-center gap-1">
                                                <FaEye /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">
                                        No patients found 😔
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export default PatientList;

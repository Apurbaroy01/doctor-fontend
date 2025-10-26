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
import useAxios from "../../Hook/useAxios";

const PatientList = () => {
    const axiosInstance = useAxios();

    // UI state
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errMsg, setErrMsg] = useState("");

    // AOS init
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    // debounce search (400ms)
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
        return () => clearTimeout(t);
    }, [search]);

    // fetch patients (on mount + when debounced search changes)
    useEffect(() => {
        let alive = true;
        async function fetchPatients() {
            try {
                setLoading(true);
                setErrMsg("");
                const res = await axiosInstance.get("/patients", {
                    params: debouncedSearch ? { q: debouncedSearch } : {},
                });
                if (!alive) return;
                setPatients(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                if (!alive) return;
                setErrMsg(err?.response?.data?.message || err?.message || "Failed to load patients");
                setPatients([]);
            } finally {
                if (alive) setLoading(false);
            }
        }
        fetchPatients();
        return () => {
            alive = false;
        };
    }, [axiosInstance, debouncedSearch]);

    return (
        <section className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-[Poppins] px-4 py-8">
            <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-6xl mx-auto" data-aos="zoom-in">
                {/* Title */}
                <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2 mb-6" data-aos="fade-down">
                    <FaUserInjured className="text-4xl text-blue-600" />
                    All Patients
                </h2>

                {/* Search */}
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

                {/* States */}
                {loading && <p className="text-center py-6">Loading patients...</p>}
                {!loading && errMsg && (
                    <p className="text-center py-6 text-red-600">{errMsg}</p>
                )}

                {/* Table */}
                {!loading && !errMsg && (
                    <div className="overflow-x-auto" data-aos="fade-up">
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
                                {patients.length > 0 ? (
                                    patients.map((p, index) => (
                                        <tr
                                            key={p._id || p.id || index}
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
                )}
            </div>
        </section>
    );
};

export default PatientList;

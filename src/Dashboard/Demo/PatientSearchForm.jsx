import { useState } from "react";
import useAxios from "../../Hook/useAxios";


export default function PatientSearchForm() {
    const axios = useAxios();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selected, setSelected] = useState({
        name: "",
        age: "",
        address: "",
        mobile: "",
    });

    // 🔹 সার্চ হ্যান্ডলার
    const handleSearch = async (value) => {
        setQuery(value);
        if (value.trim().length < 2) {
            setResults([]);
            return;
        }

        try {
            const res = await axios.get(`/patients/search?q=${value}`);
            setResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 🔹 সিলেক্ট করলে ফর্মে ডাটা বসানো
    const handleSelect = (patient) => {
        setSelected({
            name: patient.name,
            age: patient.age,
            address: patient.address,
            mobile: patient.mobile,
        });
        setQuery(patient.mobile); // ইনপুটে মোবাইল বসানো
        setResults([]); // সাজেশন হাইড করা
    };

    // 🔹 ফর্ম সাবমিট (উদাহরণ হিসেবে শুধু console)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", selected);
    };

    return (
        <div className="max-w-lg mx-auto p-4">
            {/* সার্চ ফিল্ড */}
            <label className="form-control w-full">
                <input
                    type="text"
                    placeholder="Search by Mobile Number..."
                    className="input input-bordered w-full"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </label>

            {/* সার্চ রেজাল্ট */}
            {results.length > 0 && (
                <ul className="menu bg-base-200 mt-2 rounded-box shadow-md">
                    {results.map((p) => (
                        <li key={p._id} onClick={() => handleSelect(p)}>
                            <a>
                                {p.mobile} - {p.name}
                            </a>
                        </li>
                    ))}
                </ul>
            )}

            {/* ফর্ম */}
            <form
                onSubmit={handleSubmit}
                className="bg-base-100 shadow-md p-4 mt-4 rounded-lg"
            >
                <h2 className="text-xl font-semibold mb-4 text-blue-600">
                    Patient Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={selected.name}
                        onChange={(e) =>
                            setSelected({ ...selected, name: e.target.value })
                        }
                        className="input input-bordered w-full"
                    />

                    <input
                        type="number"
                        placeholder="Age"
                        value={selected.age}
                        onChange={(e) =>
                            setSelected({ ...selected, age: e.target.value })
                        }
                        className="input input-bordered w-full"
                    />

                    <input
                        type="text"
                        placeholder="Address"
                        value={selected.address}
                        onChange={(e) =>
                            setSelected({ ...selected, address: e.target.value })
                        }
                        className="input input-bordered w-full col-span-2"
                    />

                    <input
                        type="text"
                        placeholder="Mobile"
                        value={selected.mobile}
                        onChange={(e) =>
                            setSelected({ ...selected, mobile: e.target.value })
                        }
                        className="input input-bordered w-full col-span-2"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4">
                    Submit
                </button>
            </form>
        </div>
    );
}

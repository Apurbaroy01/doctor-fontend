import { useState } from "react";
import useAxios from "../../Hook/useAxios";


export default function PatientSearchForm() {
  const axios = useAxios();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    setSelected(null);

    if (value.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/patients/search?q=${value}`);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (patient) => {
    setSelected(patient);
    setResults([]);
    setQuery(patient.patientId || patient.mobile || "");
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <label className="form-control w-full">
        <input
          type="text"
          placeholder="Enter Patient ID or Mobile..."
          className="input input-bordered w-full"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </label>

      {loading && <p className="mt-2 text-gray-500 text-sm">Searching...</p>}

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

      {selected && (
        <div className="card bg-base-100 shadow-md p-4 mt-4">
          <h2 className="text-xl font-semibold mb-2">Patient Details</h2>
          <p>
            <b>Name:</b> {selected.name}
          </p>
          <p>
            <b>Age:</b> {selected.age}
          </p>
          <p>
            <b>Mobile:</b> {selected.mobile}
          </p>
          <p>
            <b>Address:</b> {selected.address}
          </p>
        </div>
      )}
    </div>
  );
}

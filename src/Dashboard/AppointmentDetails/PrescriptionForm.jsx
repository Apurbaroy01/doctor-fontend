import { useState } from "react";
import {
    FaFilePrescription,
    FaTrashAlt,
    FaPlus,
    FaPrint,
} from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../Hook/useAxios";

const PrescriptionForm = ({ appointment }) => {
    const axiosSecure = useAxios();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        medicines: appointment?.prescription?.medicines || [
            { name: "", dosage: "", instructions: "" },
        ],
        tests: appointment?.prescription?.tests || [""],
        generalInstructions:
            appointment?.prescription?.generalInstructions || "",
    });

    // 🔹 Mutation for Saving Prescription
    const updatePrescription = useMutation({
        mutationFn: async (data) =>
            await axiosSecure.patch(`/appointments/${appointment._id}`, {
                prescription: data,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries(["appointments", appointment.trackingId]);
            handlePrint(); // 🖨️ Trigger print right after saving
        },
    });

    // 🔹 Handlers
    const handleMedicineChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...formData.medicines];
        updated[index][name] = value;
        setFormData((prev) => ({ ...prev, medicines: updated }));
    };

    const addMedicine = () => {
        setFormData((prev) => ({
            ...prev,
            medicines: [
                ...prev.medicines,
                { name: "", dosage: "", instructions: "" },
            ],
        }));
    };

    const removeMedicine = (index) => {
        setFormData((prev) => ({
            ...prev,
            medicines: prev.medicines.filter((_, i) => i !== index),
        }));
    };

    const handleTestChange = (index, e) => {
        const updated = [...formData.tests];
        updated[index] = e.target.value;
        setFormData((prev) => ({ ...prev, tests: updated }));
    };

    const addTest = () => {
        setFormData((prev) => ({ ...prev, tests: [...prev.tests, ""] }));
    };

    const removeTest = (index) => {
        setFormData((prev) => ({
            ...prev,
            tests: prev.tests.filter((_, i) => i !== index),
        }));
    };

    // 🔹 Print Prescription
    const handlePrint = () => {
        const printWindow = window.open("", "_blank");
        const today = new Date().toLocaleDateString();

        const htmlContent = `
      <html>
        <head>
          <title>Prescription - ${appointment?.name}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              @page { margin: 20mm; }
            }
          </style>
        </head>
        <body class="p-10 text-gray-800">
          <div class="border-b-4 border-blue-500 pb-4 mb-6">
            <h1 class="text-3xl font-bold text-blue-600">Medical Prescription</h1>
            <p class="text-sm text-gray-500">Date: ${today}</p>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Patient Information</h2>
            <p><strong>Name:</strong> ${appointment?.name}</p>
            <p><strong>Phone:</strong> ${appointment?.mobile}</p>
            <p><strong>Tracking ID:</strong> ${appointment?.trackingId}</p>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-3">Medicines</h2>
            <table class="w-full border border-gray-300">
              <thead class="bg-blue-100">
                <tr>
                  <th class="border p-2 text-left">Name</th>
                  <th class="border p-2 text-left">Dosage</th>
                  <th class="border p-2 text-left">Instructions</th>
                </tr>
              </thead>
              <tbody>
                ${formData.medicines
                .map(
                    (m) => `
                    <tr>
                      <td class="border p-2">${m.name}</td>
                      <td class="border p-2">${m.dosage}</td>
                      <td class="border p-2">${m.instructions}</td>
                    </tr>
                  `
                )
                .join("")}
              </tbody>
            </table>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold mb-3">Recommended Tests</h2>
            <ul class="list-disc list-inside">
              ${formData.tests
                .filter((t) => t.trim() !== "")
                .map((t) => `<li>${t}</li>`)
                .join("") || "<p>No tests recommended.</p>"}
            </ul>
          </div>

          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-3">General Instructions</h2>
            <p>${formData.generalInstructions || "No specific instructions."}</p>
          </div>

          <div class="text-right mt-10">
            <p class="font-semibold text-gray-600">Dr. ____________________</p>
            <p class="text-sm text-gray-500">Signature</p>
          </div>
        </body>
      </html>
    `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    // 🔹 Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        updatePrescription.mutate(formData);
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaFilePrescription /> Prescription
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 🔹 Medicines */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg text-primary">Medicines</h4>
                        <button
                            type="button"
                            onClick={addMedicine}
                            className="btn btn-sm btn-outline btn-primary flex items-center gap-2"
                        >
                            <FaPlus /> Add Medicine
                        </button>
                    </div>

                    {formData.medicines.map((med, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end mb-3 border p-3 rounded-lg bg-base-200"
                        >
                            <div>
                                <label className="label-text font-semibold">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={med.name}
                                    onChange={(e) => handleMedicineChange(index, e)}
                                    className="input input-bordered w-full"
                                    placeholder="e.g. Paracetamol"
                                />
                            </div>

                            <div>
                                <label className="label-text font-semibold">Dosage</label>
                                <input
                                    type="text"
                                    name="dosage"
                                    value={med.dosage}
                                    onChange={(e) => handleMedicineChange(index, e)}
                                    className="input input-bordered w-full"
                                    placeholder="e.g. 500mg twice a day"
                                />
                            </div>

                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <label className="label-text font-semibold">
                                        Instructions
                                    </label>
                                    <input
                                        type="text"
                                        name="instructions"
                                        value={med.instructions}
                                        onChange={(e) => handleMedicineChange(index, e)}
                                        className="input input-bordered w-full"
                                        placeholder="Before meal"
                                    />
                                </div>
                                {formData.medicines.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMedicine(index)}
                                        className="btn btn-sm btn-error"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 🔹 Tests */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg text-primary">Tests</h4>
                        <button
                            type="button"
                            onClick={addTest}
                            className="btn btn-sm btn-outline btn-primary flex items-center gap-2"
                        >
                            <FaPlus /> Add Test
                        </button>
                    </div>

                    {formData.tests.map((test, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={test}
                                onChange={(e) => handleTestChange(index, e)}
                                className="input input-bordered w-full"
                                placeholder="e.g. Blood Test"
                            />
                            {formData.tests.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTest(index)}
                                    className="btn btn-sm btn-error"
                                >
                                    <FaTrashAlt />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* 🔹 General Instructions */}
                <div>
                    <label className="label-text font-semibold">General Instructions</label>
                    <textarea
                        name="generalInstructions"
                        value={formData.generalInstructions}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                generalInstructions: e.target.value,
                            }))
                        }
                        className="textarea textarea-bordered w-full"
                        placeholder="Add general doctor instructions..."
                    />
                </div>

                {/* 🔹 Submit */}
                <div className="flex justify-between gap-3">
                    <button
                        type="submit"
                        className="btn btn-primary flex-1"
                        disabled={updatePrescription.isLoading}
                    >
                        {updatePrescription.isLoading ? "Saving..." : "Save & Print"}
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="btn btn-outline flex items-center gap-2"
                    >
                        <FaPrint /> Print Preview
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PrescriptionForm;

import { useState } from "react";
import {
    FaFilePrescription,
    FaTrashAlt,
    FaPlus,
    FaPrint,
} from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../Hook/useAxios";
import PrescriptionPrint from "./PrescriptionPrint";


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

    // 🔹 Save Prescription Mutation
    const updatePrescription = useMutation({
        mutationFn: async (data) =>
            await axiosSecure.patch(`/appointments/${appointment._id}`, {
                prescription: data,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries(["appointments", appointment.trackingId]);
            PrescriptionPrint({ appointment, formData }); // 🖨️ Print after save
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

    // 🔹 Print Preview
    const handlePrint = () => {
        PrescriptionPrint({ appointment, formData });
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
                {/* 🔹 Medicines Section */}
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

                {/* 🔹 Tests Section */}
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
                    <label className="label-text font-semibold">
                        General Instructions
                    </label>
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

                {/* 🔹 Buttons */}
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

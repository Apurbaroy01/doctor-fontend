import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { FaUserMd, FaCalendarAlt, FaFilePrescription } from "react-icons/fa";
import { RiTimeLine } from "react-icons/ri";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

const AppointmentDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch single appointment by ID
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axiosSecure.get(`/appointments/${id}`);
        setAppointment(res.data);
      } catch (err) {
        console.error("Error fetching appointment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, axiosSecure]);


  const {data: appointments = [], isLoading: historyLoading,} = useQuery({
    queryKey: ["appointments", appointment?.trackingId],
    queryFn: async () => {
      if (!appointment?.trackingId) return [];
      const res = await axiosSecure.get(
        `/patient?trackingId=${appointment.trackingId}`
      );
      return res.data;
    },
    enabled: !!appointment?.trackingId,
  });


  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) =>
      await axiosSecure.patch(`/appointments/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments", appointment?.trackingId]);
    },
  });

  if (loading || historyLoading)
    return <p className="text-center py-10">Loading...</p>;

  if (!appointment)
    return <p className="text-center text-error">No appointment found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        Appointment Details
      </h2>

      {/* 🔹 Patient Info */}
      <div className="card bg-base-100 shadow-xl border border-base-300 p-6 mb-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
            <FaUserMd className="text-secondary text-lg" /> Patient Information
          </h3>

          {/* 🔹 Status Dropdown */}
          <div className="flex items-center gap-2">
            <label className="font-semibold text-sm text-gray-600">Status:</label>
            <select
              defaultValue={appointment.status || "Pending"}
              onChange={(e) =>
                updateStatus.mutate({
                  id: appointment._id,
                  status: e.target.value,
                })
              }
              className="select select-sm select-bordered font-medium text-gray-700"
            >
              <option value="Pending" className="text-warning">
                Pending
              </option>
              <option value="Completed" className="text-success">
                Completed
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <div className="p-3 rounded-lg bg-base-200">
            <p className="text-sm text-gray-500">Name:</p>
            <p className="font-semibold">{appointment.name}</p>
          </div>

          <div className="p-3 rounded-lg bg-base-200">
            <p className="text-sm text-gray-500">Phone:</p>
            <p className="font-semibold">{appointment.mobile}</p>
          </div>

          <div className="p-3 rounded-lg bg-base-200">
            <p className="text-sm text-gray-500">Date:</p>
            <p className="font-semibold">{appointment.date}</p>
          </div>

          <div className="p-3 rounded-lg bg-base-200">
            <p className="text-sm text-gray-500">Time:</p>
            <p className="font-semibold">{appointment.time}</p>
          </div>

          <div className="p-3 rounded-lg bg-base-200">
            <p className="text-sm text-gray-500">Payment:</p>
            <p className="font-semibold text-primary">
              {appointment.payment} BDT
            </p>
          </div>

          <div className="p-3 rounded-lg bg-base-200">
            <p className="text-sm text-gray-500">Tracking ID:</p>
            <p className="font-semibold">{appointment.trackingId}</p>
          </div>
        </div>
      </div>

      {/* 🔹 Tabs Section */}
      <div role="tablist" className="tabs tabs-lifted">
        {/* Tab 1: Prescription */}
        <input
          type="radio"
          name="appt_tabs"
          role="tab"
          className="tab"
          aria-label="Prescription"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaFilePrescription /> Prescription
          </h3>

          {appointment.prescription ? (
            <div className="space-y-3">
              <p>
                <strong>Medicine:</strong>{" "}
                {appointment.prescription.medicine}
              </p>
              <p>
                <strong>Dosage:</strong> {appointment.prescription.dosage}
              </p>
              <p>
                <strong>Instructions:</strong>{" "}
                {appointment.prescription.instructions}
              </p>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No prescription available yet.</p>
            </div>
          )}
        </div>

        {/* Tab 2: Appointment History */}
        <input
          type="radio"
          name="appt_tabs"
          role="tab"
          className="tab"
          aria-label="Appointment History"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaCalendarAlt /> Appointment History
          </h3>

          {appointments.length > 0 ? (
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
              {appointments.map((item, index) => (
                <li key={index}>
                  <div className="timeline-middle">
                    <FaCalendarAlt className="text-primary text-lg" />
                  </div>
                  <div className="timeline-end mb-10">
                    <time className="font-semibold text-base text-primary">
                      {item.date} - {item.time}
                    </time>
                    <div className="text-sm text-gray-700 mt-1">
                      <p>
                        <strong>Payment:</strong> {item.payment} BDT
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`badge ${item.status === "Completed"
                              ? "badge-success"
                              : "badge-warning"
                            }`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </p>
                    </div>
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">
              No previous appointment history found.
            </p>
          )}
        </div>

        {/* Tab 3: Timeline */}
        <input
          type="radio"
          name="appt_tabs"
          role="tab"
          className="tab"
          aria-label="Timeline"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <RiTimeLine /> Timeline
          </h3>

          {appointments.length > 0 ? (
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
              {appointments.map((step, index) => (
                <li key={index}>
                  <div className="timeline-middle">
                    <RiTimeLine className="text-secondary text-lg" />
                  </div>
                  <div className="timeline-end mb-10">
                    <time className="font-semibold text-primary">
                      {step.date}
                    </time>
                    <div className="text-sm text-gray-700 mt-1">
                      Appointment booked for <b>{step.time}</b> <br />
                      Payment: <b>{step.payment} BDT</b> <br />
                      Status:{" "}
                      <span
                        className={`badge ${step.status === "Completed"
                            ? "badge-success"
                            : "badge-warning"
                          }`}
                      >
                        {step.status || "Pending"}
                      </span>
                    </div>
                  </div>
                  <hr />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No timeline data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;

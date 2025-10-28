import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxios from "../../Hook/useAxios";
import { FaUserMd, FaCalendarAlt, FaFilePrescription } from "react-icons/fa";
import { RiTimeLine } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";

const AppointmentDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch single appointment by ID
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axiosSecure.get(`/appointments/${id}`);
        setAppointment(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id, axiosSecure]);

  // Fetch all appointments under the same trackingId
  const { data: appointments = [], isLoading: historyLoading } = useQuery({
    queryKey: ["appointments", appointment?.trackingId],
    queryFn: async () => {
      if (!appointment?.trackingId) return [];
      const res = await axiosSecure.get(`/patient?trackingId=${appointment.trackingId}`);
      return res.data;
    },
    enabled: !!appointment?.trackingId,
  });

  if (loading || historyLoading) return <p className="text-center py-10">Loading...</p>;
  if (!appointment) return <p className="text-center text-error">No appointment found.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        Appointment Details
      </h2>

      {/* Patient Info */}
      <div className="card bg-base-200 shadow-lg p-5 mb-8">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <FaUserMd /> Patient Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Name:</strong> {appointment.name}</p>
          <p><strong>Phone:</strong> {appointment.mobile}</p>
          <p><strong>Date:</strong> {appointment.date}</p>
          <p><strong>Time:</strong> {appointment.time}</p>
          <p><strong>Payment:</strong> {appointment.payment} BDT</p>
          <p><strong>Tracking ID:</strong> {appointment.trackingId}</p>
        </div>
      </div>

      {/* Tabs */}
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
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaFilePrescription /> Prescription
          </h3>

          {appointment.prescription ? (
            <div className="space-y-3">
              <p><strong>Medicine:</strong> {appointment.prescription.medicine}</p>
              <p><strong>Dosage:</strong> {appointment.prescription.dosage}</p>
              <p><strong>Instructions:</strong> {appointment.prescription.instructions}</p>
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
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
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
                      <p><strong>Payment:</strong> {item.payment} BDT</p>
                      <p><strong>Status:</strong>{" "}
                        <span className={`badge ${item.status === "Completed" ? "badge-success" : "badge-warning"}`}>
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
            <p className="text-gray-500">No previous appointment history found.</p>
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
        <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
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
                    <time className="font-semibold text-primary">{step.date}</time>
                    <div className="text-sm text-gray-700 mt-1">
                      Appointment booked for <b>{step.time}</b> <br />
                      Payment: <b>{step.payment} BDT</b> <br />
                      Status:{" "}
                      <span className={`badge ${step.status === "Completed" ? "badge-success" : "badge-warning"}`}>
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

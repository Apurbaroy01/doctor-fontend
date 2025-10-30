const PrescriptionPrint = ({ appointment, formData, doctor }) => {
  const today = new Date().toLocaleDateString();

  const dr = {
    name: doctor?.name || "Dr. Fernando Arobi",
    qualification: doctor?.qualification || "MBBS, FCPS (Medicine)",
    specialization: doctor?.specialization || "Consultant, Internal Medicine",
    clinic: doctor?.clinic || "Medical Healthcare Center",
    phone: doctor?.phone || "+880 1234-567890",
    email: doctor?.email || "doctor@medicalcare.com",
    address: doctor?.address || "123 Medical Street, City",
    logo:
      doctor?.logo ||
      "https://cdn-icons-png.flaticon.com/512/2966/2966487.png",
  };

  const html = `
  <html>
    <head>
      <title>Prescription - ${appointment?.name}</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; }
        }
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f8fafc;
          margin: 0;
        }
        .divider {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          background-color: #2563eb;
        }
        .doctor-signature {
          position: absolute;
          bottom: 110px;
          right: 60px;
          text-align: right;
        }
        .content-area {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          position: relative;
          min-height: 550px;
          padding-bottom: 80px;
        }
      </style>
    </head>
    <body>
      <div class="w-[800px] mx-auto bg-white shadow-md border border-gray-300 relative min-h-screen">

        <!-- HEADER -->
        <header class="flex justify-between items-center p-6 border-b-4 border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100">
          <div class="flex items-center gap-4">
            <img src="${dr.logo}" alt="Clinic Logo" class="h-16 w-16 object-contain" />
            <div>
              <h1 class="text-3xl font-bold text-blue-700">${dr.name}</h1>
              <p class="text-sm text-gray-700">${dr.qualification}</p>
              <p class="text-sm text-gray-700">${dr.specialization}</p>
              <p class="text-sm text-gray-700">${dr.clinic}</p>
            </div>
          </div>
          <div class="text-right text-sm text-gray-700">
            <p><strong>Date:</strong> ${today}</p>
            <p><strong>Phone:</strong> ${dr.phone}</p>
            <p><strong>Email:</strong> ${dr.email}</p>
          </div>
        </header>

        <!-- PATIENT INFO -->
        <section class="p-6">
          <div class="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Patient Name:</strong> ${appointment?.name || ""}</p>
                <p><strong>Age:</strong> ${appointment?.age || "N/A"}</p>
                <p><strong>Gender:</strong> ${appointment?.gender || "N/A"}</p>
              </div>
              <div>
                <p><strong>Patient ID:</strong> ${appointment?.trackingId || "N/A"}</p>
                <p><strong>Address:</strong> ${appointment?.address || "N/A"}</p>
                <p><strong>Contact:</strong> ${appointment?.mobile || "N/A"}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- MAIN CONTENT -->
        <main class="px-8 pb-32 relative">
          <div class="content-area">
            
            <!-- LEFT COLUMN -->
            <div class="flex flex-col">
              <h2 class="text-lg font-semibold text-blue-700 mb-3 border-b border-gray-300 pb-1">
                Recommended Tests
              </h2>
              <ul class="list-disc list-inside text-gray-700 leading-relaxed flex-1">
                ${
                  formData.tests && formData.tests.filter((t) => t.trim() !== "").length > 0
                    ? formData.tests
                        .filter((t) => t.trim() !== "")
                        .map((t) => `<li>${t}</li>`)
                        .join("")
                    : "<li class='text-gray-500'>No diagnostic tests recommended.</li>"
                }
              </ul>
            </div>

            <!-- RIGHT COLUMN -->
            <div class="flex flex-col">
              <div class="flex items-center mb-3">
                <span class="text-[55px] text-blue-600 font-bold mr-2 leading-none">℞</span>
                <h2 class="text-lg font-semibold text-blue-700 border-b border-gray-300 pb-1 flex-1">
                  Prescribed Medicines
                </h2>
              </div>

              <div class="flex-1">
                <table class="w-full border-collapse border-gray-300 mb-5">
                  <thead class="bg-blue-100 text-left">
                    <tr>
                      <th class="border border-gray-300 px-3 py-2">Medicine</th>
                      <th class="border border-gray-300 px-3 py-2">Dosage</th>
                      <th class="border border-gray-300 px-3 py-2">Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      formData.medicines && formData.medicines.length > 0
                        ? formData.medicines
                            .map(
                              (m) => `
                              <tr>
                                <td class="border border-gray-300 px-3 py-2">${m.name}</td>
                                <td class="border border-gray-300 px-3 py-2">${m.dosage}</td>
                                <td class="border border-gray-300 px-3 py-2">${m.instructions}</td>
                              </tr>`
                            )
                            .join("")
                        : `<tr><td colspan="3" class="text-center border px-3 py-2 text-gray-500">No medicines prescribed.</td></tr>`
                    }
                  </tbody>
                </table>

                <div>
                  <h3 class="text-lg font-semibold text-blue-700 border-b border-gray-300 pb-1 mb-2">
                    General Instructions
                  </h3>
                  <p class="text-gray-700">
                    ${formData.generalInstructions || "No special instructions provided."}
                  </p>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="divider"></div>
          </div>

          <!-- Doctor Signature -->
          <div class="doctor-signature">
            <div class="border-t border-gray-400 w-64 ml-auto mb-1"></div>
            <p class="font-semibold text-gray-700">${dr.name}</p>
            <p class="text-sm text-gray-500">${dr.qualification}</p>
          </div>
        </main>

        <!-- FOOTER -->
        <footer class="absolute bottom-0 left-0 w-full bg-gradient-to-r from-blue-100 to-blue-50 border-t-4 border-blue-600 p-4 text-center">
          <p class="font-semibold text-gray-800">${dr.clinic}</p>
          <p class="text-sm text-gray-600">${dr.address}</p>
          <p class="text-sm text-gray-500">Phone: ${dr.phone} | Email: ${dr.email}</p>
          <p class="text-xs text-gray-400 mt-1">
            This is a computer-generated prescription. Signature not required.
          </p>
        </footer>
      </div>
    </body>
  </html>`;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};

export default PrescriptionPrint;

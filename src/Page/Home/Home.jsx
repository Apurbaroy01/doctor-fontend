
import {
    FaCalendarCheck,
    FaUserMd,
    FaUserInjured,
    FaPills,
    FaFileInvoice,
    FaPrescriptionBottleAlt,
} from "react-icons/fa";

const Home = () => {
    

    const cards = [
        {
            title: "Appointment",
            count: 10,
            icon: <FaCalendarCheck className="text-4xl text-blue-800" />,
            btnText: "View Appointment List",
            aos: "fade-up",
        },
        {
            title: "Prescription",
            count: 9,
            icon: <FaPrescriptionBottleAlt className="text-4xl text-blue-800" />,
            btnText: "View Prescription List",
            aos: "fade-up",
        },
        {
            title: "Invoice",
            count: 2,
            icon: <FaFileInvoice className="text-4xl text-blue-800" />,
            btnText: "View Invoice List",
            aos: "fade-up",
        },
        {
            title: "Patient",
            count: 1,
            icon: <FaUserInjured className="text-4xl text-blue-800" />,
            btnText: "View Patient List",
            aos: "fade-up",
        },
        {
            title: "Doctor",
            count: 2,
            icon: <FaUserMd className="text-4xl text-blue-800" />,
            btnText: "View Doctor List",
            aos: "fade-up",
        },
        {
            title: "Drug",
            count: 1,
            icon: <FaPills className="text-4xl text-blue-800" />,
            btnText: "View Drug List",
            aos: "fade-up",
        },
    ];

    return (
        <section className="min-h-screen bg-gray-50 py-10 px-4 font-[Poppins]">
            <h2
                className="text-3xl font-semibold text-center mb-10 text-blue-900"
                data-aos="fade-down"
            >
                Doctor Dashboard
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="card bg-white shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300"
                        data-aos={card.aos}
                        data-aos-delay={index * 100}
                    >
                        <div className="card-body items-center text-center">
                            <div className="mb-3">{card.icon}</div>
                            <h2 className="card-title text-gray-700">{card.title}</h2>
                            <p className="text-2xl font-bold text-blue-900">{card.count}</p>
                        </div>
                        <div className="bg-blue-900 py-2 text-white text-center rounded-b-lg cursor-pointer hover:bg-blue-800 transition">
                            {card.btnText}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Home;

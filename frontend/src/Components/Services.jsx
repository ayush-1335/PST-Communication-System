import { Link } from "react-router-dom";

const services = [
  {
    icon: "📚",
    title: "Academic Programs",
    description: "Comprehensive curriculum from Standard 1 to 12 following CBSE guidelines. Strong focus on Science, Mathematics, Commerce and Arts streams at higher secondary level.",
    tags: ["CBSE Curriculum", "Std 1–12", "Science & Commerce"],
  },
  {
    icon: "🖥️",
    title: "Smart Classrooms",
    description: "All classrooms are equipped with digital boards, projectors and internet connectivity to deliver interactive and engaging lessons every day.",
    tags: ["Digital Boards", "Projectors", "Interactive Learning"],
  },
  {
    icon: "🏋️",
    title: "Sports & Physical Education",
    description: "A dedicated sports ground with facilities for cricket, football, basketball and athletics. Physical education is a core part of every student's daily schedule.",
    tags: ["Cricket", "Football", "Basketball", "Athletics"],
  },
  {
    icon: "🎨",
    title: "Arts & Extracurriculars",
    description: "From drawing and painting to music, dance and theatre — we encourage every child to discover and develop their creative talents beyond the classroom.",
    tags: ["Music", "Dance", "Theatre", "Fine Arts"],
  },
  {
    icon: "🔬",
    title: "Science & Computer Labs",
    description: "Fully equipped Physics, Chemistry, Biology and Computer Science labs giving students hands-on experience with real experiments and modern technology.",
    tags: ["Physics Lab", "Chemistry Lab", "Computer Lab"],
  },
  {
    icon: "📖",
    title: "Library",
    description: "A well-stocked library with over 10,000 books, journals, newspapers and digital resources. Open to students and staff throughout school hours.",
    tags: ["10,000+ Books", "Digital Resources", "Reading Room"],
  },
  {
    icon: "🚌",
    title: "School Transport",
    description: "Safe and reliable bus service covering all major routes across the city. GPS-tracked buses with trained drivers and female attendants for student safety.",
    tags: ["GPS Tracked", "All City Routes", "Safe Travel"],
  },
  {
    icon: "🍱",
    title: "Canteen & Nutrition",
    description: "A hygienic school canteen serving freshly prepared, nutritious meals and snacks. Menus are reviewed regularly by a nutrition advisor.",
    tags: ["Hygienic", "Nutritious Meals", "Daily Menu"],
  },
  {
    icon: "🏥",
    title: "Health & Medical Care",
    description: "A dedicated sick room with a full-time nurse on campus. Regular health checkups, vaccination drives and first-aid training are part of our wellness program.",
    tags: ["Full-time Nurse", "Health Checkups", "First Aid"],
  },
  {
    icon: "📊",
    title: "Digital Management System",
    description: "Our SmartEduNet platform gives parents, teachers and students access to attendance records, exam results, assignments and more — all online.",
    tags: ["Attendance", "Exam Results", "Assignments", "Parent Portal"],
  },
  {
    icon: "🎓",
    title: "Scholarships & Support",
    description: "Merit-based and need-based scholarships available for deserving students. Remedial classes and extra support provided for students who need additional help.",
    tags: ["Merit Scholarships", "Remedial Classes", "Equal Access"],
  },
  {
    icon: "🤝",
    title: "Parent Engagement",
    description: "Regular PTM (Parent-Teacher Meetings), open house days, and a dedicated parent portal to keep families actively involved in their child's education.",
    tags: ["PTM", "Open House", "Parent Portal"],
  },
];

const Services = () => {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-500 text-xs font-semibold uppercase tracking-wider mb-6">
            Our Services
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-5">
            Everything We Offer at <span className="text-blue-500">SmartEduNet</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            From academics to sports, transport to technology — we provide a complete
            environment for every student to learn, grow and thrive.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition-all duration-150 flex flex-col"
            >
              <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-100 text-xl mb-4">
                {service.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">{service.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {service.tags.map((tag, j) => (
                  <span key={j} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-500 mx-6 mb-16 rounded-2xl max-w-5xl md:mx-auto">
        <div className="px-8 py-14 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Interested in admissions?</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto">
            Get in touch with us to learn more about enrollment, fees and available seats for the upcoming academic year.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/contact" className="px-6 py-3 rounded-xl bg-white text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors duration-150">
              Contact Us
            </Link>
            <Link to="/about" className="px-6 py-3 rounded-xl border border-blue-400 text-white text-sm font-semibold hover:bg-blue-600 transition-colors duration-150">
              About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-slate-800 text-sm font-semibold">Smart<span className="text-blue-500">EduNet</span></span>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Home</Link>
            <Link to="/about" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">About</Link>
            <Link to="/contact" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-slate-400">© 2026 SmartEduNet. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Services;
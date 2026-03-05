import { Link } from "react-router-dom";

const stats = [
  { number: "1200+", label: "Students Enrolled" },
  { number: "80+",   label: "Expert Teachers" },
  { number: "12",    label: "Standards" },
  { number: "98%",   label: "Attendance Rate" },
];

const features = [
  {
    title: "Smart Attendance",
    description: "Teachers mark daily attendance digitally. Parents get real-time updates on their child's presence.",
    icon: "✓",
  },
  {
    title: "Exam Management",
    description: "Schedule exams, set max marks, and track results — all from one place.",
    icon: "📋",
  },
  {
    title: "Assignments",
    description: "Assign homework digitally. Students can view due dates and submission status instantly.",
    icon: "📝",
  },
  {
    title: "Parent Connect",
    description: "Parents stay connected with their child's academic progress using a unique student code.",
    icon: "👨‍👩‍👧",
  },
  {
    title: "Role-Based Access",
    description: "Separate dashboards for Admin, Teachers, Parents, and Students — each tailored to their needs.",
    icon: "🔐",
  },
  {
    title: "Academic Reports",
    description: "View detailed reports on attendance, marks, and performance across all standards.",
    icon: "📊",
  },
];

const Home = () => {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-500 text-xs font-semibold uppercase tracking-wider mb-6">
            School Management Platform
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
            Welcome to{" "}
            <span className="text-blue-500">SmartEduNet</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            A complete digital platform connecting admins, teachers, parents, and students —
            making school management smarter, faster, and easier.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors duration-150"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors duration-150"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-blue-500">{stat.number}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Everything Your School Needs</h2>
          <p className="text-slate-500 text-sm mt-2">Powerful tools for every role in your school</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-200 hover:shadow-sm transition-all duration-150"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-500 mx-6 mb-20 rounded-2xl max-w-5xl md:mx-auto">
        <div className="px-8 py-14 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto">
            Join SmartEduNet today and bring your school into the digital age.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 rounded-xl bg-white text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors duration-150"
          >
            Login to Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-slate-800 text-sm font-semibold">
            Smart<span className="text-blue-500">EduNet</span>
          </span>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">About</Link>
            <Link to="/services" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Services</Link>
            <Link to="/contact" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-slate-400">© 2026 SmartEduNet. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
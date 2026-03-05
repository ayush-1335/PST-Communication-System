import { Link } from "react-router-dom";

const trustees = [
  { name: "Shri Ramesh Chandra Joshi", role: "Founder & Chairman", since: "Est. 1998", initials: "RJ" },
  { name: "Mrs. Kavita Suresh Nair", role: "Managing Trustee", since: "Since 2005", initials: "KN" },
  { name: "Dr. Haresh Popatlal Shah", role: "Secretary", since: "Since 2008", initials: "HS" },
];

const achievements = [
  { year: "2005", title: "State Excellence Award", desc: "Recognized by the state government for outstanding academic results." },
  { year: "2011", title: "Best CBSE School — District Level", desc: "Awarded best school in the district for 3 consecutive years." },
  { year: "2016", title: "Digital Innovation in Education", desc: "First school in the district to implement a fully digital attendance system." },
  { year: "2020", title: "100% Board Pass Rate", desc: "All Std 10 and Std 12 students cleared board exams with distinction." },
  { year: "2024", title: "Green School Certification", desc: "Certified for environmental initiatives and eco-friendly campus development." },
];

const About = () => {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-500 text-xs font-semibold uppercase tracking-wider mb-6">
            About Our School
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-5">
            SmartEduNet — <span className="text-blue-500">A Legacy of Learning</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Established in 1998, SmartEduNet High School has been nurturing young minds for over
            25 years with a commitment to quality education, discipline, and holistic development.
          </p>
        </div>
      </section>

      {/* History & Establishment */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Our History</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 mb-4">How It All Began</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              SmartEduNet High School was founded in <strong>1998</strong> by the late
              <strong> Shri Ramesh Chandra Joshi</strong> with a simple vision — to provide
              quality education to every child in the region, regardless of their background.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              What started as a modest institution with 3 classrooms and 60 students in a small
              rented building in <strong>Surat, Gujarat</strong>, has grown into one of the most
              respected schools in the district with over 1200 students and 80 teachers.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Affiliated with <strong>CBSE (Central Board of Secondary Education)</strong>, the
              school offers classes from Standard 1 to Standard 12, with a strong focus on both
              academics and extracurricular excellence.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Established", value: "1998" },
              { label: "Board", value: "CBSE" },
              { label: "Standards", value: "1 to 12" },
              { label: "Location", value: "Surat, Gujarat" },
              { label: "Students", value: "1200+" },
              { label: "Teachers", value: "80+" },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-blue-200 hover:shadow-sm transition-all duration-150">
                <p className="text-lg font-bold text-blue-500">{item.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Location</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2 mb-4">Where We Are</h2>
              <div className="space-y-3">
                {[
                  { label: "Address", value: "Plot No. 42, Varachha Road, Surat — 395006" },
                  { label: "City", value: "Surat, Gujarat, India" },
                  { label: "Phone", value: "+91 98765 43210" },
                  { label: "Email", value: "info@smartedunet.in" },
                  { label: "Timings", value: "Mon – Sat: 7:30 AM to 2:30 PM" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-20 shrink-0 mt-0.5">{item.label}</span>
                    <span className="text-sm text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-slate-100 border border-slate-200 rounded-xl h-56 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl mb-2">📍</p>
                <p className="text-sm text-slate-500">Varachha Road, Surat</p>
                <p className="text-xs text-slate-400 mt-1">Gujarat, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trustees */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Leadership</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Our Board of Trustees</h2>
          <p className="text-sm text-slate-500 mt-2">The people who built and continue to guide SmartEduNet</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {trustees.map((t, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:border-blue-200 hover:shadow-sm transition-all duration-150">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xl flex items-center justify-center mx-auto mb-4">
                {t.initials}
              </div>
              <p className="text-sm font-semibold text-slate-800">{t.name}</p>
              <p className="text-xs text-blue-500 font-medium mt-1">{t.role}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t.since}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Achievements</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">Awards & Recognition</h2>
            <p className="text-sm text-slate-500 mt-2">Milestones we are proud of</p>
          </div>
          <div className="relative border-l-2 border-blue-100 pl-8 space-y-8 ml-4">
            {achievements.map((a, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow" />
                <div className="flex items-start gap-4">
                  <span className="shrink-0 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold">{a.year}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-500 mx-6 my-16 rounded-2xl max-w-5xl md:mx-auto">
        <div className="px-8 py-14 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Want to get in touch?</h2>
          <p className="text-blue-100 text-sm mb-8 max-w-md mx-auto">
            We'd love to hear from you. Reach out to our team or visit us at our campus.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/contact" className="px-6 py-3 rounded-xl bg-white text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors duration-150">
              Contact Us
            </Link>
            <Link to="/services" className="px-6 py-3 rounded-xl border border-blue-400 text-white text-sm font-semibold hover:bg-blue-600 transition-colors duration-150">
              Our Services
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
            <Link to="/services" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Services</Link>
            <Link to="/contact" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Contact</Link>
          </div>
          <p className="text-xs text-slate-400">© 2026 SmartEduNet. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default About;
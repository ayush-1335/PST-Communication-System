import { useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to backend
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150";

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-500 text-xs font-semibold uppercase tracking-wider mb-6">
            Contact Us
          </span>
          <h1 className="text-4xl font-bold text-slate-900 mb-5">
            Get in <span className="text-blue-500">Touch</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
            Have a question about admissions, fees, or our platform? We're here to help.
            Reach out and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Contact Info */}
          <div className="space-y-5">
            <div>
              <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Contact Information</span>
              <h2 className="text-xl font-bold text-slate-900 mt-2 mb-1">We'd Love to Hear From You</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Visit us at our campus, call us during school hours, or drop us an email anytime.
              </p>
            </div>

            {[
              { icon: "📍", label: "Address", value: "Plot No. 42, Varachha Road, Surat — 395006, Gujarat, India" },
              { icon: "📞", label: "Phone", value: "+91 98765 43210" },
              { icon: "📠", label: "Alternate", value: "+91 92345 67890" },
              { icon: "✉️", label: "Email", value: "info@smartedunet.in" },
              { icon: "🕐", label: "School Hours", value: "Mon – Sat: 7:30 AM to 2:30 PM" },
              { icon: "🕐", label: "Office Hours", value: "Mon – Sat: 9:00 AM to 5:00 PM" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white border border-slate-200 rounded-xl px-5 py-4 hover:border-blue-200 transition-all duration-150">
                <span className="text-xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm text-slate-700 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-1">Send Us a Message</h2>
            <p className="text-sm text-slate-500 mb-6">Fill in the form and we'll get back to you soon.</p>

            {submitted && (
              <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
                ✓ Your message has been sent! We'll respond within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Full Name</label>
                  <input name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required className={inputClass} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</label>
                  <input name="phone" placeholder="Your phone" value={formData.phone} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</label>
                <input type="email" name="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} required className={inputClass} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange} required className={inputClass + " cursor-pointer"}>
                  <option value="">Select a subject</option>
                  <option value="admissions">Admissions Inquiry</option>
                  <option value="fees">Fee Structure</option>
                  <option value="transport">Transport</option>
                  <option value="platform">SmartEduNet Platform</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={inputClass + " resize-none"}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors duration-150"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Map Placeholder */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800">📍 Find Us on the Map</p>
            <p className="text-xs text-slate-500 mt-0.5">Plot No. 42, Varachha Road, Surat, Gujarat</p>
          </div>
          <div className="bg-slate-100 h-56 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="text-sm text-slate-500">Map embed goes here</p>
              <p className="text-xs text-slate-400 mt-1">Replace with Google Maps iframe</p>
            </div>
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
            <Link to="/services" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Services</Link>
          </div>
          <p className="text-xs text-slate-400">© 2026 SmartEduNet. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Contact;
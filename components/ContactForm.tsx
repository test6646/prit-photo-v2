"use client";
import React, { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    phoneNo: "",
    eventType: "",
    descDetails: "",
  });

  const [showEventModal, setShowEventModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const options = [
    "Wedding",
    "Pre-Wedding",
    "Engagement",
    "Motherhood",
    "Commercial",
    "Other",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: false });
    }
  };

  const selectEvent = (value: string) => {
    setFormData({ ...formData, eventType: value });
    setShowEventModal(false);
    if (errors.eventType) {
      setErrors({ ...errors, eventType: false });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};

    if (!formData.firstName.trim()) newErrors.firstName = true;
    if (!formData.lastName.trim()) newErrors.lastName = true;
    if (!formData.emailId.trim()) newErrors.emailId = true;
    if (!formData.phoneNo.trim()) newErrors.phoneNo = true;
    if (!formData.eventType) newErrors.eventType = true;
    if (!formData.descDetails.trim()) newErrors.descDetails = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ←←← REAL FORMSPREE SUBMISSION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("firstName", formData.firstName);
    payload.append("lastName", formData.lastName);
    payload.append("emailId", formData.emailId);
    payload.append("phoneNo", formData.phoneNo);
    payload.append("eventType", formData.eventType);
    payload.append("descDetails", formData.descDetails);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT!, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Submission failed");

      // Success
      setShowSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        emailId: "",
        phoneNo: "",
        eventType: "",
        descDetails: "",
      });
      setErrors({});
    } catch (err) {
      console.error("Formspree error:", err);
      alert("Oops! Something went wrong. Please try again or emailId me directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
    id="contact"
      className="relative w-full px-[6vw] py-[160px] font-[blauer]"
      style={{ background: "var(--background)" }}
    >
      {/* TITLE */}
      <div className="text-center mb-[30px]">
        <h2 className="text-[30px] md:text-[64px] font-light tracking-[-0.03em] leading-[1.05]">
          ABOUT US
        </h2>
        <p
          className="mt-4 text-[14px] md:text-[16px] max-w-[420px] mx-auto leading-[1.6]"
          style={{ color: "var(--text-muted)" }}
        >
          Tell us about your vision, your story, or your upcoming celebration — we'd love to capture it.
        </p>
      </div>

      {/* MAIN BORDERED CONTAINER */}
      <div className="max-w-[960px] mx-auto rounded-sm">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* LEFT ASTERISK (hidden on mobile) */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <svg
              fill="var(--text-muted)"
              width="160"
              height="160"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1.728 20.992q-0.416 1.6 0.416 3.008 0.832 1.44 2.432 1.856t3.040-0.384q0.832-0.48 2.56-1.92t3.168-2.912q-0.608 2.016-0.96 4.192t-0.384 3.168q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848q0-0.96-0.384-3.168t-0.928-4.192q1.44 1.504 3.168 2.944t2.528 1.888q1.44 0.832 3.040 0.384t2.432-1.856 0.416-3.008-1.888-2.464q-0.864-0.48-2.944-1.248t-4.064-1.28q2.016-0.512 4.096-1.28t2.912-1.248q1.44-0.832 1.888-2.432t-0.416-3.040q-0.832-1.44-2.432-1.856t-3.040 0.384q-0.832 0.512-2.528 1.92t-3.168 2.912q0.576-1.984 0.928-4.192t0.384-3.168q0-1.632-1.184-2.816t-2.816-1.184-2.816 1.184-1.184 2.816q0 0.992 0.384 3.168t0.96 4.192q-1.44-1.472-3.168-2.88t-2.56-1.952q-1.44-0.8-3.040-0.384t-2.432 1.856-0.416 3.040 1.888 2.432q0.832 0.48 2.912 1.248t4.128 1.28q-2.016 0.512-4.096 1.28t-2.944 1.248q-1.44 0.832-1.888 2.464z" />
            </svg>
          </div>

          {/* FORM */}
          <div className="w-full max-w-[380px]">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* NAME ROW */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={`w-full bg-transparent border px-5 py-[11px] text-[15px] focus-visible:outline-none transition-all rounded-full placeholder:text-[var(--text-muted)] ${errors.firstName ? "border-red-400" : "border-[var(--border)] focus:border-[var(--text)]"}`}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={`w-full bg-transparent border px-5 py-[11px] text-[15px] focus-visible:outline-none transition-all rounded-full placeholder:text-[var(--text-muted)] ${errors.lastName ? "border-red-400" : "border-[var(--border)] focus:border-[var(--text)]"}`}
                  />
                </div>
              </div>

              {/* EMAILId + PHONENo */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="emailId"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleChange}
                    placeholder="E-Mail"
                    className={`w-full bg-transparent border px-5 py-[11px] text-[15px] focus-visible:outline-none transition-all rounded-full placeholder:text-[var(--text-muted)] ${errors.emailId ? "border-red-400" : "border-[var(--border)] focus:border-[var(--text)]"}`}
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className={`w-full bg-transparent border px-5 py-[11px] text-[15px] focus-visible:outline-none transition-all rounded-full placeholder:text-[var(--text-muted)] ${errors.phoneNo ? "border-red-400" : "border-[var(--border)] focus:border-[var(--text)]"}`}
                  />
                </div>
              </div>

              {/* EVENT TYPE */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowEventModal(true)}
                  className={`w-full text-left border px-5 py-[11px] text-[15px] flex justify-between items-center transition-all rounded-full ${errors.eventType ? "border-red-400" : formData.eventType ? "border-[var(--text)] text-[var(--text)]" : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text)]"
                    }`}
                >
                  {formData.eventType || "Select Event Type"}
                  <span className="text-lg leading-none">+</span>
                </button>
              </div>

              {/* descDetails */}
              <div>
                <textarea
                  name="descDetails"
                  value={formData.descDetails}
                  onChange={handleChange}
                  placeholder="Description"
                  rows={4}
                  className={`w-full bg-transparent border px-5 py-[11px] text-[15px] focus-visible:outline-none transition-all rounded-3xl resize-none placeholder:text-[var(--text-muted)] ${errors.descDetails ? "border-red-400" : "border-[var(--border)] focus:border-[var(--text)]"}`}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[var(--text)] text-[var(--background)] py-3.5 rounded-full text-[12px] tracking-[0.15em] uppercase font-medium hover:opacity-90 active:scale-[0.985] transition-all disabled:opacity-70"
                >
                  {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT ASTERISK (desktop) */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <svg
              fill="var(--text-muted)"
              width="160"
              height="160"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1.728 20.992q-0.416 1.6 0.416 3.008 0.832 1.44 2.432 1.856t3.040-0.384q0.832-0.48 2.56-1.92t3.168-2.912q-0.608 2.016-0.96 4.192t-0.384 3.168q0 1.664 1.184 2.848t2.816 1.152 2.816-1.152 1.184-2.848q0-0.96-0.384-3.168t-0.928-4.192q1.44 1.504 3.168 2.944t2.528 1.888q1.44 0.832 3.040 0.384t2.432-1.856 0.416-3.008-1.888-2.464q-0.864-0.48-2.944-1.248t-4.064-1.28q2.016-0.512 4.096-1.28t2.912-1.248q1.44-0.832 1.888-2.432t-0.416-3.040q-0.832-1.44-2.432-1.856t-3.040 0.384q-0.832 0.512-2.528 1.92t-3.168 2.912q0.576-1.984 0.928-4.192t0.384-3.168q0-1.632-1.184-2.816t-2.816-1.184-2.816 1.184-1.184 2.816q0 0.992 0.384 3.168t0.96 4.192q-1.44-1.472-3.168-2.88t-2.56-1.952q-1.44-0.8-3.040-0.384t-2.432 1.856-0.416 3.040 1.888 2.432q0.832 0.48 2.912 1.248t4.128 1.28q-2.016 0.512-4.096 1.28t-2.944 1.248q-1.44 0.832-1.888 2.464z" />
            </svg>
          </div>
        </div>
      </div>

      {/* EVENT TYPE MODAL */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl w-full max-w-[360px] overflow-hidden">
            <div className="p-7">
              <h3 className="text-[21px] font-light text-center mb-6 text-[var(--text)]">
                Select Event Type
              </h3>
              <div className="space-y-2">
                {options.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectEvent(item)}
                    className="w-full text-left px-5 py-3.5 rounded-xl border border-[var(--border)] hover:bg-[var(--text)] hover:text-[var(--background)] transition-all text-[15px]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-[var(--border)] p-4">
              <button
                onClick={() => setShowEventModal(false)}
                className="w-full py-3 text-[13px] tracking-widest uppercase hover:bg-[var(--border)] rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-9 text-center max-w-[400px]">
            <h3 className="text-[23px] mb-3 text-[var(--text)]">Message Sent</h3>
            <p className="text-[14px] text-[var(--text-muted)] mb-8 leading-relaxed">
              Thank you for reaching out.<br />
              I’ll get back to you soon.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="uppercase tracking-[0.2em] text-[12px] border border-[var(--border)] px-9 py-3 rounded-xl hover:bg-[var(--text)] hover:text-[var(--background)] transition-all"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
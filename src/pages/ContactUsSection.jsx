
import React, { useState } from 'react';
import "../cssfiles/font.css";

import Button from "../utils/Button";
import { motion } from "framer-motion";
import {
  MapPin,
  ExternalLink,
  CheckCircle2,
  Send,
  Navigation
} from 'lucide-react';
import "../cssfiles/ContactUs.css";
import Divider from "../utils/Separator";

export default function ContactUs({
  venueName = "Siddaganga Institute of Technology, Tumkur",
  venueAddress = "B.H. Road, Tumakuru, Karnataka – 572103",
  contacts = [
    { name: "D. Jaya Srikar", role: "Chairman", phone: "+91 8217651756" },
    { name: "Jayadixitha S P", role: "WIE Chair", phone: "+91 9611274542" }
  ],
  onSubmitMessage,
  onSubmitEnquiry
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, phone, subject, message } = formData;
    const recipient = "wiecode2026@gmail.com";

    const emailSubject = encodeURIComponent(
      `WIE CODE 2K26 Enquiry: ${subject}`
    );

    const emailBody = encodeURIComponent(
      `New enquiry from WIE CODE 2K26 website\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Subject: ${subject}\n\n` +
      `Message:\n${message}`
    );

    if (onSubmitMessage) onSubmitMessage(formData);
    if (onSubmitEnquiry) onSubmitEnquiry(formData);

    window.location.href =
      `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;
  };

  const handleGetDirections = (e) => {
    e.preventDefault();

    const destinationQuery = encodeURIComponent(
      "Siddaganga Institute of Technology, B.H. Road, Tumakuru, Karnataka 572103"
    );

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destinationQuery}&travelmode=driving`,
            '_blank',
            'noopener,noreferrer'
          );
        },
        () => {
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}&travelmode=driving`,
            '_blank',
            'noopener,noreferrer'
          );
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${destinationQuery}&travelmode=driving`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <div className="contact-us-page-scope">
      <section className="wie-contact-section" aria-label="Contact and Venue Information">

        <div className="wie-bg" aria-hidden="true">
          <div className="wie-sw sw-a" />
          <div className="wie-sw sw-b" />
          <div className="wie-sw sw-c" />
          <div className="wie-ambient-glow-top" />
          <div className="wie-ambient-glow-bottom" />
        </div>

        <div className="wie-contact-container">

          <header className="wie-section-header">
            <h2 className="wie-section-title font-heading">
              CONTACT US
            </h2>

            <Divider />

            {/* <p className="wie-section-subtitle font-paragraph">
              Whether it’s a query about registrations, event schedules, or venue details, we’re here to make things easy.
            </p> */}
          </header>

          <div className="wie-contact-grid">

            {/* LEFT CARD: EVENT ENQUIRIES FORM */}

            <motion.section
              className="wie-contact-card"
              aria-labelledby="enquiries-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="wie-card-tag font-subheading">
                YOUR ENQUIRY
              </span>

              <form
                onSubmit={handleSubmit}
                className="wie-contact-form"
                noValidate={false}
              >

                <div className="wie-form-group">
                  <label htmlFor="wie-name-input" className="wie-form-label font-paragraph">
                    Full Name <span>*</span>
                  </label>
                  <input
                    id="wie-name-input"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="wie-form-input font-paragraph"
                    autoComplete="name"
                    aria-required="true"
                  />
                </div>

                <div className="wie-form-group">
                  <label htmlFor="wie-phone-input" className="wie-form-label font-paragraph">
                    Phone Number <span>*</span>
                  </label>
                  <input
                    id="wie-phone-input"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="wie-form-input font-paragraph"
                    autoComplete="tel"
                    aria-required="true"
                  />
                </div>

                <div className="wie-form-group">
                  <label htmlFor="wie-subject-input" className="wie-form-label font-paragraph">
                    Subject <span>*</span>
                  </label>
                  <input
                    id="wie-subject-input"
                    type="text"
                    name="subject"
                    placeholder="What's this about?"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="wie-form-input font-paragraph"
                    aria-required="true"
                  />
                </div>

                <div className="wie-form-group wie-message-group">
                  <label htmlFor="wie-message-input" className="wie-form-label font-paragraph">
                    Message <span>*</span>
                  </label>
                  <textarea
                    id="wie-message-input"
                    name="message"
                    placeholder="Tell us more about your enquiry..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="wie-form-textarea font-paragraph"
                    aria-required="true"
                  />
                </div>

                {/* REGISTRATION-STYLE ANIMATED BUTTON */}

                <div className="wie-submit-container">
                  <motion.div
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    style={{ width: "100%" }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="wie-btn-submit font-subheading"
                      aria-label={isSubmitting ? "Sending Enquiry" : "Submit Enquiry"}
                    >
                      {isSubmitting ? "SENDING..." : "SUBMIT ENQUIRY"}
                      <Send size={16} className="wie-btn-icon" />
                    </Button>
                  </motion.div>
                </div>

              </form>
            </motion.section>

            {/* RIGHT CARD: VENUE, CONTACT DETAILS & MAP */}

            <motion.section
              className="wie-contact-card"
              aria-labelledby="venue-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="wie-card-tag font-subheading">
                EVENT PLACE
              </span>

              <div className="wie-venue-header-row">
                <div className="wie-venue-icon-wrapper" aria-hidden="true">
                  <MapPin size={20} className="wie-venue-pin-icon" />
                </div>

                <div className="wie-venue-text">
                  <h4 className="wie-venue-name font-subheading">
                    {venueName}
                  </h4>
                  <p className="wie-venue-state font-paragraph">
                    {venueAddress}
                  </p>
                </div>
              </div>

              <div className="wie-contact-divider" aria-hidden="true" />

              <div className="wie-contact-leads">
                {contacts.map((contact, idx) => (
                  <React.Fragment key={idx}>
                    <div className="wie-contact-line">
                      <div className="wie-lead-details">
                        <span className="wie-lead-name font-subheading">
                          {contact.name}
                        </span>
                        <span className="wie-lead-role font-paragraph">
                          {contact.role}
                        </span>
                      </div>

                      {contact.phone && (
                        <a
                          href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                          className="wie-lead-phone-text font-numbers"
                          title={`Call ${contact.name}`}
                        >
                          {contact.phone}
                        </a>
                      )}
                    </div>

                    {idx < contacts.length - 1 && (
                      <div className="wie-contact-divider" aria-hidden="true" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="wie-campus-container wie-map-interactive-container">
                <iframe
                  title="Siddaganga Institute of Technology, Tumkur Campus Map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=77.1180%2C13.3210%2C77.1340%2C13.3340&layer=mapnik&marker=13.327668%2C77.126045"
                  className="wie-embedded-map"
                  loading="lazy"
                  aria-label="Map showing exact location of Siddaganga Institute of Technology, Tumkur"
                />

                <div className="wie-map-tint-overlay" aria-hidden="true" />

                <div className="wie-map-badge-location">
                  <span className="wie-badge-label font-paragraph">
                    OUR LOCATION
                  </span>
                  <span className="wie-badge-value font-subheading">
                    SIT Tumkur Campus
                  </span>
                </div>

                <div className="wie-map-btn-wrapper">
                  <motion.div
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                  >
                    <Button
                      type="button"
                      onClick={handleGetDirections}
                      className="wie-btn-submit wie-map-explore-btn font-subheading"
                      aria-label="Get Directions"
                    >
                      <Navigation size={14} />
                      GET DIRECTIONS
                      <ExternalLink size={13} className="wie-btn-icon" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        {/* TOAST NOTIFICATION */}

        {showToast && (
          <aside
            className="wie-toast-notification"
            role="status"
            aria-live="polite"
          >
            <span className="wie-toast-icon">
              <CheckCircle2 size={22} />
            </span>
            <div>
              <strong
                className="font-subheading"
                style={{ display: 'block', fontWeight: 600 }}
              >
                Message Sent!
              </strong>
              <span
                className="font-paragraph"
                style={{ fontSize: '0.82rem', color: '#D1D1DB' }}
              >
                We received your enquiry for WIE CODE 2K26.
              </span>
            </div>
          </aside>
        )}

      </section>
    </div>
  );
}

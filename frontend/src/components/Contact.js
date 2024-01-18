import React from 'react';
import '../Contact.css';

function Contact() {
  const submitForm = () => {
    // Handle form submission logic
    console.log('Form submitted!');
  };

  return (
    <div className="contact-container">
      <form id="contactForm" className="form-container">
        <h1>Say hi!</h1>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" rows="4" required></textarea>

        <button type="button" onClick={submitForm} className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Contact;

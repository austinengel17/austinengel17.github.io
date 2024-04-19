import React from 'react';
import '../Contact.css';
import { useState } from "react";


function Contact() {

    const backendHost = "localhost:8080/";
    const controllerEndpoint = "website/v1/contact";

    const[successfullySent, setSuccessfullySent] = useState(false);
    const[errorMessage, setErrorMessage] = useState(null);

    const[formData, setFormData] = useState(
        {
            name: "",
            emailAddress: "",
            subject: "",
            message: ""
        }
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const submitForm = (e) => {
    const xhr = new XMLHttpRequest();
    e.preventDefault();
    console.log(formData);

    const url = "http://" + backendHost + controllerEndpoint + "/email";
    console.log(`url is ${url}`);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE && (this.status == 202 || this.status == 200)){
                console.log(`Form successfully submitted! response: ${xhr.responseText} ${xhr.status}`);
                setSuccessfullySent(true);
            } else if(xhr.readyState === XMLHttpRequest.DONE && this.status == 429 || this.status == 500 || this.status == 404){
                console.log(`uh oh! response: ${xhr.responseText} ${xhr.status}`);
                setErrorMessage(xhr.responseText);
            } else {
                setErrorMessage("Oops! Something went wrong. Try again or reach out to me on LinkedIn!");
            }

    }

    const jsonFormData = JSON.stringify(formData);
    xhr.send(jsonFormData);
  };


  return (
    <div className="contact-container">
    {!successfullySent ? (
      <form onSubmit={submitForm} id="contactForm" className="form-container">
        <h1>Say hi!</h1>
        {errorMessage && (<div className="error-message">{errorMessage}</div>)}
        <label htmlFor="name">Name:</label>
        <input
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={formData.name}
            required
        />

        <label htmlFor="emailAddress">Email:</label>
        <input
            type="email"
            id="emailAddress"
            name="emailAddress"
            onChange={handleChange}
            value={formData.email}
            required
        />

        <label htmlFor="subject">Subject:</label>
        <textarea
            id="subject"
            name="subject"
            rows="1"
            onChange={handleChange}
            value={formData.subject}
            required
        />

        <label htmlFor="message">Message:</label>
        <textarea
            id="message"
            name="message"
            rows="4"
            onChange={handleChange}
            value={formData.message}
            required
        />

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      ) : (
        <div className="email-sent-container">
            <h2>Email Successfully Sent!</h2>
            {/* Additional success message or action */}
        </div>
      )
    }
    </div>
  );
}

export default Contact;

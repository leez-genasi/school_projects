import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';
import { sendContactMessage } from '../services/theatreApi.js';
import './VisitPage.css';

const faqs = [
  ['When should I arrive?', 'Please arrive 30 minutes before the performance.'],
  ['Can I exchange my ticket?', 'Contact the box office before your performance date to ask about changes.'],
  ['Is the theatre accessible?', 'Contact us before booking and we’ll help arrange access support.'],
  ['Is there a dress code?', 'There is no formal dress code. Smart casual clothing is welcome.'],
  ['Can I bring food or drinks?', 'Outside food and drinks are not allowed inside the auditorium.'],
  ['Where can I park?', 'Paid parking is available nearby. Please allow extra time before the performance.'],
  ['Can I take photos during the show?', 'Please keep phones and cameras away during performances.'],
  ['Are latecomers allowed into the auditorium?', 'Late seating may be delayed until a suitable break in the performance.'],
];

export default function VisitPage() {
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState(0);
  const [formState, setFormState] = useState('idle');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''        
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: ''    
  });

  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [location.hash]);

  function handleChange(e) {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value.trim()
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = {};
    
    // Form Validation
    if (!formData.name) {
      validationErrors.name = "Name is required.";
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+(\.[a-zA-Z]{2,}){0,2}\.[a-zA-Z]{2,3}$/; 
    if (!formData.email) {
        validationErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
        validationErrors.email = "Email is invalid";
    }

    if (!formData.message) {
      validationErrors.message = "Message is required";
    }

    setFormErrors(validationErrors);
    // If no errors, POST to server
    if (Object.keys(validationErrors).length === 0) {
      const result = await sendContactMessage(formData);
      console.log(result);
      setMessage(result.message)
    }
  }

  return (
    <PageLayout mainClassName="container visit-page">
      <section className="visit-section" id="getting-here">
        <p className="eyebrow">Plan your visit</p>
        <h1>Getting Here</h1>
        <p>Sands Theatre<br />10 Bayfront Avenue, Singapore</p>
        <div className="map-card">
          <img src="/images/theatre-map.jpg" className="theatre-map" alt="Map showing the theatre location" />
        </div>
        <div className="row visit-row">
          <div className="col-md-6">
            <h2 className="h6">By MRT</h2>
            <p>Take the train to Bayfront MRT and follow the signs to Marina Bay Sands.</p>
          </div>
          <div className="col-md-6">
            <h2 className="h6">By car</h2>
            <p>Parking is available at Marina Bay Sands. Allow extra time before the show.</p>
          </div>
        </div>
      </section>

      <section className="visit-section" id="contact">
        <div className="mb-5">
          <p className="eyebrow">Need a hand?</p>
          <h2>FAQs</h2>
          <div className="accordion mt-4" id="faqList">
            {faqs.map(([question, answer], index) => {
              const isOpen = openFaq === index;
              const panelId = `faq-${index + 1}`;
              return (
                <div className="accordion-item" key={question}>
                  <h3 className="accordion-header">
                    <button
                      className={`accordion-button${isOpen ? '' : ' collapsed'}`}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    >
                      {question}
                    </button>
                  </h3>
                  {isOpen && <div className="accordion-body" id={panelId}>{answer}</div>}
                </div>
              );
            })}
          </div>
        </div>
        <p className="eyebrow">We’re here to help</p>
        <h2>Contact Us</h2>
        <small>Asterisk * indicates required fields</small><br /><br />
        <form className="contact-form row" onSubmit={handleSubmit} noValidate>
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Name *</label>
            <input id="name" name="name" className="form-control" maxLength="150" autoComplete="name" 
            onChange={handleChange} 
            required />
            { formErrors.name && <div className="error">{formErrors.name}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email *</label>
            <input id="email" name="email" type="email" className="form-control" maxLength="254" autoComplete="email" 
            onChange={handleChange} 
            required />
            { formErrors.email && <div className="error">{formErrors.email}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="message" className="form-label">Message *</label>
            <textarea id="message" name="message" className="form-control" rows="4" maxLength="5000" 
            onChange={handleChange} 
            required />
            { formErrors.message && <div className="error">{formErrors.message}</div>}
          </div>
          <div className="col-12">
            <button className="btn btn-black" type="submit" disabled={formState === 'sending'}>
              {formState === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            {message && <span className={`small status${formState === 'error' ? ' text-danger' : ''}`} role="status">{message}</span>}
          </div>
        </form>
      </section>
    </PageLayout>
  );
}
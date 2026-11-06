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
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [location.hash]);

  function handleChange(e) {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = {};
    
    // Form Validation
    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const messageText = formData.message.trim();

    if (name.length < 2 || name.length > 150) {
      validationErrors.name = 'Enter a name between 2 and 150 characters.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.length > 254 || !emailPattern.test(email)) {
      validationErrors.email = 'Enter a valid email address.';
    }

    if (subject.length < 2 || subject.length > 200) {
      validationErrors.subject = 'Enter a subject between 2 and 200 characters.';
    }

    if (messageText.length < 10 || messageText.length > 5000) {
      validationErrors.message = 'Enter a message between 10 and 5000 characters.';
    }

    setFormErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setFormState('sending');
      setMessage('');
      try {
        const result = await sendContactMessage({ ...formData, name, email, subject, message: messageText });
        setFormState('success');
        setMessage(result.emailSent
          ? 'Your message was saved. A confirmation email was sent.'
          : 'Your message was saved. Confirmation email could not be sent.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } catch (error) {
        setFormState('error');
        setMessage(error.message);
      }
    }
  }

  return (
    <PageLayout mainClassName="container visit-page">
      <h1>Getting Here</h1>
      <section className="visit-section" id="getting-here">
        <p className="eyebrow">Plan your visit</p>
        <div className="map-card">
          <img src="/images/theatre-map.jpg" className="theatre-map" alt="Map showing the theatre location" />
        </div>
        <div className="row visit-row">
          <div className="left">
          <div className="col-md-6">
            <h2 className="h6">Via MRT</h2>
            <p>Located at Central MRT station (CE1/DT16).<br/><br />MRT services to/from Central MRT operate daily from 6am to 12am.</p>
          </div>
          <br />
          <div className="col-md-6">
            <h2 className="h6">Via Bus</h2>
            <p>Bus Stops: 
              <ul>
                <li>03509: XXX Hotel (outside Hotel Tower 2)
                  <ul><li>Bus 10, 11, 12, 13</li></ul>
                </li>
                <li>03510: XXX
                  <ul><li>Bus 18, 19, 20</li></ul>
                </li>
              </ul></p>
          </div>
          </div>
          <div className="right col-md-6">
            <h2 className="h6">By car</h2>
            <p>Parking is available at the Theatre. Allow extra time before the show.</p><br />
            <p><strong>Parking Options:</strong></p>
            <p>Theatre is accessible via XYZ Avenue.<br />
            North Entrance: XNV Avenue<br />
            South Entrance: XYZ Link</p>
            <p><strong>Parking Rates:</strong></p>
            <table>
              <tbody>
                <tr>
                  <td>Hourly Rate:</td>
                  <td>$200</td>
                </tr>
                <tr>
                  <td>Max Charge:</td>
                  <td>$2000/24 hours</td>
                </tr>
              </tbody>
            </table>
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
        <h1>Contact Us</h1>
        <form className="contact-form row" onSubmit={handleSubmit} noValidate>
          <p><small>Asterisk * indicates required fields</small></p><br /><br />
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">Name *</label>
            <input id="name" name="name" className="form-control" maxLength="150" autoComplete="name"
              value={formData.name} onChange={handleChange} required />
            {formErrors.name && <div className="error">{formErrors.name}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="email" className="form-label">Email *</label>
            <input id="email" name="email" type="email" className="form-control" maxLength="254" autoComplete="email"
              value={formData.email} onChange={handleChange} required />
            {formErrors.email && <div className="error">{formErrors.email}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="subject" className="form-label">Subject *</label>
            <input id="subject" name="subject" className="form-control" minLength="2" maxLength="200"
              value={formData.subject} onChange={handleChange} required />
            {formErrors.subject && <div className="error">{formErrors.subject}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="message" className="form-label">Message *</label>
            <textarea id="message" name="message" className="form-control" rows="4" minLength="10" maxLength="5000"
              value={formData.message} onChange={handleChange} required />
            {formErrors.message && <div className="error">{formErrors.message}</div>}
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
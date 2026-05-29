import React from 'react';

export default function Contact() {
  return (
    <main>
      <section className="courses" style={{ padding: '80px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="section-heading">Contact Us</h2>
        <div style={{ maxWidth: '600px', width: '100%', background: '#1e1e1e', padding: '40px', borderRadius: '10px' }}>
          <form className="auth-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Your Message" rows="5" style={{ width: '100%', padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }} required></textarea>
            </div>
            <button type="submit" className="auth-btn">Send Message</button>
          </form>
        </div>
      </section>
    </main>
  );
}

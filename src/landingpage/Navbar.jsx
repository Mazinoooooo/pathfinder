import { bsImage, baImage, adImage }  from '../assets'


export default function Navbar({ handleOpenModal }) {
  
    return (
      <main>
        <section id="home" className="home">
          <div className="home-content">
            <h1 className="underline">Welcome to PathFinder</h1>
            <p>Your guide to the best path in education</p>
            <button className="login-btn" onClick={handleOpenModal}>Get Started</button>
          </div>
        </section>
  
        <section id="about" className="courses">
          <div className="landing-container">
            <h2 className="section-title">About us</h2>
            <h1 className="about-section">
              <span className="typewriter">Lighting the way to your brightest future.</span>
            </h1>
            <div className="course-grid">
              <div className="course-card">
                <div className="course-image" style={{ backgroundImage: `url(${bsImage})` }}></div>
                <div className="course-info">
                  <h3>Bachelor of Science</h3>
                    <p>A degree focused on scientific, technical, or quantitative fields with a strong emphasis on practical and analytical skills.</p>
                  <span className="course-time">4 Year Course</span>
                </div>
              </div>
              <div className="course-card">
                <div className="course-image" style={{ backgroundImage: `url(${baImage})` }}></div>
                <div className="course-info">
                  <h3>Bachelor of Arts</h3>
                  <p>A degree centered on humanities, social sciences, or arts, promoting critical thinking and broad intellectual exploration.</p>
                  <span className="course-time">4 Year Course</span>
                </div>
              </div>
              <div className="course-card">
                <div className="course-image" style={{ backgroundImage: `url(${adImage})` }}></div>
                <div className="course-info">
                  <h3>Associate Degrees</h3>
                    <p>A program providing foundational education or vocational training, often used as a stepping stone to a bachelor's degree or direct employment.</p>
                  <span className="course-time">2 Year Program</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="services">
          <div className="landing-container">
            <h2 className="section-title">Featured Services</h2>
            <div className="services-grid">
              <div className="service-card">
                <svg className="service-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152l0 270.8c0 9.8-6 18.6-15.1 22.3L416 503l0-302.6zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6l0 251.4L32.9 502.7C17.1 509 0 497.4 0 480.4L0 209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77l0 249.3L192 449.4 192 255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Interest-Based Matching</h3>
                <p>Connects students' personal interests with suitable academic tracks and courses.</p>
              </div>
              <div className="service-card">
                <svg className="service-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                  <path d="M213.2 32L288 32l0 64c0 17.7 14.3 32 32 32s32-14.3 32-32l0-64 74.8 0c27.1 0 51.3 17.1 60.3 42.6l42.7 120.6c-10.9-2.1-22.2-3.2-33.8-3.2c-59.5 0-112.1 29.6-144 74.8l0-42.8c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 64c0 17.7 14.3 32 32 32c2.3 0 4.6-.3 6.8-.7c-4.5 15.5-6.8 31.8-6.8 48.7c0 5.4 .2 10.7 .7 16l-.7 0c-17.7 0-32 14.3-32 32l0 64L86.6 480C56.5 480 32 455.5 32 425.4c0-6.2 1.1-12.4 3.1-18.2L152.9 74.6C162 49.1 186.1 32 213.2 32zM352 368a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm211.3-43.3c-6.2-6.2-16.4-6.2-22.6 0L480 385.4l-28.7-28.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l40 40c6.2 6.2 16.4 6.2 22.6 0l72-72c6.2-6.2 6.2-16.4 0-22.6z" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Career Path Guidance</h3>
                <p>Helps students explore future careers aligned with their chosen strand or course.</p>
              </div>
              <div className="service-card">
                <svg className="service-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8 80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>Personal Recommendations</h3>
                <p>Provides tailored course suggestions based on each student's strengths, interests, and goals.</p>
              </div>
            </div>
          </div>
        </section>
  
        <section id="contact" className="contact">
          <div className="landing-container">
            <h2 className="section-title">Get in Touch</h2>
            <h1 className="contact-section">
              <span className="contact-motto">Have questions or feedbacks? We'd love to hear from you!</span>
            </h1>
            <form className="contact-form" id="contactForm">
            <div className="form-group-grid">
              <div className="form-field">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder='John Doe' required />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email Address</label>
                <input type="email" name="email" placeholder='123@path.com' required />
              </div>
            </div>
              <div className="form-group-message">
                <label htmlFor="feedback">Message</label>
                <textarea id="feedback" name="feedback" placeholder='Comment' required />
              </div>
              <div className="form-group">
                <button type="submit" className="contact-btn">Submit</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    );
  }

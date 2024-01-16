import React from 'react';
import '../About.css'; // Import your CSS file for styling
function About() {
  return (
    <>
        <div className="about-container">
          <section className="about-section">
            <h1>About Me</h1>
            <p>
              Hi, I'm Austin, a passionate and creative software developer based in Boston Massachusetts.
              I specialize in building web applications and have a strong foundation in Java Spring, both SQL and NoSQL, JavaScript, and much more.
            </p>
            <p>
              With two years of experience, I have worked on a variety of projects, ranging from
              constructing web pages and components, integrating google AI data modeling with analytics data, and automating integrity inspection during content modification. My goal is to create efficient and user-friendly
              solutions that make a positive impact.
            </p>
          </section>

          <section className="skills-section">
            <h2>Skills</h2>
            <ul>
              <li>Java</li>
              <li>JavaScript (ES6+)</li>
              <li>Postgres</li>
              <li>Solr</li>
              <li>React.js</li>
              <li>Node.js</li>
              <li>HTML5, CSS3</li>
            </ul>
          </section>

          <section className="experience-section">
            <h2>Experience</h2>
            <div className="experience-item">
                <h3>TechTarget - Software Engineer</h3>
                <p>
                    08/2021 - present: [Description of your role, responsibilities, and achievements]
                </p>
            </div>
            <div className="experience-item">
                <h3>Mayflower Interactive - Software Engineer (Part-Time)</h3>
                <p>
                    02/2021 - 06/2021: [Description of your role, responsibilities, and achievements]
                </p>
            </div>
          </section>

          <section className="education-section">
            <h2>Education</h2>
            <div className="education-item">
              <h3>Worcester State University - Computer Science Major | 09/2017 - 05/2021 </h3>
            </div>
            <div className="education-item">
                <h4>Courses:</h4> <div className="education-item-description">Algorithm Analysis | Data Structures I & II | Discrete Math I & II | Software Design, Construction and Architecture | Software Process Management | Unix Systems Programming | Computer Networking & Security | Operating Systems | Cloud, Parallel, and Distributed Computing | Software Quality Assurance & Testing | Geographical Information Systems I</div>
            </div>
            <div className="education-item">
                <h4>Capstone:</h4> <div className="education-item-description">Thea’s Food Pantry - Collaborated with a team to build the software used by Thea’s Food Pantry at Worcester State University. This was constructed in a microservice architecture using Express.js, Vue.js, RabbitMQ, MongoDB, and Docker.</div>
            </div>
          </section>

          <section className="interests-section">
            <h2>Interests</h2>
            <p>
              Apart from coding, I enjoy [Your Hobbies or Interests]. Whether it's exploring new technologies,
              reading tech blogs, or contributing to open-source projects, I'm always eager to learn and grow in
              the ever-evolving field of software development.
            </p>
          </section>
        </div>
    </>
  );
};

export default About;
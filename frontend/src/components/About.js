import React from 'react';
import '../About.css'; // Import your CSS file for styling
function About() {
  return (
    <>
        <div className="about-container">
          <section className="about-section">
            <h1>About Me</h1>
            <p>
              Hi, I'm Austin, a dedicated and creative software developer based in Boston Massachusetts.
              I specialize in building web applications and have a strong foundation in Java, JavaScript, RESTful APIs, both SQL and NoSQL, and much more.
            </p>
            <p>
              With three years of experience, I have worked on a variety of projects, ranging from website and API construction,
              integrating google AI data modeling with analytics, and automating text and hyperlink integrity inspection for content modification script runs.
              My goal is to create efficient and user-friendly solutions that make a positive impact. I'm always eager to learn and grow in the ever-evolving
              field of software development.
            </p>
          </section>

          <section className="skills-section">
            <div className="skills-column">
                <h2>Languages & Frameworks</h2>
                <ul>
                  <li>Java</li>
                  <li>JavaScript (ES6+)</li>
                  <li>PostgreSQL</li>
                  <li>Solr (noSQL)</li>
                  <li>React.js</li>
                  <li>Node.js</li>
                  <li>HTML5, CSS3</li>
                </ul>
            </div>
            <div className="tools-column">
                <h2>Tools</h2>
                <ul>
                    <li>Cloudflare</li>
                    <li>DataDog</li>
                    <li>DBmarlin</li>
                    <li>GTM</li>
                    <li>Bitbucket</li>
                    <li>Jira</li>
                </ul>
            </div>
          </section>
          <section className="experience-section">
            <h2>Experience</h2>
            <div className="experience-item">
                <h3>TechTarget - Software Engineer</h3>
                <p>
                    08/2021 - present
                </p>
                <p>
                    In this role I act as a primary developer for TechTarget's websites. This includes constructing and maintaining websites,
                    building supporting apps and scripts, and also, monitoring and investigating performance issues and errors. I also stay in close contact with the SEO team to provide technical guidance and support.
                    I am often digging into all aspects of our web applications, from server-side development and configuration, to client-side scripting and templating, to database management. This allows me a full perspective of our products.
                </p>
                <p>
                   Involved Skills: Critical thinking, communication, leadership, time management
                </p>
                <p>
                   Tech Stack: Java/Spring, JavaScript, JSP/JSTL, PostgreSQL, Apache Solr (noSQL), Tomcat, Apache HTTP
                </p>
            </div>
            <div className="experience-item">
                <h3>Mayflower Interactive - Software Engineer</h3>
                <p>
                    02/2021 - 06/2021
                </p>
                <p>
                    Met with clients to understand their vision and requirements for their sites. Crafted design proofs according to demands and presented them to customers.
                    Built web pages for small-medium sized clients using JavaScript (Node.js), MongoDB, HTML and CSS.
                </p>
                <p>
                   Involved Skills: Collaboration, Initiative
                </p>
                <p>
                   Tech Stack: Node.js, JavaScript, MongoDB
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
              Apart from coding, I enjoy a wide variety of outdoor activities, traveling, and exercise.
            </p>
          </section>
        </div>
    </>
  );
};

export default About;
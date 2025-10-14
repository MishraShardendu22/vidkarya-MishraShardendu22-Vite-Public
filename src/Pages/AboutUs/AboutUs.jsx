import styles from "./aboutUs.module.css";
import { ABOUT_ASSET } from "../../Assets/assetImages";
import { Navbar } from "../../Components";
import { useEffect, useRef, useState } from "react";
import { vidkaryaChapters } from "../../data/vidkaryaChapters"



function FounderProfile(props) {
  const { name, photoURL } = props;
  const imgRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.2 }
    );
    if (imgRef.current) io.observe(imgRef.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className={styles.profileWrapper}>
      <img
        ref={imgRef}
        src={photoURL}
        className={`${styles.profilePhoto} ${styles.imgReveal} ${visible ? styles.imgShow : ''}`}
        alt="img"
      />
      <span className={styles.founderName}> {name} </span>
      <span className={styles.founderDesc}> IIIT Dharwad </span>
    </div>
  );
}

export default function AboutUs() {
  const [selectedCollege, setSelectedCollege] = useState("IIIT-Dharwad");
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [reveals, setReveals] = useState({});
  const rootRef = useRef(null);

  const stats = [
    { key: "notes", label: "Notes & Resources", value: 50 },
    { key: "projects", label: "Student Projects", value: 15 },
    { key: "users", label: "Active Members", value: 400 },
    { key: "chapters", label: "College Chapters", value: 3 },
  ];

  const [counts, setCounts] = useState({ notes: 0, projects: 0, users: 0, chapters: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setStatsVisible(true);
        });
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Generic scroll reveal for sections
  useEffect(() => {
    const sections = rootRef.current?.querySelectorAll('[data-reveal]');
    if (!sections || !sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const next = {};
        entries.forEach((e) => { if (e.isIntersecting) next[e.target.dataset.reveal] = true; });
        setReveals((prev) => ({ ...prev, ...next }));
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Animate numbers once visible
  useEffect(() => {
    if (!statsVisible) return;

    const duration = 1200; // ms
    const start = performance.now();
    const targets = stats.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    let raf;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(progress);
      const next = {};
      Object.keys(targets).forEach((k) => {
        next[k] = Math.floor(targets[k] * eased);
      });
      setCounts(next);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [statsVisible]);

  const founders = [
    { name: "Chaitanya Giri", photoURL: ABOUT_ASSET.chaitanya_PhotoURL },
    { name: "Lucky Yadav", photoURL: ABOUT_ASSET.lucky_PhotoURL },
    { name: "Keshav Jha", photoURL: ABOUT_ASSET.keshav_PhotoURL },
    { name: "Hemant Dhawale", photoURL: ABOUT_ASSET.hemant_PhotoURL },
    { name: "Brij Vaghani", photoURL: ABOUT_ASSET.brij_PhotoURL },
  ];

function TeamMemberProfile(props) {
  const { name, role, photoURL } = props;
  const imgRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.2 }
    );
    if (imgRef.current) io.observe(imgRef.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className={styles.currProfileWrapper}>
      <img
        ref={imgRef}
        src={photoURL}
        className={`${styles.profilePhoto} ${styles.imgReveal} ${visible ? styles.imgShow : ''}`}
        alt={`${name} profile`}
      />
      <span className={styles.memberName}>{name}</span>
      <span className={styles.memberRole}>{role}</span>
    </div>
  );
}


  function handleContactUs() {
    const vidkaryaEmailId = "vidkarya@gmail.com";
    const mailToLink = `mailto:${vidkaryaEmailId}`;
    window.location.href = mailToLink;
  }


  function CollegeChaptersSection() {
    const currentCollegeData = vidkaryaChapters[selectedCollege];

    return (
      <div className={styles.collegeChaptersSection}>
        <div className={styles.collegeTabs}>
          {Object.keys(vidkaryaChapters).map((college) => (
              <span
              key={college}
              className={`${styles.collegeTab} ${selectedCollege === college ? styles.activeTab : ''}`}
              onClick={() => setSelectedCollege(college)}
            >
              {college}
            </span>
          ))}
        </div>
        <div className={styles.visionContainer}>
        <div className={styles.visionWrapper}>
          <span className={styles.visionSubHead}>Our Vision</span>
          <span className={styles.visionMainHead}>
            Transforming Education Through Innovation and Collaboration
          </span>
          <div className={styles.line}></div>
          <span className={styles.visionDescription}>
            {currentCollegeData.vision || "Coming soon..."}
          </span>
        </div>
      </div>
      
        {styles.currentTeam ? (
          <>
          <div className={styles.currentTeam}>
          {currentCollegeData.clubPresident.length > 0 && (
            <div className={styles.teamSection}>
              <span className={styles.teamSectionTitle}>Chapter Lead</span>
              <div className={styles.leaderSection}>
                {currentCollegeData.clubPresident.map((member) => (
                  <TeamMemberProfile
                    key={member.name}
                    name={member.name}
                    role={member.role}
                    photoURL={member.photoURL}
                  />
                ))}
              </div>
            </div>
          )}

          {currentCollegeData.techTeam.length > 0 && (
            <div className={styles.teamSection}>
              <span className={styles.teamSectionTitle}>Tech Team</span>
              <div className={styles.membersList}>
                {currentCollegeData.techTeam.map((member) => (
                  <TeamMemberProfile
                    key={member.name}
                    name={member.name}
                    role={member.role}
                    photoURL={member.photoURL}
                  />
                ))}
              </div>
            </div>
          )}

          {currentCollegeData.alumniTeam.length > 0 && (
            <div className={styles.teamSection}>
                  <span className={styles.teamSectionTitle}>Relations and Engagement Team</span>
              <div className={styles.membersList}>
                {currentCollegeData.alumniTeam.map((member) => (
                  <TeamMemberProfile
                    key={member.name}
                    name={member.name}
                    role={member.role}
                    photoURL={member.photoURL}
                  />
                ))}
              </div>
            </div>
          )}

          {currentCollegeData.contentTeam.length > 0 && (
            <div className={styles.teamSection}>
              <span className={styles.teamSectionTitle}>Content Team</span>
              <div className={styles.membersList}>
                {currentCollegeData.contentTeam.map((member) => (
                  <TeamMemberProfile
                    key={member.name}
                    name={member.name}
                    role={member.role}
                    photoURL={member.photoURL}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
          </>
        ) : 
        (
          <span>No data to display</span>
        )}
      </div>
    );
  }

  function StatsSection() {
    return (
      <section ref={statsRef}>
        <div className={styles.statsHeading}>Small team, real impact</div>
        <div className={styles.statsSub}>Every number here is earned with late nights, coffee, and community.</div>
        <div className={styles.statsWrap}>
          {stats.map((s, idx) => (
            <div className={styles.statCard} key={s.key} style={{ animationDelay: `${idx * 80}ms` }}>
              <div className={styles.statValue} data-target={s.value}>
                {counts[s.key]?.toLocaleString?.() || 0}
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`${styles.wrapper} ${styles.pageEnter}`} ref={rootRef}>
        {/* Landing Container */}
        <div className={`${styles.landingDiv} ${styles.reveal} ${reveals['hero'] ? styles.show : ''}`} data-reveal="hero">
          <div className={styles.bgOrbs}>
            <span className={styles.orbA}></span>
            <span className={styles.orbB}></span>
          </div>
          <div className={styles.landingImage}>
            <img
              src={ABOUT_ASSET.brandLogo}
              className={styles.aboutPageLogo}
              alt=""
            />
          </div>

          <div className={styles.landingContent}>
            <span className={styles.aboutSubHead}> About Us </span>
            <span className={styles.aboutHead}>
              We are Vidkarya, group of passionate tech enthusiasts, dedicated
              to crafting innovative solutions.
            </span>
            <div className={styles.line}></div>
            <span className={styles.aboutDescription}>
              Welcome to Vidkarya, where we embark on a mission to empower
              college students through a dynamic online platform. As avid tech
              enthusiasts ourselves, we understand the importance of accessible
              resources in the educational journey. At Vidkarya, we curate a
              rich repository of notes, blogs, and various useful materials,
              tailored to meet the diverse needs of college students. What sets
              us apart is our commitment to fostering collaboration and
              innovation. On our platform, users have the unique opportunity to
              not only access valuable resources but also to share their own
              projects. This collaborative space allows like-minded students to
              connect, exchange ideas, and embark on inspiring ventures
              together. Join us at Vidkarya, where knowledge meets
              collaboration, and together, we shape the future of learning.
            </span>
            <div
              className={styles.contactButton}
              onClick={() => handleContactUs()}
            >
              Contact Us
            </div>
          </div>
        </div>

        {/* Impact stats */}
        <div className={`${styles.reveal} ${reveals['stats'] ? styles.show : ''}`} data-reveal="stats">
          <StatsSection />
        </div>

        {/* FUTURE GOAL */}
        <div className={`${styles.mainContent} ${styles.reveal} ${reveals['goal'] ? styles.show : ''}`} data-reveal="goal">
          <span className={styles.mainSubHead}> Our Future Goal </span>
          <span className={styles.mainHead}>
            Empowering Tomorrow's Learning: Our Vision for Vidkarya's Future.
          </span>
          <div className={styles.line}></div>
          <span className={styles.mainDescription}>
            Our future goal at Vidkarya is to continually elevate the
            educational experience for students across the globe. We envision a
            platform that transcends traditional boundaries, fostering a global
            community of knowledge seekers and creators. Moving forward, we aim
            to expand our repository of resources, ensuring an even broader
            spectrum of academic support. Additionally, we aspire to enhance the
            collaborative features of our platform, creating a space where
            students can seamlessly connect, share insights, and embark on joint
            projects. Through technological innovation and a steadfast
            commitment to education, we strive to be at the forefront of shaping
            a future where learning knows no bounds, and students find
            inspiration and support in every corner of Vidkarya.
          </span>
        </div>

        {/* OUR TEAM */}
        <div className={`${styles.mainContent} ${styles.reveal} ${reveals['team'] ? styles.show : ''}`} data-reveal="team">
          <span className={styles.mainSubHead}> Our Team </span>
          <span className={styles.mainHead}>
            Meet the Visionaries: Our Collaborative Force at Vidkarya
          </span>
          <div className={styles.line}></div>
          <span className={styles.mainDescription}>
            Our Team at Vidkarya is a dynamic and passionate group of college
            students, driven by a shared commitment to revolutionize the
            educational landscape. Despite being a small cohort, our diverse
            talents and unwavering enthusiasm fuel our collective ambition. Each
            team member brings a unique perspective and skill set to the table,
            contributing to the innovative spirit that defines Vidkarya. As we
            navigate the challenges and triumphs of our educational journey, we
            stand united in our dedication to making a positive impact on the
            student community. Together, we are not just a team, we are a
            close-knit family, fostering creativity, collaboration, and a shared
            vision for the future of education.
          </span>
        </div>

        {/* TEAM DETAILS */}
        <div className={`${styles.foundingTeam} ${styles.reveal} ${reveals['founders'] ? styles.show : ''}`} data-reveal="founders">
          <div
            className={styles.teamCoverPic}
            style={{ backgroundImage: `url(${ABOUT_ASSET.founderCoverPic})` }}
          >
            <span className={styles.teamCoverText}> Founding Members </span>
          </div>

          <div className={styles.membersList}>
            {founders.map((founder) => {
              return (
                <FounderProfile
                  key={founder.name}
                  name={founder.name}
                  photoURL={founder.photoURL}
                />
              );
            })}
          </div>
        </div>
        {/* Website Admin */}
        {/* <div className={styles.contentTeam}>
          <span className={styles.mainHead}>Website Admin</span>
          <div className={styles.line}></div>
          <ul className={styles.contentTeamList}>
            <li>Kshitiz Sachan</li>
            <li>Divyansh Mishra</li>
          </ul>
        </div> */}

        {/* Content TEAM */}
        {/* <div className={styles.contentTeam}>
          <span className={styles.mainHead}>Content Team</span>
          <div className={styles.line}></div>
          <ul className={styles.contentTeamList}>
            <li>Ashith Shetty</li>
            <li>Mandar</li>
            <li>Sharan Thummagunti</li>
            <li>Virinchi Motupalli</li>
            <li>RS Gokul Arun</li>
            <li>Aditya Gangwar</li>
            <li>Vinay Jain</li>
            <li>Kartik Londhe</li>
          </ul>
        </div> */}

        <div className={`${styles.mainContent} ${styles.reveal} ${reveals['chapters'] ? styles.show : ''}`} data-reveal="chapters">
          <span className={styles.mainSubHead}>College Chapters</span>
          <span className={styles.mainHead}>
            Our Collaborative Network Across Institutions
          </span>
          <div className={styles.line}></div>
          <span className={styles.mainDescription}>
            Explore the dynamic teams representing Vidkarya across different 
            college campuses. Each chapter brings unique perspectives and 
            talents, united by our shared vision of transforming education.
          </span>
        </div>

        <CollegeChaptersSection />


      </div>
    </>
  );
}

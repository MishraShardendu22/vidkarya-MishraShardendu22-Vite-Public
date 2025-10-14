import qpPageImg from '../../../Assets/qpPageImg.png';
import Internship from '../Components/Internship';
import JobOpening from '../Components/JobOpening';
import Hackathon from '../Components/Hackathon';
import { Navbar } from '../../../Components';
import React, { useState } from 'react';
import Hero from '../Components/UI/Hero';
import CategoryCard from '../Components/UI/CategoryCard';
import { FaTrophy, FaUserGraduate, FaBriefcase } from 'react-icons/fa';
import QuickPeekModal from '../Components/UI/QuickPeekModal';
import { axios, CAREER } from '../../../api';
import { sendReqToServer } from '../../../Hooks/useAxios';

const palette = {
  orange: '#F97316',
  green: '#38B5AA',
};

const Career = () => {
  const [activePage, setActivePage] = useState('hackathon');
  const [peek, setPeek] = useState({ open: false, type: null, items: [] });

  const openPeek = async (type) => {
    setPeek({ open: true, type, items: [] });
    try {
      let url = CAREER.getHackathon;
      if (type === 'internship') url = CAREER.getInternship;
      if (type === 'jobs') url = CAREER.getJob;
      const { response } = await sendReqToServer({ axiosInstance: axios, url, method: 'GET' });
      setPeek({ open: true, type, items: response?.data || [] });
    } catch (e) {
      setPeek({ open: true, type, items: [] });
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case 'hackathon':
        return <Hackathon />;
      case 'internship':
        return <Internship />;
      case 'jobs':
        return <JobOpening />;
      default:
        return <Hackathon />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image as a Fixed Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${qpPageImg})`,
          backgroundAttachment: 'fixed',
        }}
      />

      <div className="relative z-10 min-h-screen bg-white/70">
        <Navbar />

        {/* Page Hero */}
        <Hero
          title="Explore Opportunities That Shape Your Future"
          subtitle="Discover curated hackathons, internships, and jobs — all in one place."
        />

        {/* Category Cards */}
        <section className="w-[90%] mx-auto px-4 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CategoryCard
              icon={FaTrophy}
              title="Hackathons"
              description="Compete, learn, and showcase your skills across domains."
              onClick={() => { setActivePage('hackathon'); openPeek('hackathon'); }}
            />
            <CategoryCard
              icon={FaUserGraduate}
              title="Internships"
              description="Launch your journey with roles tailored for learners."
              onClick={() => { setActivePage('internship'); openPeek('internship'); }}
            />
            <CategoryCard
              icon={FaBriefcase}
              title="Job Listings"
              description="Find your next role at top companies and startups."
              onClick={() => { setActivePage('jobs'); openPeek('jobs'); }}
            />
          </div>
        </section>

        {/* Tabs removed in favor of hero + category cards */}

        {/* Page Content */}
        <main className="w-full max-w-5xl mx-auto px-6 py-8">
          {renderContent()}
        </main>

        <QuickPeekModal
          open={peek.open}
          type={peek.type}
          items={peek.items}
          onClose={() => setPeek({ open: false, type: null, items: [] })}
          onGo={() => setPeek({ open: false, type: null, items: [] })}
        />
      </div>
    </div>
  );
};

export default Career;

import JobCard from './Jobs/Card';
import { axios, CAREER } from '../../../api';
import JobDescriptionModal from './Jobs/Moda';
import Pagination from '@mui/material/Pagination';
import React, { useState, useEffect } from 'react';
import { sendReqToServer } from '../../../Hooks/useAxios';
import FilterBar from './UI/FilterBar';

const Job = () => {
  const [Jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleQuery, setRoleQuery] = useState('');
  const [companyQuery, setCompanyQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { response } = await sendReqToServer({
          axiosInstance: axios,
          url: CAREER.getJob,
          method: 'GET',
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching Jobs:', error);
      }
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const totalPages = Math.ceil(Jobs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filtered = Jobs.filter((j) =>
    (roleQuery ? j.title.toLowerCase().includes(roleQuery.toLowerCase()) : true) &&
    (companyQuery ? (j.company || '').toLowerCase().includes(companyQuery.toLowerCase()) : true) &&
    (locationQuery ? (j.location || '').toLowerCase().includes(locationQuery.toLowerCase()) : true)
  );
  const currentJobs = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const handlePagination = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-[90%] mx-auto px-4 pb-10">
      <div className="text-center">
        <p className="heading">Discover Jobs</p>
        <div className="mx-auto mt-2 h-1 w-24 rounded-full" style={{ backgroundColor: '#38B5AA' }} />
        <p className="text-[#838383] text-xl md:text-2xl mb-10 mt-3">
          Your gateway to curated career opportunities, connecting IIIT Dharwad talent with
          industry-leading companies.
        </p>
      </div>

      <div className="mb-6">
        <FilterBar>
          <input placeholder="Search role" value={roleQuery} onChange={(e) => setRoleQuery(e.target.value)} />
          <input placeholder="Company" value={companyQuery} onChange={(e) => setCompanyQuery(e.target.value)} />
          <input placeholder="Location" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} />
          <div style={{ alignSelf: 'center', color: '#6b7280' }}>Total: {filtered.length}</div>
        </FilterBar>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentJobs.map((Job, index) => (
          <JobCard
            loading={loading}
            key={Job._id}
            Job={Job}
            cardIndex={index}
            onViewDescription={(description) => setSelectedDescription(description)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center p-1 my-4">
          <Pagination count={totalPages} color="primary" onChange={handlePagination} />
        </div>
      )}

      {selectedDescription && (
        <JobDescriptionModal
          description={selectedDescription}
          onClose={() => setSelectedDescription(null)}
        />
      )}
    </div>
  );
};

export default Job;

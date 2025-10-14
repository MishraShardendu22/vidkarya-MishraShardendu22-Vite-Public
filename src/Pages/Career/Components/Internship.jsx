import React, { useState, useEffect } from 'react';
import { sendReqToServer } from '../../../Hooks/useAxios';
import { axios, CAREER } from '../../../api';
import Pagination from '@mui/material/Pagination';
import InternshipCard from './Internship/InternshipCard';
import InternshipDescriptionModal from './Internship/Modal';

const Internship = () => {
  const [internships, setInternships] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDescription, setSelectedDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const { response } = await sendReqToServer({
          axiosInstance: axios,
          url: CAREER.getInternship,
          method: 'GET',
        });
        setInternships(response.data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      }
    };
    setLoading(false);
    fetchInternships();
  }, []);

  const totalPages = Math.ceil(internships.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInternships = internships.slice(indexOfFirstItem, indexOfLastItem);

  const handlePagination = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-[90%] mx-auto px-4 pb-10">
      <div className="text-center">
        <p className="heading">Discover Internships</p>
        <div className="mx-auto mt-2 h-1 w-24 rounded-full" style={{ backgroundColor: '#38B5AA' }} />
        <p className="text-[#838383] text-xl md:text-2xl mb-10 mt-3">
          Launch your career journey with diverse internship opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentInternships.map((internship, index) => (
          <InternshipCard
            loading={loading}
            key={internship._id}
            internship={internship}
            cardIndex={index + indexOfFirstItem}
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
        <InternshipDescriptionModal
          description={selectedDescription}
          onClose={() => setSelectedDescription(null)}
        />
      )}
    </div>
  );
};

export default Internship;

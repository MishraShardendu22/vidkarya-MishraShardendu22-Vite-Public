import { sendReqToServer } from '../../../Hooks/useAxios';
import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import { axios, CAREER } from '../../../api';
import HackathonCard from './Hackathon/Card';
import Skeleton from './Skeleton';
import FilterBar from './UI/FilterBar';
import Countdown from './UI/Countdown';

const HackathonPage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('');
  const [dateOrder, setDateOrder] = useState('');
  const itemsPerPage = 8;

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const { response } = await sendReqToServer({
        axiosInstance: axios,
        url: CAREER.getHackathon,
        method: 'GET',
      });

      if (response) {
        setHackathons(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching hackathons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHackathons();
  }, []);

  const handlePagination = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const filtered = hackathons
    .filter((h) => (domain ? (h.theme || '').toLowerCase().includes(domain.toLowerCase()) : true))
    .sort((a, b) => {
      if (!dateOrder) return 0;
      const da = new Date(a.startDate).getTime();
      const db = new Date(b.startDate).getTime();
      return dateOrder === 'asc' ? da - db : db - da;
    });
  const currentHackathons = filtered.slice(firstIndex, lastIndex);

  return (
    <div className="w-[90%] mx-auto px-4 pb-10">
      <div className="text-center">
        <p className="heading">Discover Hackathons</p>
        <div className="mx-auto mt-2 h-1 w-24 rounded-full" style={{ backgroundColor: '#38B5AA' }} />
        <p className="text-[#838383] text-xl md:text-2xl mb-10 mt-3">
          From weekend warriors to coding champions — your next hackathon adventure starts here.
        </p>
      </div>
      <div className="mb-6">
        <FilterBar>
          <input placeholder="Filter by domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
          <select value={dateOrder} onChange={(e) => setDateOrder(e.target.value)}>
            <option value="">Date: Any</option>
            <option value="asc">Date: Oldest first</option>
            <option value="desc">Date: Newest first</option>
          </select>
          <div style={{ alignSelf: 'center', color: '#6b7280' }}>Total: {filtered.length}</div>
          <div style={{ alignSelf: 'center', color: '#6b7280' }}>Next starts in: <Countdown targetDate={filtered[0]?.startDate} /></div>
        </FilterBar>
      </div>
      <div className="flex flex-wrap justify-between gap-6 py-6">
        {loading
          ? [...Array(itemsPerPage)].map((_, index) => (
              <div key={`skeleton-${index}`} className="w-full md:w-[48%]">
                <Skeleton />
              </div>
            ))
          : currentHackathons.map((hackathon, index) => (
              <div key={hackathon._id} className="w-full md:w-[48%]">
                <HackathonCard hackathon={hackathon} index={firstIndex + index} />
              </div>
            ))}
      </div>
      {!loading && totalPages > 1 && (
        <div className="flex justify-center p-1 my-4">
          <Pagination count={totalPages} color="primary" onChange={handlePagination} />
        </div>
      )}
    </div>
  );
};

export default HackathonPage;

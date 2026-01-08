import React, { useEffect, useState } from 'react'
import './alumni.css'
import { Navbar } from '../../Components'
import ProfileCard from './profileCard'
import { getJSONFromFirebase } from "../../Helpers"
import { AlumniSkeleton } from '../../Components/index.js'

const Alumni = () => {
  
  const [alumniData, setAlumniData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJsonFromFirebase() {
      try {
        setIsLoading(true);
        const res = await getJSONFromFirebase("alumniData");
        if (res && res.length > 0) {
          setAlumniData(res);
        } else {
          // Set empty array instead of null to prevent infinite loading
          setAlumniData([]);
        }
      } catch (err) {
        console.error('Failed to fetch alumni data:', err);
        setError(err.message);
        setAlumniData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJsonFromFirebase();
  },[])

  return (
    <>
      <Navbar />
      {isLoading ? (
        <AlumniSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Unable to Load Alumni Data</h2>
          <p className="text-gray-600 mb-4">There was an error connecting to the database.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      ) : alumniData && alumniData.length > 0 ? (
        <>
          <h1 className="alumni-heading">
            The Most Exciting <span className="highlight">Alumni-Mentorship</span> Programme
          </h1>
          <div className="alumni-content">
            {alumniData.map((alumni, index) => (
              <ProfileCard
                key={index}
                data={alumni}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No Alumni Data Available</h2>
          <p className="text-gray-600">Check back soon for alumni profiles and mentorship opportunities.</p>
        </div>
      )}
    </>
  )
}

export default Alumni;

import React from 'react';
import DOMPurify from 'dompurify';

const color = {
  orange: '#F97316',
};

const JobDescriptionModal = ({ description, onClose }) => {
  if (!description) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-11/12 md:w-3/4 lg:w-1/2">
        <h2 className="text-2xl font-semibold mb-4" style={{ color: color.orange }}>
          Job Description
        </h2>
        <div className="max-h-96 overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }} />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: color.orange }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionModal;

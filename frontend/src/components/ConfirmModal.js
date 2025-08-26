import React from 'react';

const ConfirmModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null; // Don't render the modal if not needed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl text-white max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Confirm Deletion</h2>
        <p className="mb-6 text-lg text-center">
          Are you sure you want to delete this submission? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-6">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-lg bg-gray-600 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 text-lg bg-red-600 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSpinner, FaExclamationCircle, FaTrash, FaFilePdf, FaFileExcel  } from 'react-icons/fa';
import ConfirmModal from './ConfirmModal'; // Import the custom modal component
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axiosInstance from '../utils/axiosinstance';

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
  const [deleting, setDeleting] = useState(false); // Delete loading state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [submissionToDelete, setSubmissionToDelete] = useState(null); // Store which submission is to be deleted
  const token = localStorage.getItem('UserToken');

  const location = useLocation();
  const navigate = useNavigate();
  const { quizCode: quizCode2, quizTitle: title2 } = location.state || {};

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await axiosInstance.get('quiz/submissions', {
          params: { quizCode: quizCode2 }       
        });
        if (data.success) {
          setSubmissions(data.submissions);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('An error occurred while fetching submissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [quizCode2]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSubmissions = [...submissions].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const openDeleteModal = (submissionId) => {
    setSubmissionToDelete(submissionId); // Store the submission to be deleted
    setShowModal(true); // Show the confirmation modal
  };

  const handleDelete = async () => {
    try {
      setDeleting(true); // Set delete loading state
      await axiosInstance.delete(`quiz/submissions/${submissionToDelete}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
        withCredentials: true,
      });
      toast.success('Submission deleted successfully');
      setSubmissions(submissions.filter(sub => sub._id !== submissionToDelete)); // Update state after deletion
      setShowModal(false); // Close the modal after deletion
    } catch (err) {
      // console.error('Error deleting submission:', err);
      toast.error('Failed to delete the submission. Please try again.');
      // setError('Failed to delete the submission. Please try again.');
    } finally {
      setDeleting(false); // Reset delete loading state
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Username', 'Score', 'Submitted At'];
    const tableRows = [];

    sortedSubmissions.forEach(submission => {
      const submissionData = [
        submission.username,
        submission.score,
        new Date(submission.submittedAt).toLocaleString(),
      ];
      tableRows.push(submissionData);
    });

    doc.text(`Quiz Submissions Report - ${title2}`, 14, 16);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('submissions_report.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      sortedSubmissions.map(submission => ({
        Username: submission.username,
        Score: submission.score,
        'Submitted At': new Date(submission.submittedAt).toLocaleString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    XLSX.writeFile(workbook, 'submissions_data.xlsx');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <FaSpinner className="animate-spin text-4xl mb-4" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center text-red-500">
          <FaExclamationCircle className="text-4xl mb-4" />
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-blue-600 mb-4">Quiz Submissions Dashboard</h1>
            <p className="text-gray-400 mb-1">
              Quiz Title: <span className="font-semibold text-white">{title2 || 'N/A'}</span>
            </p>
            <p className="text-gray-400 mb-1">
              Quiz Code: <span className="font-semibold text-white">{quizCode2 || 'N/A'}</span>
            </p>
            <p className="text-gray-400">
              Total Submissions: <span className="font-semibold text-white">{sortedSubmissions.length}</span>
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Back
          </button>
        </header>

        {sortedSubmissions.length === 0 ? (
          <div className="text-center text-gray-400">No submissions found for this quiz.</div>
        ) : (
          <div className="overflow-x-auto">
          <div className="flex gap-4 mb-6">
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <FaFilePdf /> Download PDF
          </button>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FaFileExcel /> Download Excel
          </button>
        </div>
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-700 text-gray-300 text-left">
                  <th
                    className="py-3 px-4 border-b border-gray-600 cursor-pointer"
                    onClick={() => handleSort('username')}
                  >
                    Username {sortConfig.key === 'username' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-3 px-4 border-b border-gray-600 cursor-pointer"
                    onClick={() => handleSort('score')}
                  >
                    Score {sortConfig.key === 'score' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="py-3 px-4 border-b border-gray-600 cursor-pointer"
                    onClick={() => handleSort('submittedAt')}
                  >
                    Submitted At {sortConfig.key === 'submittedAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="py-3 px-4 border-b border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedSubmissions.map((submission, index) => (
                  <tr
                    key={submission._id}
                    className={`${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} hover:bg-gray-700`}
                  >
                    <td className="py-3 px-4 border-b border-gray-600 text-gray-200">{submission.username}</td>
                    <td className="py-3 px-4 border-b border-gray-600 text-gray-200">{submission.score}</td>
                    <td className="py-3 px-4 border-b border-gray-600 text-gray-200">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 border-b border-gray-600 text-gray-200">
                      <button
                        className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ${
                          deleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={() => openDeleteModal(submission._id)}
                        disabled={deleting}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom confirmation modal */}
      <ConfirmModal
        show={showModal}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default Dashboard;
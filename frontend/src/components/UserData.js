import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosinstance';

const UserData = ({ limit, searchTerm }) => {
  const [submissions, setSubmissions] = useState([]);
  const user = useSelector((store) => store.app.user);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const userId = user._id;
        const response = await axiosInstance.get(`quiz/user-submissions?userId=${userId}`);
        if (response.data.success) {
          setSubmissions(response.data.submissions);
        }
      } catch (error) {
        toast.error('Failed to fetch submissions');
      }
    };

    fetchSubmissions();
  }, [user]);

  const filteredSubmissions = searchTerm
    ? submissions.filter((submission) => {
        const quizTitle = submission.quizId?.title || 'N/A';
        const quizCode = submission.quizCode || 'N/A';
        const creatorName = submission.Creater?.fullName || 'N/A';

        return (
          quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quizCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          submission.score.toString().includes(searchTerm) ||
          creatorName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : submissions;

  const displaySubmissions = limit ? filteredSubmissions.slice(0, limit) : filteredSubmissions;

  const numberOfSubmissions = filteredSubmissions.length;
  const highestScore = filteredSubmissions.length > 0
    ? Math.max(...filteredSubmissions.map(submission => submission.score))
    : null;
  const lowestScore = filteredSubmissions.length > 0
    ? Math.min(...filteredSubmissions.map(submission => submission.score))
    : null;

  return (
    <div className="flex flex-col space-y-4 w-full p-4">
      <h2 className="text-lg font-bold mb-4 mt-10">Quiz Submissions:</h2>

      {numberOfSubmissions > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400">Total Submissions: {numberOfSubmissions}</p>
          {highestScore !== null && (
            <p className="text-sm text-gray-400">Highest Score: {highestScore}</p>
          )}
          {lowestScore !== null && (
            <p className="text-sm text-gray-400">Lowest Score: {lowestScore}</p>
          )}
        </div>
      )}

      <div className="space-y-4 w-full">
        {displaySubmissions.length > 0 ? (
          displaySubmissions.map((submission) => (
            <div
              key={submission._id}
              className="mb-5 bg-gray-800 shadow-lg hover:shadow-xl p-6 rounded-lg transition hover:bg-gray-700 cursor-pointer group"
            >
              <h3 className="text-xl font-semibold text-blue-500">
                {submission.quizId?.title || 'N/A'}
              </h3>
              <p className="text-sm text-gray-400">Quiz Code: {submission.quizCode || 'N/A'}</p>
              <p className="text-sm text-gray-400">Score: {submission.score}</p>
              <p className="text-sm text-gray-400">Submitted At: {new Date(submission.submittedAt).toLocaleString()}</p>
              {submission.Creater && (
                <div className="text-sm text-gray-400 mt-2">
                  <p>Quiz Created by: {submission.Creater.fullName || 'N/A'} ({submission.Creater.email || 'N/A'})</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-400">No submissions found</div>
        )}
      </div>
    </div>
  );
};

export default UserData;

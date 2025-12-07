import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { versesAPI } from '../services/api';

const Dashboard = () => {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVerses();
  }, []);

  const loadVerses = async () => {
    try {
      setLoading(true);
      const response = await versesAPI.list();
      setVerses(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'memorized':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'in_progress':
        return 'In Progress';
      case 'memorized':
        return 'Memorized';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading verses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Verses</h1>
        <Link
          to="/verses/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Verse
        </Link>
      </div>

      {verses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't added any verses yet.</p>
          <Link
            to="/verses/new"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Your First Verse
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {verses.map((verse) => (
            <Link
              key={verse.id}
              to={`/verses/${verse.id}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {verse.reference}
                  </h3>
                  <p className="text-sm text-gray-500">{verse.translation}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    verse.status
                  )}`}
                >
                  {getStatusLabel(verse.status)}
                </span>
              </div>
              <p className="text-gray-700 line-clamp-2">{verse.text_content}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

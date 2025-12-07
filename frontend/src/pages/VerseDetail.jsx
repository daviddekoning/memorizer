import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { versesAPI } from '../services/api';
import UpcomingView from '../components/UpcomingView';
import InProgressView from '../components/InProgressView';
import MemorizedView from '../components/MemorizedView';

const VerseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVerse();
  }, [id]);

  const loadVerse = async () => {
    try {
      setLoading(true);
      const response = await versesAPI.get(id);
      setVerse(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load verse');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVerse = async (updates) => {
    try {
      const response = await versesAPI.update(id, updates);
      setVerse(response.data);
    } catch (err) {
      throw err;
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    await handleUpdateVerse({ status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this verse?')) {
      try {
        await versesAPI.delete(id);
        navigate('/');
      } catch (err) {
        alert('Failed to delete verse');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading verse...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
        <Link
          to="/"
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!verse) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Verse not found</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          to="/"
          className="text-indigo-600 hover:text-indigo-700 mb-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {verse.reference}
            </h1>
            <p className="text-gray-600 mt-1">{verse.translation}</p>
          </div>
          <div className="flex gap-3 items-center">
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                verse.status
              )}`}
            >
              {getStatusLabel(verse.status)}
            </span>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {verse.status === 'upcoming' && (
        <UpcomingView verse={verse} onUpdateStatus={handleUpdateStatus} />
      )}

      {verse.status === 'in_progress' && (
        <InProgressView verse={verse} onUpdateVerse={handleUpdateVerse} />
      )}

      {verse.status === 'memorized' && (
        <MemorizedView verse={verse} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  );
};

export default VerseDetail;

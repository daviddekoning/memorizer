import { useState } from 'react';

const UpcomingView = ({ verse, onUpdateStatus }) => {
  const [loading, setLoading] = useState(false);

  const handleStartPractice = async () => {
    setLoading(true);
    try {
      await onUpdateStatus('in_progress');
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Ready to Start Memorizing
        </h3>
        <p className="text-blue-700">
          Read through the verse below. When you're ready to start hiding words and practicing, click "Start Practice".
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <p className="text-xl leading-relaxed text-gray-800">
          {verse.text_content}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleStartPractice}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Starting...' : 'Start Practice'}
        </button>
      </div>
    </div>
  );
};

export default UpcomingView;

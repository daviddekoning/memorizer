import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { versesAPI } from '../services/api';

const AddVerse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reference: '',
    translation: 'ESV',
    text_content: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await versesAPI.create(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to add verse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Verse</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-2">
            Reference
          </label>
          <input
            type="text"
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="e.g., John 3:16"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="translation" className="block text-sm font-medium text-gray-700 mb-2">
            Translation
          </label>
          <select
            id="translation"
            name="translation"
            value={formData.translation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="ESV">ESV</option>
            <option value="NIV">NIV</option>
            <option value="KJV">KJV</option>
            <option value="NASB">NASB</option>
            <option value="NLT">NLT</option>
            <option value="NKJV">NKJV</option>
          </select>
        </div>

        <div>
          <label htmlFor="text_content" className="block text-sm font-medium text-gray-700 mb-2">
            Verse Text
          </label>
          <textarea
            id="text_content"
            name="text_content"
            value={formData.text_content}
            onChange={handleChange}
            placeholder="Enter the verse text..."
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Verse'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVerse;

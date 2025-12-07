import { useState } from 'react';
import { tokenize } from '../utils/tokenizer';

const MemorizedView = ({ verse, onUpdateStatus }) => {
  const [revealedCount, setRevealedCount] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const words = tokenize(verse.text_content);

  const handleNextWord = () => {
    if (revealedCount < words.length) {
      setRevealedCount(revealedCount + 1);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
    setRevealedCount(words.length);
  };

  const handleReset = () => {
    setRevealedCount(0);
    setShowAll(false);
  };

  const handlePracticeAgain = async () => {
    try {
      await onUpdateStatus('in_progress');
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          🎉 Memorized!
        </h3>
        <p className="text-green-700">
          Great job! You've marked this verse as memorized. Use the recall helper below to practice reciting it.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-xl leading-relaxed">
          {words.map((word, index) => (
            <span key={index}>
              <span
                className={`inline-block transition-all ${
                  index < revealedCount || showAll
                    ? 'text-gray-800'
                    : 'text-transparent'
                }`}
              >
                {word}
              </span>
              {' '}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Recall Progress
          </span>
          <span className="text-sm text-gray-600">
            {revealedCount} / {words.length} words
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${words.length > 0 ? (revealedCount / words.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleNextWord}
          disabled={revealedCount >= words.length}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Word
        </button>
        <button
          onClick={handleShowAll}
          disabled={showAll}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Show All
        </button>
        <button
          onClick={handleReset}
          disabled={revealedCount === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          onClick={handlePracticeAgain}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors ml-auto"
        >
          Practice Again
        </button>
      </div>
    </div>
  );
};

export default MemorizedView;

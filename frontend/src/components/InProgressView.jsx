import { useState, useEffect, useCallback } from 'react';
import { tokenize, getRandomVisibleIndex } from '../utils/tokenizer';

const InProgressView = ({ verse, onUpdateVerse }) => {
  const [words, setWords] = useState([]);
  const [hiddenIndices, setHiddenIndices] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const tokens = tokenize(verse.text_content);
    setWords(tokens);
    setHiddenIndices(verse.hidden_indices || []);
  }, [verse]);

  // Debounced save function
  const saveHiddenIndices = useCallback(
    async (indices) => {
      setIsSaving(true);
      try {
        await onUpdateVerse({ hidden_indices: indices });
      } catch (error) {
        console.error('Failed to save hidden indices:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [onUpdateVerse]
  );

  // Debounce the save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hiddenIndices.length > 0 || verse.hidden_indices?.length > 0) {
        saveHiddenIndices(hiddenIndices);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [hiddenIndices, saveHiddenIndices, verse.hidden_indices]);

  const toggleWordVisibility = (index) => {
    setHiddenIndices((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const hideRandomWord = () => {
    const randomIndex = getRandomVisibleIndex(words.length, hiddenIndices);
    if (randomIndex !== null) {
      setHiddenIndices((prev) => [...prev, randomIndex]);
    }
  };

  const resetWords = () => {
    setHiddenIndices([]);
  };

  const handleMarkMemorized = async () => {
    try {
      await onUpdateVerse({ status: 'memorized' });
    } catch (error) {
      console.error('Failed to mark as memorized:', error);
    }
  };

  const visibleCount = words.length - hiddenIndices.length;
  const progress = words.length > 0 ? ((hiddenIndices.length / words.length) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress: {hiddenIndices.length} of {words.length} words hidden
          </span>
          {isSaving && (
            <span className="text-xs text-gray-500">Saving...</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Practice Mode
        </h3>
        <p className="text-blue-700">
          Click on any word to hide it. Try to recall the verse with the hidden words. 
          Click hidden words to reveal them again.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="text-xl leading-relaxed">
          {words.map((word, index) => (
            <span key={index}>
              <button
                onClick={() => toggleWordVisibility(index)}
                className={`inline-block transition-all ${
                  hiddenIndices.includes(index)
                    ? 'bg-gray-300 text-transparent select-none cursor-pointer hover:bg-gray-400'
                    : 'text-gray-800 hover:bg-yellow-100 cursor-pointer'
                } px-1 rounded`}
                style={{
                  minWidth: hiddenIndices.includes(index) ? `${word.length * 0.6}em` : 'auto',
                }}
              >
                {word}
              </button>
              {' '}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={hideRandomWord}
          disabled={visibleCount === 0}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hide Random Word
        </button>
        <button
          onClick={resetWords}
          disabled={hiddenIndices.length === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Show All Words
        </button>
        <button
          onClick={handleMarkMemorized}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ml-auto"
        >
          Mark as Memorized
        </button>
      </div>
    </div>
  );
};

export default InProgressView;

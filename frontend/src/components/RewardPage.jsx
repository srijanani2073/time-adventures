import React from 'react';
import { Trophy, Star, RotateCcw, Book } from 'lucide-react';

const RewardPage = ({ selectedStory, storyStars, totalStars, resetStory, setCurrentPage }) => {
  const starsEarned = storyStars.filter(s => s).length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
        <Trophy size={100} color="#ffd700" className="mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Congratulations!</h1>
        <p className="text-xl text-gray-600 mb-8">
          You completed "{selectedStory.title}"!
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          {[...Array(3)].map((_, idx) => (
            <Star
              key={idx}
              size={60}
              fill={idx < starsEarned ? "#ffd700" : "none"}
              color={idx < starsEarned ? "#ffd700" : "#ccc"}
              className="animate-bounce"
              style={{ animationDelay: `${idx * 0.2}s` }}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-6">
            <div className="text-4xl font-bold text-gray-800">{starsEarned}/3</div>
            <div className="text-gray-600">Stars Earned</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6">
            <div className="text-4xl font-bold text-gray-800">{totalStars}</div>
            <div className="text-gray-600">Total Stars</div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-300 transition flex items-center justify-center gap-2"
            onClick={() => {
              resetStory();
              setCurrentPage('story');
            }}
          >
            <RotateCcw size={20} />
            Play Again
          </button>
          
          <button
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-2"
            onClick={() => setCurrentPage('stories')}
          >
            <Book size={20} />
            Choose Another Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardPage;
import React from 'react';
import { Clock, Star, Trophy, Book, Award, User } from 'lucide-react';

const HomePage = ({ currentUser, totalStars, completedStories, setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <User size={40} className="text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentUser?.username}</h2>
                <p className="text-gray-600 text-sm">{currentUser?.email}</p>
              </div>
            </div>
            <Clock size={50} className="text-purple-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Time Adventures</h1>
          <p className="text-center text-gray-600 mb-8">Learn to read clocks through exciting stories!</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-6 text-center">
              <Star size={32} fill="#ffd700" color="#ffd700" className="mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-800">{totalStars}</div>
              <div className="text-sm text-gray-600">Stars Earned</div>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl p-6 text-center">
              <Trophy size={32} color="#ff6b6b" className="mx-auto mb-2" />
              <div className="text-3xl font-bold text-gray-800">{completedStories.length}</div>
              <div className="text-sm text-gray-600">Stories Completed</div>
            </div>
          </div>
          
          <button
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-2"
            onClick={() => setCurrentPage('stories')}
          >
            <Book size={24} />
            Start Learning
          </button>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Clock size={32} className="mx-auto mb-2 text-purple-600" />
              <span className="text-sm text-gray-700 font-medium">Interactive Clocks</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Book size={32} className="mx-auto mb-2 text-pink-600" />
              <span className="text-sm text-gray-700 font-medium">Engaging Stories</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <Award size={32} className="mx-auto mb-2 text-yellow-600" />
              <span className="text-sm text-gray-700 font-medium">Earn Rewards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
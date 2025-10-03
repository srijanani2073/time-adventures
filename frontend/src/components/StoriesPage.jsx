import React from 'react';
import { Home, Trophy } from 'lucide-react';

const StoriesPage = ({ storiesData, completedStories, handleStorySelect, setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center gap-2 mb-6"
          onClick={() => setCurrentPage('home')}
        >
          <Home size={20} />
          Home
        </button>
        
        <h2 className="text-4xl font-bold text-white text-center mb-8">Choose Your Adventure</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storiesData.stories.map((story) => (
            <div
              key={story.storyId}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 transition"
              onClick={() => handleStorySelect(story)}
            >
              <div className="h-32" style={{ background: story.background }}></div>
              <div className="p-6">
                <div className="text-6xl text-center mb-4">{story.character}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">{story.title}</h3>
                <p className="text-gray-600 text-center mb-4">{story.description}</p>
                <div className="flex justify-between items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    story.difficulty === 'Easy' ? 'bg-green-200 text-green-800' :
                    story.difficulty === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {story.difficulty}
                  </span>
                  <span className="text-gray-600 text-sm">{story.steps.length} Levels</span>
                </div>
                {completedStories.includes(story.storyId) && (
                  <div className="mt-4 bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center justify-center gap-2">
                    <Trophy size={16} />
                    <span className="font-semibold">Completed</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesPage;
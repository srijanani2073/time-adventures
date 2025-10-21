import React, { useState, useContext } from 'react';
import { ArrowRight, Lightbulb, Star } from 'lucide-react';
import InteractiveClock from './InteractiveClock';
import { UserContext } from '../context/UserContext'; // or wherever your logged-in user is stored

const StoryPage = ({ 
  selectedStory, 
  currentStep, 
  setCurrentStep,
  storyStars,
  setStoryStars,
  showHint,
  setShowHint,
  setCurrentPage 
}) => {
  const { user } = useContext(UserContext); // logged-in user
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);

  const currentStepData = selectedStory.steps[currentStep];

  // Called whenever user sets the clock
  const handleTimeSet = (time) => {
    setUserAnswer(time);
  };

  // Called when user clicks "Check Answer"
  const checkAnswer = async () => {
    const isCorrect = userAnswer === currentStepData.answer;

    setFeedback({
      type: isCorrect ? 'success' : 'error',
      message: isCorrect ? 'Correct!' : 'Try again!'
    });

    // Update stars array
    const newStars = [...storyStars];
    newStars[currentStep] = isCorrect ? 1 : 0;
    setStoryStars(newStars);

    // Determine if story is completed
    const completed = isCorrect && currentStep === selectedStory.steps.length - 1;

    // Save progress to backend
   // Save progress to backend
if (!user?.id) {
  console.warn("No userId available — skipping progress save");
} else {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        storyId: selectedStory.storyId,
        stepIndex: currentStep,
        answer: userAnswer,
        isCorrect,
        starsEarned: isCorrect ? 1 : 0,
        completed
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Error saving progress:", err);
    }
  } catch (err) {
    console.error('Failed to save progress:', err);
  }
}


    // Move to next step if correct
    if (isCorrect && !completed) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setUserAnswer('');
        setFeedback(null);
      }, 800); // small delay for feedback
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header with back button and progress bar */}
          <div className="flex justify-between items-center mb-6">
            <button
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center gap-2"
              onClick={() => setCurrentPage('stories')}
            >
              <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
              Back
            </button>
            
            <div className="flex-1 mx-6">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / selectedStory.steps.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-600 mt-2">
                Level {currentStep + 1} of {selectedStory.steps.length}
              </p>
            </div>
          </div>

          {/* Story title & character */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{selectedStory.character}</div>
            <h2 className="text-3xl font-bold text-gray-800">{selectedStory.title}</h2>
          </div>

          {/* Step text */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
            <p className="text-lg text-gray-800 text-center">{currentStepData.text}</p>
          </div>

          {/* Clock */}
          <div className="flex justify-center mb-6">
            <InteractiveClock
              targetTime={currentStepData.answer}
              onTimeSet={handleTimeSet}
              isLocked={feedback?.type === 'success'}
              showTarget={false}
            />
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-xl mb-6 text-center font-semibold ${
              feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              className="flex-1 bg-yellow-400 text-gray-800 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition flex items-center justify-center gap-2"
              onClick={() => setShowHint(!showHint)}
            >
              <Lightbulb size={20} />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>

            <button
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={checkAnswer}
              disabled={!userAnswer || feedback?.type === 'success'}
            >
              Check Answer
              <ArrowRight size={20} />
            </button>
          </div>

          {/* Hint */}
          {showHint && (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-start gap-3 mb-6">
              <Lightbulb size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
              <p className="text-gray-800">{currentStepData.hint}</p>
            </div>
          )}

          {/* Stars */}
          <div className="flex justify-center gap-2">
            {storyStars.map((star, idx) => (
              <Star
                key={idx}
                size={32}
                fill={star ? "#ffd700" : "none"}
                color={star ? "#ffd700" : "#ccc"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPage;

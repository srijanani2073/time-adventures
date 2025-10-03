import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import StoriesPage from './components/StoriesPage';
import StoryPage from './components/StoryPage';
import RewardPage from './components/RewardPage';
import api from './services/api';

const TimeAdventuresApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [completedStories, setCompletedStories] = useState([]);
  const [totalStars, setTotalStars] = useState(0);
  const [storyStars, setStoryStars] = useState([]);
  const [storiesData, setStoriesData] = useState({ stories: [] });
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', email: '' });

  // Load stories on mount
  useEffect(() => {
    loadStories();
  }, []);

  // Load user progress when user logs in
  useEffect(() => {
    if (currentUser) {
      loadUserProgress();
    }
  }, [currentUser]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await api.storiesAPI.getAllStories();
      setStoriesData(data);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const progress = await api.progressAPI.getUserProgress(currentUser.id);
      const stats = await api.progressAPI.getUserStats(currentUser.id);
      
      const completed = progress.filter(p => p.completed).map(p => p.story_id);
      setCompletedStories(completed);
      setTotalStars(stats.total_stars || 0);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.username || !loginForm.email) {
      alert('Please enter both username and email');
      return;
    }

    try {
      setLoading(true);
      const { user, stats } = await api.userAPI.login(loginForm.username, loginForm.email);
      setCurrentUser(user);
      setTotalStars(stats.total_stars || 0);
      setCurrentPage('home');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStorySelect = (story) => {
    setSelectedStory(story);
    setCurrentStep(0);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    setStoryStars([]);
    setCurrentPage('story');
  };

  const handleTimeSet = (time) => {
    setUserAnswer(time);
  };

  const saveProgress = async (completed = false) => {
    if (!currentUser || !selectedStory) return;

    try {
      const starsEarned = storyStars.filter(s => s).length;
      
      await api.progressAPI.updateProgress({
        userId: currentUser.id,
        storyId: selectedStory.storyId,
        currentStep: currentStep,
        starsEarned: starsEarned,
        completed: completed,
        attempts: storyStars
      });

      if (completed) {
        await loadUserProgress();
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const checkAnswer = async () => {
    if (!selectedStory) return;
    
    const currentStepData = selectedStory.steps[currentStep];
    const correctAnswer = currentStepData.answer;
    
    const isCorrect = userAnswer === correctAnswer;
    
    if (isCorrect) {
      setFeedback({ type: 'success', message: 'Correct! Well done! 🎉' });
      setStoryStars([...storyStars, true]);
      setTotalStars(totalStars + 1);
      
      setTimeout(async () => {
        if (currentStep < selectedStory.steps.length - 1) {
          setCurrentStep(currentStep + 1);
          setUserAnswer('');
          setFeedback(null);
          setShowHint(false);
          await saveProgress(false);
        } else {
          if (!completedStories.includes(selectedStory.storyId)) {
            setCompletedStories([...completedStories, selectedStory.storyId]);
          }
          await saveProgress(true);
          setCurrentPage('reward');
        }
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: 'Not quite right. Try again!' });
      setStoryStars([...storyStars, false]);
    }
  };

  const resetStory = () => {
    setCurrentStep(0);
    setUserAnswer('');
    setFeedback(null);
    setShowHint(false);
    setStoryStars([]);
  };

  if (currentPage === 'login') {
    return (
      <LoginPage
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        loading={loading}
      />
    );
  }

  if (currentPage === 'home') {
    return (
      <HomePage
        currentUser={currentUser}
        totalStars={totalStars}
        completedStories={completedStories}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (currentPage === 'stories') {
    return (
      <StoriesPage
        storiesData={storiesData}
        completedStories={completedStories}
        handleStorySelect={handleStorySelect}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (currentPage === 'story' && selectedStory) {
    return (
      <StoryPage
        selectedStory={selectedStory}
        currentStep={currentStep}
        userAnswer={userAnswer}
        feedback={feedback}
        showHint={showHint}
        storyStars={storyStars}
        handleTimeSet={handleTimeSet}
        checkAnswer={checkAnswer}
        setShowHint={setShowHint}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (currentPage === 'reward' && selectedStory) {
    return (
      <RewardPage
        selectedStory={selectedStory}
        storyStars={storyStars}
        totalStars={totalStars}
        resetStory={resetStory}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  return null;
};

export default TimeAdventuresApp;
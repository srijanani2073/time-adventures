const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ----------------- ROUTES -----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Time Adventures API is running' });
});

// User login
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    let user;

    if (fetchError && fetchError.code === 'PGRST116') {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ username, email }])
        .select()
        .single();

      if (insertError) throw insertError;
      user = newUser;
    } else if (fetchError) {
      throw fetchError;
    } else {
      // Update username if changed
      if (existingUser.username !== username) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ username })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) throw updateError;
        user = updatedUser;
      } else {
        user = existingUser;
      }
    }

    // Get user stats
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('stars_earned, completed')
      .eq('user_id', user.id);

    if (progressError) throw progressError;

    const total_stars = progressData.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
    const stories_completed = progressData.filter(p => p.completed).length;

    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      stats: { total_stars, stories_completed }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all stories
app.get('/api/stories', async (req, res) => {
  try {
    const { data: stories, error } = await supabase
      .from('stories')
      .select('*')
      .order('story_id', { ascending: true });

    if (error) throw error;

    res.json({ stories });
  } catch (error) {
    console.error('Fetch stories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user progress
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    res.json(progress || []);
  } catch (error) {
    console.error('Fetch progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user progress stats
app.get('/api/progress/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: progress, error } = await supabase
      .from('user_progress')
      .select('stars_earned, completed')
      .eq('user_id', userId);

    if (error) throw error;

    const total_stars = progress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
    const stories_completed = progress.filter(p => p.completed).length;

    res.json({ total_stars, stories_completed });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update or insert user progress
app.post('/api/progress', async (req, res) => {
  try {
    const { userId, storyId, currentStep, starsEarned, completed, attempts } = req.body;

    const { data: existingProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('story_id', storyId)
      .single();

    let progress;

    if (fetchError && fetchError.code === 'PGRST116') {
      // Insert
      const { data: newProgress, error: insertError } = await supabase
        .from('user_progress')
        .insert([{
          user_id: userId,
          story_id: storyId,
          current_step: currentStep,
          stars_earned: starsEarned,
          completed,
          attempts
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      progress = newProgress;
    } else if (fetchError) {
      throw fetchError;
    } else {
      // Update
      const { data: updatedProgress, error: updateError } = await supabase
        .from('user_progress')
        .update({
          current_step: currentStep,
          stars_earned: starsEarned,
          completed,
          attempts,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('story_id', storyId)
        .select()
        .single();

      if (updateError) throw updateError;
      progress = updatedProgress;
    }

    res.json({ progress });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export app for Vercel serverless function
module.exports = app;

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ["https://time-adventures.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.options('*', cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);


app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Time Adventures API is running",
    endpoints: {
      health: "/api/health",
      login: "POST /api/users/login",
      stories: "GET /api/stories",
      progress: "GET /api/progress/:userId",
      stats: "GET /api/progress/:userId/stats",
      updateProgress: "POST /api/progress",
    },
  });
});


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Time Adventures API is running" });
});

// ================= USER ROUTES =================
app.post("/api/users/login", async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: "Username and email are required" });
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    let user;

    if (fetchError && fetchError.code === "PGRST116") {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([{ username, email }])
        .select()
        .single();
      if (insertError) throw insertError;
      user = newUser;
    } else if (fetchError) {
      throw fetchError;
    } else {
      if (existingUser.username !== username) {
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({ username })
          .eq("id", existingUser.id)
          .select()
          .single();
        if (updateError) throw updateError;
        user = updatedUser;
      } else {
        user = existingUser;
      }
    }

    const { data: progressData, error: progressError } = await supabase
      .from("user_progress")
      .select("stars_earned, completed")
      .eq("user_id", user.id);

    if (progressError) throw progressError;

    const total_stars = progressData.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
    const stories_completed = progressData.filter(p => p.completed).length;

    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      stats: { total_stars, stories_completed },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================= STORIES ROUTES =================
app.get("/api/stories", async (req, res) => {
  try {
    const { data: stories, error } = await supabase
      .from("stories")
      .select("*")
      .order("story_id", { ascending: true });
    if (error) throw error;
    res.json({ stories });
  } catch (error) {
    console.error("Fetch stories error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================= PROGRESS ROUTES =================
app.get("/api/progress/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: progress, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    res.json(progress || []);
  } catch (error) {
    console.error("Fetch progress error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/progress/:userId/stats", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data: progress, error } = await supabase
      .from("user_progress")
      .select("stars_earned, completed")
      .eq("user_id", userId);
    if (error) throw error;
    const total_stars = progress.reduce((sum, p) => sum + (p.stars_earned || 0), 0);
    const stories_completed = progress.filter(p => p.completed).length;
    res.json({ total_stars, stories_completed });
  } catch (error) {
    console.error("Fetch stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/progress", async (req, res) => {
  try {
    const { userId, storyId, currentStep, starsEarned, completed, attempts } = req.body;

    const { data: existingProgress, error: fetchError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("story_id", storyId)
      .single();

    let progress;

    if (fetchError && fetchError.code === "PGRST116") {
      const { data: newProgress, error: insertError } = await supabase
        .from("user_progress")
        .insert([{ user_id: userId, story_id: storyId, current_step: currentStep, stars_earned: starsEarned, completed, attempts }])
        .select()
        .single();
      if (insertError) throw insertError;
      progress = newProgress;
    } else if (fetchError) {
      throw fetchError;
    } else {
      const { data: updatedProgress, error: updateError } = await supabase
        .from("user_progress")
        .update({
          current_step: currentStep,
          stars_earned: starsEarned,
          completed,
          attempts,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("story_id", storyId)
        .select()
        .single();
      if (updateError) throw updateError;
      progress = updatedProgress;
    }

    res.json({ progress });
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

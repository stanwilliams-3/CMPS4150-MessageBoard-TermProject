import User from "../models/User.js";

export const showRegisterPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Register</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: 40px auto;
          padding: 20px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        input, button {
          padding: 10px;
          font-size: 16px;
        }
        a {
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <h1>Register</h1>
      <form method="POST" action="/auth/register">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <p><a href="/auth/login">Already have an account? Login</a></p>
    </body>
    </html>
  `);
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.send(`
        <h2>Username and password are required.</h2>
        <a href="/auth/register">Go back</a>
      `);
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.send(`
        <h2>That username is already taken.</h2>
        <a href="/auth/register">Try again</a>
      `);
    }

    const newUser = new User({
      username,
      password
    });

    await newUser.save();

    req.session.userId = newUser._id.toString();
    req.session.username = newUser.username;

    res.redirect("/home");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Server error during registration.");
  }
};

export const showLoginPage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 500px;
          margin: 40px auto;
          padding: 20px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        input, button {
          padding: 10px;
          font-size: 16px;
        }
        a {
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <h1>Login</h1>
      <form method="POST" action="/auth/login">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p><a href="/auth/register">Need an account? Register</a></p>
    </body>
    </html>
  `);
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.send(`
        <h2>Username and password are required.</h2>
        <a href="/auth/login">Go back</a>
      `);
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.send(`
        <h2>Invalid username or password.</h2>
        <a href="/auth/login">Try again</a>
      `);
    }

    if (user.password !== password) {
      return res.send(`
        <h2>Invalid username or password.</h2>
        <a href="/auth/login">Try again</a>
      `);
    }

    req.session.userId = user._id.toString();
    req.session.username = user.username;

    res.redirect("/home");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login.");
  }
};

export const showHomePage = (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Home</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 700px;
          margin: 40px auto;
          padding: 20px;
        }
        .box {
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 8px;
        }
        a {
          text-decoration: none;
          margin-right: 12px;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <h1>Home Page</h1>
        <p>Welcome, <strong>${req.session.username}</strong>!</p>
        <p>You are logged in.</p>
        <a href="/auth/logout">Logout</a>
      </div>
    </body>
    </html>
  `);
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Could not log out.");
    }

    res.redirect("/auth/login");
  });
};
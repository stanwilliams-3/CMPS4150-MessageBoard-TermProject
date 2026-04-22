import User from "../models/User.js";
import { layoutPage } from "../html/layout.js";
import { loginMainHtml, registerMainHtml } from "../html/pageTemplates.js";
import { appEventBus, AppEvents } from "../observers/AppEventBus.js";

export const showRegisterPage = (req, res) => {
  res.type("html").send(
    layoutPage({
      title: "Register",
      user: null,
      mainHtml: registerMainHtml({}),
    })
  );
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).type("html").send(
        layoutPage({
          title: "Register",
          user: null,
          mainHtml: registerMainHtml({
            error: "Username and password are required.",
          }),
        })
      );
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).type("html").send(
        layoutPage({
          title: "Register",
          user: null,
          mainHtml: registerMainHtml({ error: "That username is already taken." }),
        })
      );
    }

    const newUser = new User({
      username,
      password,
    });

    await newUser.save();

    req.session.userId = newUser._id.toString();
    req.session.username = newUser.username;
    appEventBus.publish(AppEvents.USER_SIGNED_IN, {
      userId: req.session.userId,
      username: req.session.username,
      source: "register",
    });

    res.redirect("/home");
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).send("Server error during registration.");
  }
};

export const showLoginPage = (req, res) => {
  res.type("html").send(
    layoutPage({
      title: "Log in",
      user: null,
      mainHtml: loginMainHtml({}),
    })
  );
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).type("html").send(
        layoutPage({
          title: "Log in",
          user: null,
          mainHtml: loginMainHtml({
            error: "Username and password are required.",
          }),
        })
      );
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).type("html").send(
        layoutPage({
          title: "Log in",
          user: null,
          mainHtml: loginMainHtml({ error: "Invalid username or password." }),
        })
      );
    }

    if (user.password !== password) {
      return res.status(401).type("html").send(
        layoutPage({
          title: "Log in",
          user: null,
          mainHtml: loginMainHtml({ error: "Invalid username or password." }),
        })
      );
    }

    req.session.userId = user._id.toString();
    req.session.username = user.username;
    appEventBus.publish(AppEvents.USER_SIGNED_IN, {
      userId: req.session.userId,
      username: req.session.username,
      source: "login",
    });

    res.redirect("/home");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error during login.");
  }
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

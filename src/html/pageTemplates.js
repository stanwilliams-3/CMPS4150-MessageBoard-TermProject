import { escapeHtml } from "./escape.js";

export function homeMainHtml({ flash, recentTopics }) {
  let html = `<h1>Your subscriptions</h1>
<p>
  Showing your two most recently interacted topics.
  <a href="/topics">Browse topics to subscribe</a>
</p>`;

  if (flash) {
    html += `<p role="status">${escapeHtml(flash)}</p>`;
  }

  const topics = recentTopics && recentTopics.length ? recentTopics : [];
  if (!topics.length) {
    html += `<div>
    <p>No recent topic activity yet. Open <a href="/topics">Browse topics</a> to subscribe or interact with topics.</p>
  </div>`;
    return html;
  }

  html += `<h2>Recent topics</h2><ul>`;
  for (const topic of topics) {
    const tid = escapeHtml(topic.topicId);
    const ttitle = escapeHtml(topic.topicTitle);
    const count = Number(topic.accessCount || 0);
    const when = topic.updatedAt
      ? escapeHtml(String(new Date(topic.updatedAt).toLocaleString()))
      : "unknown";

    html += `<li>
      <strong>${ttitle}</strong>
      <div>Topic id: <code>${tid}</code></div>
      <div>Interactions: ${count}</div>
      <div>Last activity: ${when}</div>
      <div><a href="/topics/${tid}">Open thread</a></div>
    </li>`;
  }
  html += `</ul>`;

  return html;
}

export function topicsMainHtml({ flash, topics }) {
  let html = `<h1>Topics</h1>
<p>Subscribe to a topic to see it on your <a href="/">home</a> feed.</p>
<h2>Create a new topic</h2>
<form method="post" action="/topics">
  <label for="topic-title">Title</label>
  <input id="topic-title" type="text" name="title" required maxlength="120">
  <button type="submit">Create topic</button>
</form>`;

  if (flash) {
    html += `<p role="status">${escapeHtml(flash)}</p>`;
  }

  const list = topics && topics.length ? topics : [];
  if (!list.length) {
    html += `<div>
    <p>No topics are available yet.</p>
  </div>`;
    return html;
  }

  html += `<h2>Available topics</h2><ul>`;
  for (const t of list) {
    const tid = escapeHtml(t.topicId);
    const title = escapeHtml(t.title);
    const accessCount = Number(t.accessCount || 0);
    html += `<li>
        <strong>${title}</strong>
        <div>Access count: ${accessCount}</div>
        <div><a href="/topics/${tid}">Open thread</a></div>
        <div>`;
    if (t.isSubscribed) {
      html += `<span>Subscribed</span>
<form method="post" action="/subscriptions/unsubscribe" style="display:inline;">
  <input type="hidden" name="topicId" value="${tid}">
  <button type="submit">Unsubscribe</button>
</form>`;
    } else {
      html += `<form method="post" action="/subscriptions/subscribe" style="display:inline;">
              <input type="hidden" name="topicId" value="${tid}">
              <button type="submit">Subscribe</button>
            </form>`;
    }
    html += `</div>
      </li>`;
  }
  html += `</ul>`;
  return html;
}

export function topicThreadMainHtml({ topicId, topicTitle, isSubscribed, messages }) {
  const tid = escapeHtml(topicId);
  const title = escapeHtml(topicTitle);

  let html = `<h1>${title}</h1>
<p><a href="/topics">Back to browse topics</a> | <a href="/">Back home</a></p>`;

  if (isSubscribed) {
    html += `<p>You are subscribed to this topic.</p>
<form method="post" action="/subscriptions/unsubscribe" style="display:inline;">
  <input type="hidden" name="topicId" value="${tid}">
  <button type="submit">Unsubscribe</button>
</form>
<form method="post" action="/messages/${tid}">
  <label for="thread-msg">Add a message</label>
  <textarea id="thread-msg" name="body" required maxlength="8000" rows="4"></textarea>
  <button type="submit">Post message</button>
</form>`;
  } else {
    html += `<p>You are not subscribed to this topic.</p>
<form method="post" action="/subscriptions/subscribe">
  <input type="hidden" name="topicId" value="${tid}">
  <button type="submit">Subscribe</button>
</form>`;
  }

  const list = messages && messages.length ? messages : [];
  if (!list.length) {
    html += `<h2>Messages</h2><p>No messages yet.</p>`;
    return html;
  }

  html += `<h2>Messages</h2><ul>`;
  for (const m of list) {
    const when =
      m.createdAt != null
        ? ` · ${escapeHtml(String(new Date(m.createdAt).toLocaleString()))}`
        : "";
    html += `<li>
  <div><strong>${escapeHtml(m.authorName ?? "Unknown")}</strong>${when}</div>
  <div>${escapeHtml(m.body ?? "")}</div>
</li>`;
  }
  html += `</ul>`;
  return html;
}

export function usersIndexMainHtml() {
  return `<h1>Members</h1>
<p>Public directory (usernames only). <a href="/users/me">Your profile</a> when signed in.</p>`;
}

export function usersListRowsHtml(users) {
  const list = users && users.length ? users : [];
  if (!list.length) {
    return `<div>
    <p>No members registered yet.</p>
  </div>`;
  }
  let html = `<ul>`;
  for (const u of list) {
    const uid = escapeHtml(u.userId);
    const un = escapeHtml(u.username);
    html += `<li>
        <strong>${un}</strong>
        <a href="/users/${uid}">View</a>
      </li>`;
  }
  html += `</ul>`;
  return html;
}

export function userProfileMainHtml({ profile, isSelf }) {
  if (!profile) {
    return `<p>Profile unavailable.</p>`;
  }
  const un = escapeHtml(profile.username);
  const uid = escapeHtml(profile.userId);
  const blurb = isSelf ? "This is your account." : "Member profile.";
  return `<h1>${un}</h1>
  <p>
    ${blurb}
    <a href="/users">Back to members</a>
  </p>
  <div>
    <p><strong>Username:</strong> ${un}</p>
    <p>User id (for links): <code>${uid}</code></p>
  </div>`;
}

export function loginMainHtml({ error }) {
  let html = `<h1>Log in</h1>
<p><a href="/auth/register">Need an account? Register</a></p>`;
  if (error) {
    html += `<p role="alert">${escapeHtml(error)}</p>`;
  }
  html += `<form method="post" action="/auth/login">
  <label for="login-username">Username</label>
  <input id="login-username" type="text" name="username" required maxlength="64">
  <label for="login-password">Password</label>
  <input id="login-password" type="password" name="password" required maxlength="128" autocomplete="current-password">
  <button type="submit">Log in</button>
</form>`;
  return html;
}

export function registerMainHtml({ error }) {
  let html = `<h1>Register</h1>
<p><a href="/auth/login">Already have an account? Log in</a></p>`;
  if (error) {
    html += `<p role="alert">${escapeHtml(error)}</p>`;
  }
  html += `<form method="post" action="/auth/register" autocomplete="off">
  <label for="register-username">Username</label>
  <input id="register-username" type="text" name="username" required maxlength="64" autocomplete="username">
  <label for="register-password">Password</label>
  <input id="register-password" type="password" name="password" required maxlength="128" autocomplete="new-password">
  <button type="submit">Create account</button>
</form>`;
  return html;
}

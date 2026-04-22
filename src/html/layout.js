import { escapeHtml } from "./escape.js";
import { readView } from "./loadView.js";

function navHtml(user) {
  const auth = user
    ? `<span>Signed in as <strong>${escapeHtml(user.username)}</strong></span>
        <form method="post" action="/auth/logout" style="display:inline;">
          <button type="submit">Log out</button>
        </form>`
    : `<a href="/auth/login">Log in</a>
        <a href="/auth/register">Register</a>`;

  return `<header>
  <div>
    <a href="/"><strong>Message Board</strong></a>
    <nav aria-label="Main">
      <a href="/">Home</a>
      <a href="/topics">Browse topics</a>
      <a href="/users">Members</a>
      ${auth}
    </nav>
  </div>
</header>`;
}


export function layoutPage({ title, user, mainHtml }) {
  const safeTitle = escapeHtml(title || "Message Board");
  const body = `${navHtml(user)}
<main>
${mainHtml}
</main>`;
  return readView("layout.html")
    .replaceAll("@@TITLE@@", safeTitle)
    .replaceAll("@@BODY@@", body);
}

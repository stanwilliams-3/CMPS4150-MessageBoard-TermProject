import { escapeHtml } from "./escape.js";
import { readView } from "./loadView.js";

function navHtml(user) {
  const auth = user
    ? `<span class="auth-text">Signed in as <strong>${escapeHtml(user.username)}</strong></span>
        <form method="post" action="/auth/logout" style="display:inline;">
          <button type="submit" class="btn btn--ghost btn--sm">Log out</button>
        </form>`
    : `<a class="btn btn--ghost btn--sm" href="/auth/login">Log in</a>
        <a class="btn btn--ghost btn--sm" href="/auth/register">Register</a>`;

  return `<header class="site-header">
  <div class="site-nav-wrap">
    <a class="brand" href="/"><strong>Message Board</strong></a>
    <nav class="site-nav" aria-label="Main">
      <a class="btn btn--ghost btn--sm" href="/">Home</a>
      <a class="btn btn--ghost btn--sm" href="/topics">Browse topics</a>
      <a class="btn btn--ghost btn--sm" href="/users">Members</a>
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

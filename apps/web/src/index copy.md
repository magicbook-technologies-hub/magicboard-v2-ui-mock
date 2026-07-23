@import "tailwindcss";

:root {
  --ink: #1a2332;
  --muted: #5b6b7c;
  --line: #e2e8f0;
  --surface: #f7f9fc;
  --card: #ffffff;
  --accent: #1f6b5a;
  --accent-soft: #e6f4ef;
  --warm: #c9783a;
  --warm-soft: #fff4ea;
  --danger: #b42318;
  --tip: #f5c542;
  --know: #3d9a6a;
  --err: #d64545;
  --font: "DM Sans", system-ui, sans-serif;
  --display: "Fraunces", Georgia, serif;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  height: 100%;
}

body {
  margin: 0;
  font-family: var(--font);
  color: var(--body);
  background: var(--surface);
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3,
.display {
  font-family: var(--display);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--ink);
}

button {
  font-family: inherit;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

@keyframes typingBounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-5px);
  }
}

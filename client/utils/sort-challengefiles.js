exports.sortChallengeFiles = function sortChallengeFiles(challengeFiles) {
  const xs = challengeFiles.slice();
  xs.sort((a, b) => {
    if (a.history[0] === 'index.html') return -1;
    if (b.history[0] === 'index.html') return 1;
    if (a.history[0] === 'styles.css') return -1;
    if (b.history[0] === 'styles.css') return 1;
    if (a.history[0] === 'index.jsx') return -1;
    if (b.history[0] === 'index.jsx') return 1;
    if (a.history[0] === 'script.js') return -1;
    if (b.history[0] === 'script.js') return 1;
    if (a.history[0] === 'index.ts') return -1;
    if (b.history[0] === 'index.ts') return 1;
    if (a.history[0] === 'data.json') return -1;
    if (b.history[0] === 'data.json') return 1;
    return 0;
  });
  return xs;
};

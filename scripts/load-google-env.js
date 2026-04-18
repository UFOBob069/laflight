const fs = require('fs');
const path = require('path');

function stripBom(s) {
  if (!s) return s;
  if (s.charCodeAt(0) === 0xfeff) return s.slice(1);
  return s;
}

/**
 * Load GOOGLE_* / GMAIL_* from .env then .env.local (later wins, same as Next.js).
 * @param {string} [cwd=process.cwd()]
 */
function loadGoogleEnvFromDotfiles(cwd = process.cwd()) {
  for (const name of ['.env', '.env.local']) {
    const fp = path.join(cwd, name);
    if (!fs.existsSync(fp)) continue;
    let content = stripBom(fs.readFileSync(fp, 'utf8'));
    for (const line of content.split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      if (!/^(GOOGLE_|GMAIL_)/.test(t)) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

module.exports = { loadGoogleEnvFromDotfiles };

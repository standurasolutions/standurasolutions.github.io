// Fragebogen → strukturierter Text (inkl. JSON für die automatische Fertigung). Kein Upload, kein Server.
const f = document.getElementById('brief'), msg = document.getElementById('msg');
const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);
function data() {
  const d = Object.fromEntries(new FormData(f));
  return { ...d, services: lines(d.services || ''), prices: lines(d.prices || ''), hours: lines(d.hours || '') };
}
function text() {
  const d = data();
  return 'Fragebogen Website\n\n' + Object.entries(d).map(([k, v]) => k + ': ' + (Array.isArray(v) ? '\n  - ' + v.join('\n  - ') : v)).join('\n') + '\n\n--- MASCHINENLESBAR (bitte nicht ändern) ---\n' + JSON.stringify(d);
}
f.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!f.reportValidity()) return;
  const d = data();
  location.href = 'mailto:' + window.STANDURA_MAIL + '?subject=' + encodeURIComponent('Fragebogen: ' + d.name) + '&body=' + encodeURIComponent(text());
  msg.textContent = 'Ihr E-Mail-Programm öffnet sich. Falls nicht: „Text kopieren“ und an ' + window.STANDURA_MAIL + ' senden.';
});
document.getElementById('copy')?.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(text()); msg.textContent = 'Kopiert – bitte per E-Mail an ' + window.STANDURA_MAIL + ' senden.'; } catch { msg.textContent = 'Kopieren nicht möglich – bitte „Per E-Mail senden“ nutzen.'; }
});

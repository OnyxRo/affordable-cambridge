// Copies each pledge and story submission to the MFZ Website Emails Google Sheet.
// Runs alongside the normal Netlify Forms submission, so Netlify still keeps its own copy.
(function () {
  var URL = 'https://script.google.com/macros/s/AKfycbz6KF4uOVIQue3cStbgvzZgmZStgGXaCUQusSKwNWVpWhzh-Wkf0fHpkRocG2uWG_uO/exec';
  var SKIP = { 'form-name': 1, company: 1, photo: 1 };

  function send(form) {
    if (form.dataset.synced) return;
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (SKIP[k] || typeof v !== 'string') return;
      data[k] = v;
    });
    if (form.company && form.company.value) return; // honeypot filled, likely a bot
    var body = JSON.stringify({
      form_name: form.getAttribute('name'),
      created_at: new Date().toISOString(),
      data: data
    });
    form.dataset.synced = '1';
    try {
      var blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
      if (navigator.sendBeacon && navigator.sendBeacon(URL, blob)) return;
    } catch (e) {}
    try {
      fetch(URL, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body });
    } catch (e) {}
  }

  document.addEventListener('submit', function (e) {
    var f = e.target;
    var n = f && f.getAttribute && f.getAttribute('name');
    if (n === 'pledge' || n === 'story') send(f);
  }, true);
})();

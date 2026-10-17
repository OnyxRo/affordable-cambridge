/* ============================================================
   EVENTS. Edit this list; index.html, act.html and pledged.html all read it.
   start/end: ISO time with the Boston offset, e.g. "2026-11-16T17:30:00-05:00"
   (EST is -05:00 from early November; EDT is -04:00 before that).
   Leave start null while the date isn't set; "when" shows instead.
   ============================================================ */
window.AC_EVENTS = [
  {
    title: "City staff present rollback options to the Council",
    when: "Mid-November",
    start: null,
    end: null,
    location: "Sullivan Chamber, Cambridge City Hall, 795 Massachusetts Ave, Cambridge",
    details: "",
    link: ""
  }
];

(function(){
  var els = document.querySelectorAll('[data-events]');
  if (!els.length) return;
  var E = window.AC_EVENTS || [];
  var esc = function(t){ var d = document.createElement('div'); d.textContent = t || ''; return d.innerHTML; };
  var utc = function(iso){ return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
  function endOf(ev){ return ev.end || new Date(new Date(ev.start).getTime() + 2 * 3600e3).toISOString(); }
  function gcal(ev){
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(ev.title) +
      '&dates=' + utc(ev.start) + '/' + utc(endOf(ev)) +
      '&ctz=America/New_York' +
      '&location=' + encodeURIComponent(ev.location || '') +
      '&details=' + encodeURIComponent((ev.details || '') + (ev.link ? '\n\n' + ev.link : ''));
  }
  function ics(ev, i){
    var lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Affordable Cambridge//EN','BEGIN:VEVENT',
      'UID:ac-' + i + '-' + utc(ev.start) + '@affordablecambridge',
      'DTSTAMP:' + utc(new Date().toISOString()),
      'DTSTART:' + utc(ev.start), 'DTEND:' + utc(endOf(ev)),
      'SUMMARY:' + ev.title, 'LOCATION:' + (ev.location || '').replace(/,/g, '\\,'),
      'DESCRIPTION:' + (ev.details || '').replace(/,/g, '\\,'), 'END:VEVENT','END:VCALENDAR'];
    return URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar' }));
  }
  function when(ev){
    if (!ev.start) return '<b>' + esc(ev.when || 'Date TBD') + '</b><span>Date not set yet</span>';
    var d = new Date(ev.start), tz = { timeZone: 'America/New_York' };
    return '<b>' + d.toLocaleDateString('en-US', Object.assign({ month: 'short', day: 'numeric' }, tz)) + '</b>' +
      '<span>' + d.toLocaleDateString('en-US', Object.assign({ weekday: 'long' }, tz)) + ', ' +
      d.toLocaleTimeString('en-US', Object.assign({ hour: 'numeric', minute: '2-digit' }, tz)) + '</span>';
  }
  var html = E.length ? E.map(function(ev, i){
    var cal = ev.start
      ? '<div class="btn-row"><a class="btn" href="' + gcal(ev) + '" target="_blank" rel="noopener">Add to Google Calendar</a>' +
        '<a class="btn" href="' + ics(ev, i) + '" download="affordable-cambridge-event.ics">Apple or Outlook</a></div>'
      : '<p class="tbd">We\u2019ll email everyone who asked for updates as soon as the date is set.</p>';
    return '<article class="ev"><div class="ev-when">' + when(ev) + '</div><div>' +
      '<h3>' + esc(ev.title) + '</h3>' +
      (ev.location ? '<p>' + esc(ev.location) + '</p>' : '') +
      (ev.details ? '<p>' + esc(ev.details) + '</p>' : '') +
      (ev.link ? '<p><a href="' + esc(ev.link) + '" target="_blank" rel="noopener">Details and agenda</a></p>' : '') +
      cal + '</div></article>';
  }).join('') : '<p class="note">No events scheduled right now. Pledge and we\u2019ll tell you when one is.</p>';
  [].forEach.call(els, function(el){ el.innerHTML = html; });
})();

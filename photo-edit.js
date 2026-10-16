/* Photo swap for the claude.ai preview.
   Drag an image onto any photo on the page, or turn on "Edit photos" and click one, and it is replaced and saved for everyone who opens the preview.
   Swaps are keyed by the original file path (for example images/garden-st.jpg), so the same photo changes on every page that uses it.
   On Netlify there is no window.claude, so this file does nothing. */
(function(){
  if (!window.claude || !window.claude.use) return;
  var overrides = {};               // original path -> served url
  var db = null, assets = null, editing = false, pendingKey = null;
  var docId = function(k){ return k.replace(/[^a-z0-9-]/gi, '_'); };

  function origOf(img){ return img.getAttribute('data-orig') || img.getAttribute('src'); }
  function apply(root){
    var list = root && root.querySelectorAll ? root.querySelectorAll('img') : [];
    if (root && root.tagName === 'IMG') list = [root];
    [].forEach.call(list, function(img){
      var k = origOf(img); if (!k || !overrides[k]) return;
      if (!img.hasAttribute('data-orig')) img.setAttribute('data-orig', k);
      if (img.getAttribute('src') !== overrides[k]) img.setAttribute('src', overrides[k]);
      img.hidden = false;
    });
  }
  new MutationObserver(function(ms){
    ms.forEach(function(m){ [].forEach.call(m.addedNodes, function(n){ if (n.nodeType === 1) apply(n); }); });
  }).observe(document.documentElement, { childList: true, subtree: true });

  // which photo did the person point at?
  function keyFor(el){
    if (!el || !el.closest) return null;
    var w = el.closest('[data-photo]'); if (w) return w.getAttribute('data-photo');
    var img = el.tagName === 'IMG' ? el : el.querySelector && el.querySelector('img');
    if (!img) { var p = el.closest('.st-ph,.sc-ph,.pol-ph,.ill-ph,.t.p,.ph'); img = p && p.querySelector('img'); }
    return img ? origOf(img) : null;
  }

  var css = document.createElement('style');
  css.textContent =
    '.pe-btn{position:fixed;left:14px;bottom:14px;z-index:90;font:700 .85rem/1 var(--sans,system-ui);padding:11px 16px;border-radius:9999px;border:2px solid #122322;background:#fff;color:#122322;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.18)}' +
    '.pe-btn[aria-pressed="true"]{background:#FFC72C}' +
    '.pe-toast{position:fixed;left:14px;bottom:62px;z-index:90;background:#122322;color:#fff;font:500 .85rem/1.35 var(--sans,system-ui);padding:9px 13px;border-radius:8px;max-width:300px}' +
    '.pe-on img,.pe-on [data-photo]{outline:3px dashed #FFC72C;outline-offset:-3px;cursor:copy}' +
    '.pe-drop{outline:4px solid #FFC72C!important;outline-offset:-4px}';
  document.head.appendChild(css);

  var toastEl = null, toastT;
  function toast(msg){
    if (!toastEl){ toastEl = document.createElement('div'); toastEl.className = 'pe-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function(){ toastEl.hidden = true; }, 3200);
  }

  function save(k, file){
    if (!k || !file) return;
    if (!/^image\//.test(file.type)){ toast('That file is not an image.'); return; }
    toast('Uploading ' + (file.name || 'photo') + '...');
    assets.upload(file).then(function(r){
      overrides[k] = r.url; apply(document);
      return db ? db.collection('photos').doc(docId(k)).set({ src: k, asset: r.id }) : null;
    }).then(function(){ toast('Saved. It replaces ' + k + ' for everyone.'); })
      .catch(function(e){
        var c = e && e.code;
        toast(c === 'too_large' ? 'That file is too big (20 MB max).' : c === 'unsupported_type' ? 'That image type is not supported.' : c === 'not_granted' ? 'Only editors can change photos.' : 'Could not save that photo. Try again.');
      });
  }

  function setup(){
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.hidden = true;
    input.addEventListener('change', function(){ save(pendingKey, input.files[0]); input.value = ''; });
    document.body.appendChild(input);

    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'pe-btn'; btn.setAttribute('aria-pressed', 'false'); btn.textContent = 'Edit photos';
    btn.addEventListener('click', function(){
      editing = !editing; btn.setAttribute('aria-pressed', String(editing));
      document.documentElement.classList.toggle('pe-on', editing);
      btn.textContent = editing ? 'Done' : 'Edit photos';
      if (editing) toast('Click a photo to replace it, or drag an image onto it.');
    });
    document.body.appendChild(btn);

    document.addEventListener('click', function(e){
      if (!editing || e.target === btn) return;
      var k = keyFor(e.target); if (!k) return;
      e.preventDefault(); e.stopPropagation();
      pendingKey = k; input.click();
    }, true);

    var over = null;
    function mark(el){ if (over && over !== el) over.classList.remove('pe-drop'); over = el; if (el) el.classList.add('pe-drop'); }
    document.addEventListener('dragover', function(e){
      if (!e.dataTransfer || [].indexOf.call(e.dataTransfer.types, 'Files') < 0) return;
      var k = keyFor(e.target); if (!k){ mark(null); return; }
      e.preventDefault(); e.dataTransfer.dropEffect = 'copy';
      mark(e.target.closest('[data-photo]') || (e.target.tagName === 'IMG' ? e.target : e.target.closest('.st-ph,.sc-ph,.pol-ph,.ill-ph,.t.p,.ph') || e.target));
    });
    document.addEventListener('dragleave', function(e){ if (!e.relatedTarget) mark(null); });
    document.addEventListener('drop', function(e){
      var k = keyFor(e.target); mark(null);
      if (!k || !e.dataTransfer || !e.dataTransfer.files.length) return;
      e.preventDefault(); save(k, e.dataTransfer.files[0]);
    });
  }

  claude.use('db').then(function(d){
    db = d; if (!db) return;
    db.collection('photos').onSnapshot(function(snap){
      snap.docs.forEach(function(doc){ var v = doc.data(); if (v && v.src && v.asset) overrides[v.src] = '/_blob/' + v.asset; });
      apply(document);
    }, function(){});
  });
  claude.use('assets').then(function(a){ assets = a; if (a) setup(); });
})();

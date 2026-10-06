/* Story cards: seven layouts for "I want to live here because" (see handoff README).
   Shared by index.html (the neighbor row) and stories.html (build your card).
   Cards are drawn at a fixed 375px and scaled to fit, never reflowed.

   StoryCard.html(story, layout)  story = { name, where, quote, photo, x, y, zoom, frame, empty }
     color: a palette slug or hex (default teal); recolors the frame and the inside of the card
     photo: image URL (or '' for the "Your photo" placeholder)
     x, y:  focus point in percent (default 50, 25); zoom: 1 to 3 (default 1)
     empty: { name, where, quote } true where the text is a placeholder (drawn faded)
   StoryCard.fit(el)  scales every .sc-fit inside el to its container width */
(function(){
  var LAYOUTS = [
    { slug:'corner-tape',    label:'Corner tape' },
    { slug:'paper-clip',     label:'Paper clip' },
    { slug:'album-corners',  label:'Album corners' },
    { slug:'round-sticker',  label:'Round sticker' },
    { slug:'gift-tag',       label:'Gift tag' },
    { slug:'stitched-patch', label:'Stitched patch' },
    { slug:'red-pin',        label:'Red pin' }
  ];
  var SERIF = "font-family:'DM Serif Display',serif;font-style:italic";
  var FADE = 'opacity:.4';
  // frame colors people can pick; hl is the contrasting highlight used around the chosen design
  // the palette people pick from. hl is the contrasting highlight around the chosen design;
  // accent, deep, text and tape recolor the inside of the card (backing print, tag, patch,
  // album corners, quote text, tape). Teal is the original design.
  var COLORS = [
    { slug:'teal',  label:'Teal',      hex:'#1F5F5B', hl:'#FF9485', accent:'#8CC0B5', deep:'#174A47', text:'#1F5F5B', tape:'#C9D8D4' },
    { slug:'pink',  label:'Pink',      hex:'#FF9485', hl:'#1F5F5B', accent:'#FFC2B8', deep:'#C9574A', text:'#B8463A', tape:'#FBD9D3' },
    { slug:'sea',   label:'Sea glass', hex:'#8CC0B5', hl:'#122322', accent:'#CFE5DF', deep:'#3D8C81', text:'#1F5F5B', tape:'#DCEDE8' },
    { slug:'yellow',label:'Yellow',    hex:'#FFC72C', hl:'#1F5F5B', accent:'#FFE08A', deep:'#B88A00', text:'#7A5A00', tape:'#F6E6B4' },
    { slug:'red',   label:'Red',       hex:'#D22B1F', hl:'#8CC0B5', accent:'#F2A79F', deep:'#A51F16', text:'#A51F16', tape:'#F2D3CF' },
    { slug:'ink',   label:'Ink',       hex:'#122322', hl:'#FFC72C', accent:'#B9C7C4', deep:'#122322', text:'#122322', tape:'#D5DDDB' }
  ];
  var FRAME = '#1F5F5B';

  function esc(t){ return String(t == null ? '' : t).replace(/[&<>"']/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); }
  function quote(q){
    q = String(q || '').trim();
    if (!q) return '';
    q = q.charAt(0).toUpperCase() + q.slice(1);
    return /[.!?]$/.test(q) ? q : q + '.';
  }

  // the photo: a clipped box so the person can pan (x, y) and zoom inside it
  function photo(s, w, h, box){
    var x = s.x == null ? 50 : s.x, y = s.y == null ? 25 : s.y, z = s.zoom || 1;
    var wrap = 'position:relative;overflow:hidden;display:block;width:' + w + 'px;height:' + h + 'px;' + (box || '');
    if (!s.photo) return '<div class="sc-ph" style="' + wrap + 'background:#8CC0B5;display:grid;place-items:center"><span style="font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#174A47">Your photo</span></div>';
    return '<div class="sc-ph" style="' + wrap + '"><img src="' + esc(s.photo) + '" alt="' + esc(s.name) + '" draggable="false" style="width:100%;height:100%;object-fit:cover;object-position:' + x + '% ' + y + '%;transform:scale(' + z + ');transform-origin:' + x + '% ' + y + '%;display:block;pointer-events:none"></div>';
  }
  function who(s, sep){
    var n = '<span style="' + (s.empty && s.empty.name ? FADE : '') + '">' + esc(s.name) + '</span>';
    var w = '<span style="' + (s.empty && s.empty.where ? FADE : '') + '">' + esc(s.where) + '</span>';
    return n + (sep == null ? ', ' : sep) + w;
  }
  function text(s){
    return '<div style="display:flex;flex-direction:column;gap:12px"><div style="font-weight:700;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#4A5C5A">I want to live here because</div>' +
      '<div style="' + SERIF + ';font-size:30px;line-height:1.15;color:#1F5F5B;text-wrap:pretty;' + (s.empty && s.empty.quote ? FADE : '') + '">' + esc(quote(s.quote)) + '</div></div>';
  }
  function shell(slug, top, gap, inner, extra){
    return '<div data-story-layout="' + slug + '" style="width:375px;background:' + FRAME + ';padding:24px 0 24px 24px;box-sizing:border-box;font-family:\'DM Sans\',sans-serif;text-align:left">' +
      '<div style="background:#F3F7F6;padding:' + top + 'px 32px 40px;display:flex;flex-direction:column;gap:' + gap + 'px;' + (extra || '') + '">' + inner + '</div></div>';
  }
  var clip = function(outer, top){ // one paper clip; outer=false hides the outer loop; top is relative to its container
    return '<div style="position:absolute;top:' + (top == null ? -28 : top) + 'px;left:37px;width:22px;height:68px;box-sizing:border-box;border:3px solid ' + (outer ? '#4A5C5A' : 'transparent') + ';border-radius:11px;transform:rotate(6deg)"><div style="position:absolute;top:10px;left:2px;width:12px;height:44px;box-sizing:border-box;border:3px solid #4A5C5A;border-radius:6px"></div></div>';
  };

  var T = {
    'corner-tape': function(s){
      return shell('corner-tape', 48, 32,
        '<div style="position:relative;align-self:flex-start">' +
        '<div style="position:absolute;left:26px;top:-4px;width:94%;height:96%;background:#8CC0B5;transform:rotate(6deg)"></div>' +
        '<div style="position:relative;background:#FFFFFF;padding:14px 14px 0;transform:rotate(-3deg);border:1px solid #C9D8D4">' +
        '<div style="position:absolute;top:0;left:-25px;width:80px;height:26px;background:#C9D8D4;opacity:.9;transform:rotate(-38deg);z-index:2"></div>' +
        '<div style="position:absolute;width:130px;height:20px;background:#C9D8D4;opacity:.9;transform:rotate(-50deg);left:165px;top:241px;z-index:2"></div>' +
        photo(s, 230, 230) +
        '<div style="padding:14px 2px 16px;font-size:14px;font-weight:500;color:#4A5C5A">' + who(s) + '</div>' +
        '</div></div>' + text(s));
    },
    'paper-clip': function(s){
      // the clip is drawn three times so it reads as clipped on (behind, above the edge, over the photo)
      return shell('paper-clip', 56, 32,
        '<div style="position:relative;align-self:flex-start;margin-top:8px;transform:rotate(-3deg)">' +
        clip(true) +
        '<div style="position:relative;background:#FFFFFF;padding:14px 14px 0;border:1px solid #C9D8D4">' +
        photo(s, 230, 230) +
        '<div style="padding:14px 2px 16px;font-size:14px;font-weight:500;color:#4A5C5A">' + who(s) + '</div></div>' +
        '<div style="position:absolute;top:-40px;left:0;width:100%;height:41px;overflow:hidden;pointer-events:none;z-index:3">' + clip(true, 12) + '</div>' +
        '<div style="position:absolute;top:1px;left:0;width:100%;height:59px;overflow:hidden;pointer-events:none;z-index:3">' + clip(false, -29) + '</div>' +
        '</div>' + text(s));
    },
    'album-corners': function(s){
      var c = 'position:absolute;width:40px;height:40px;background:#174A47;';
      return shell('album-corners', 48, 32,
        '<div style="display:flex;flex-direction:column;gap:12px;align-self:flex-start"><div style="position:relative">' + photo(s, 240, 240) +
        '<div style="' + c + 'top:0;left:0;clip-path:polygon(0 0,100% 0,0 100%)"></div>' +
        '<div style="' + c + 'top:0;right:0;clip-path:polygon(0 0,100% 0,100% 100%)"></div>' +
        '<div style="' + c + 'bottom:0;left:0;clip-path:polygon(0 0,0 100%,100% 100%)"></div>' +
        '<div style="' + c + 'bottom:0;right:0;clip-path:polygon(100% 0,100% 100%,0 100%)"></div></div>' +
        '<div style="padding-top:6px;' + SERIF + ';font-size:18px;color:#4A5C5A">' + who(s) + '</div></div>' + text(s));
    },
    'round-sticker': function(s){
      return shell('round-sticker', 48, 40,
        '<div style="position:relative;width:240px;height:240px">' +
        '<div style="position:absolute;left:22px;top:8px;width:240px;height:240px;border-radius:9999px;background:#8CC0B5"></div>' +
        photo(s, 220, 220, 'border-radius:9999px;border:10px solid #FFFFFF;box-sizing:content-box;') +
        '<div style="position:absolute;bottom:2px;left:-8px;background:#122322;color:#F3F7F6;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:7px 12px;transform:rotate(-4deg)">' + who(s) + '</div>' +
        '</div>' + text(s));
    },
    'gift-tag': function(s){
      return shell('gift-tag', 48, 32,
        '<div style="position:relative;transform:rotate(-3deg);margin-left:4px">' +
        '<div style="position:absolute;top:50%;right:calc(100% - 30px);width:320px;height:2px;margin-top:-1px;background:#4A5C5A"></div>' +
        '<div style="background:#8CC0B5;clip-path:polygon(18% 0,100% 0,100% 100%,18% 100%,0 50%);padding:14px 14px 16px 60px;display:flex;flex-direction:column;gap:10px">' +
        photo(s, 205, 205) +
        '<div style="display:flex;flex-direction:column;gap:2px"><div style="' + SERIF + ';font-size:22px;line-height:1.1;color:#122322;' + (s.empty && s.empty.name ? FADE : '') + '">' + esc(s.name) + '</div><div style="font-size:13px;font-weight:500;color:#174A47;' + (s.empty && s.empty.where ? FADE : '') + '">' + esc(s.where) + '</div></div></div>' +
        '<div style="position:absolute;top:50%;left:22px;margin-top:-8px;width:12px;height:12px;border-radius:9999px;background:#F3F7F6;border:2px solid #174A47"></div>' +
        '</div>' + text(s), 'overflow:hidden');
    },
    'stitched-patch': function(s){
      return shell('stitched-patch', 48, 32,
        '<div style="display:flex;flex-direction:column;gap:14px;align-self:flex-start"><div style="background:#8CC0B5;padding:10px;border-radius:14px;transform:rotate(-3deg)">' +
        '<div style="border:2px dashed #F3F7F6;border-radius:9px;padding:8px">' + photo(s, 210, 210, 'border-radius:4px;') + '</div>' +
        '</div><div style="font-size:14px;font-weight:500;color:#4A5C5A">' + who(s) + '</div></div>' + text(s));
    },
    'red-pin': function(s){
      return shell('red-pin', 48, 32,
        '<div style="position:relative;align-self:flex-start;background:#FFFFFF;padding:14px 14px 0;border:1px solid #C9D8D4;transform:rotate(-2deg);display:flex;flex-direction:column">' +
        '<div style="position:absolute;left:135px;top:-6px;width:22px;height:22px;border-radius:9999px;background:#174A47;opacity:.2;z-index:2"></div>' +
        '<div style="position:absolute;left:128px;top:-14px;width:2px;height:18px;background:#4A5C5A;transform-origin:50% 100%;transform:rotate(38deg);z-index:2"></div>' +
        '<div style="position:absolute;left:128px;top:-22px;width:24px;height:24px;border-radius:9999px;background:#C8423B;z-index:2"><div style="position:absolute;top:4px;left:5px;width:7px;height:7px;border-radius:9999px;background:#E8857E"></div></div>' +
        photo(s, 230, 230) +
        '<div style="padding:14px 2px 16px"><div style="font-size:14px;font-weight:500;color:#4A5C5A">' + who(s) + '</div></div></div>' + text(s));
    }
  };

  function color(c){
    if (!c) return COLORS[0];
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].slug === c || COLORS[i].hex.toLowerCase() === String(c).toLowerCase()) return COLORS[i];
    return COLORS[0];
  }
  // draw with the frame held aside, then swap the inside colors for the chosen color's set
  function paint(html, c){
    if (c.slug === 'teal') return html.replace('__FRAME__', c.hex);
    html = html.split('#8CC0B5').join(c.accent).split('#174A47').join(c.deep).split('#1F5F5B').join(c.text).split('#C9D8D4').join(c.tape);
    return html.replace('__FRAME__', c.hex);
  }
  function html(s, layout){
    var c = color(s.color || s.frame);
    FRAME = '__FRAME__';
    return '<div class="sc-fit"><div class="sc-scale">' + paint((T[layout] || T['corner-tape'])(s), c) + '</div></div>';
  }

  // scale each card to its container's width; the container takes the scaled height
  function fit(root){
    [].forEach.call((root || document).querySelectorAll('.sc-fit'), function(f){
      var inner = f.firstChild, cs = getComputedStyle(f.parentNode), w = f.parentNode.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (!inner || !w) return;
      var k = Math.min(w / 375, f.getAttribute('data-max') ? +f.getAttribute('data-max') : 9);
      inner.style.transform = 'scale(' + k + ')';
      f.style.width = (375 * k) + 'px';
      f.style.height = (inner.offsetHeight * k) + 'px';
    });
  }
  // a shuffled deck, so neighbors in a row never repeat a layout back to back
  function deal(n){
    var out = [], deck = [];
    for (var i = 0; i < n; i++){
      if (!deck.length){
        deck = LAYOUTS.map(function(l){ return l.slug; });
        for (var j = deck.length - 1; j > 0; j--){ var k = Math.floor(Math.random() * (j + 1)), t = deck[j]; deck[j] = deck[k]; deck[k] = t; }
        if (out.length && deck[deck.length - 1] === out[out.length - 1]) deck.unshift(deck.pop());
      }
      out.push(deck.pop());
    }
    return out;
  }

  window.StoryCard = { LAYOUTS: LAYOUTS, COLORS: COLORS, color: color, html: html, fit: fit, deal: deal, quote: quote };
})();

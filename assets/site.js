(function () {
  'use strict';

  /* Menu button (shown below 992px). */
  var nav = document.querySelector('.site-nav');
  if (nav) {
    var toggle = nav.querySelector('.menu-toggle');
    var list = nav.querySelector('ul');
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      list.setAttribute('aria-expanded', String(open));
    });
  }

  /* Emoji. A device that cannot draw the newest emoji shows the ones listed
     here as graphics instead; a device that can keeps its own. */
  var EMOJI = ['1f3ac', '1f4c4', '1f4ce', '1f4d5', '1f4d6', '1f4d7', '1f4d8', '1f4d9', '1f5e3'];

  function drawsNewestEmoji() {
    try {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.textBaseline = 'top';
      ctx.font = '600 32px Arial';
      ctx.fillText('🫈', 0, 0);
      var pixel = ctx.getImageData(16, 16, 1, 1).data;
      return pixel[0] + pixel[1] + pixel[2] + pixel[3] !== 0;
    } catch (e) {
      return true;
    }
  }

  function swapEmoji(root) {
    var chars = EMOJI.map(function (code) { return String.fromCodePoint(parseInt(code, 16)); });
    var pattern = new RegExp('(' + chars.join('|') + ')️?', 'u');
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) {
      if (pattern.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    }
    nodes.forEach(function (node) {
      var rest = node.nodeValue;
      var out = document.createDocumentFragment();
      var match;
      while ((match = pattern.exec(rest))) {
        if (match.index) out.appendChild(document.createTextNode(rest.slice(0, match.index)));
        var img = document.createElement('img');
        img.draggable = false;
        img.setAttribute('role', 'img');
        img.className = 'emoji';
        img.alt = match[0];
        img.src = '/assets/emoji/' + match[1].codePointAt(0).toString(16) + '.svg';
        out.appendChild(img);
        rest = rest.slice(match.index + match[0].length);
      }
      if (rest) out.appendChild(document.createTextNode(rest));
      node.parentNode.replaceChild(out, node);
    });
  }

  var content = document.querySelector('.entry-content');
  if (content && !drawsNewestEmoji()) swapEmoji(content);
})();

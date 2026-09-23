/* Trusteel — photo loader
   Photos shipped as base64 sidecar parts (photo.jpg.b64.1, .b64.2, ...)
   are fetched, joined, decoded and swapped into
   <img data-b64="path/to/photo.jpg.b64" data-b64-parts="N"> elements.
   Falls back silently to the file-based src if parts are unavailable. */
(function () {
  function load(img) {
    var base = img.getAttribute('data-b64');
    var n = parseInt(img.getAttribute('data-b64-parts') || '1', 10);
    var fetches = [];
    for (var i = 1; i <= n; i++) {
      fetches.push(fetch(base + '.' + i).then(function (r) {
        if (!r.ok) { throw new Error('missing part'); }
        return r.text();
      }));
    }
    Promise.all(fetches).then(function (texts) {
      var bin = atob(texts.join('').replace(/\s+/g, ''));
      var bytes = new Uint8Array(bin.length);
      for (var j = 0; j < bin.length; j++) { bytes[j] = bin.charCodeAt(j); }
      img.src = URL.createObjectURL(new Blob([bytes], { type: 'image/jpeg' }));
    }).catch(function () { /* keep original src */ });
  }
  Array.prototype.forEach.call(document.querySelectorAll('img[data-b64]'), load);
})();

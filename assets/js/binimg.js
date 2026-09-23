/* Trusteel — photo loader
   Photos shipped as base64 sidecars (.jpg.b64, text-safe) are decoded here
   and swapped into <img data-b64="path/to/photo.jpg.b64"> elements.
   Falls back silently to the file-based src if the sidecar is unavailable. */
(function () {
  function swap(img, url) { img.src = url; }
  var imgs = document.querySelectorAll('img[data-b64]');
  Array.prototype.forEach.call(imgs, function (img) {
    fetch(img.getAttribute('data-b64'))
      .then(function (r) { if (!r.ok) { throw new Error('missing'); } return r.text(); })
      .then(function (text) {
        var bin = atob(text.replace(/\s+/g, ''));
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) { bytes[i] = bin.charCodeAt(i); }
        swap(img, URL.createObjectURL(new Blob([bytes], { type: 'image/jpeg' })));
      })
      .catch(function () { /* keep original src */ });
  });
})();

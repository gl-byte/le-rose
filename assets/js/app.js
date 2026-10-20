(function () {
  'use strict';

  // ---------- Visor de imágenes (zoom con dos dedos, deslizar entre imágenes) ----------
  // Sin JavaScript, cada imagen sigue siendo un enlace que abre el archivo completo.
  if (window.PhotoSwipeLightbox && window.PhotoSwipe) {
    var lightbox = new PhotoSwipeLightbox({
      gallery: '#menu',
      children: 'a.zoom',
      pswpModule: window.PhotoSwipe,
      bgOpacity: 0.97,
      showHideAnimationType: 'zoom',
      secondaryZoomLevel: 2,
      maxZoomLevel: 4,
      closeTitle: 'Cerrar',
      zoomTitle: 'Ampliar',
      arrowPrevTitle: 'Anterior',
      arrowNextTitle: 'Siguiente',
      errorMsg: 'No se pudo cargar la imagen.'
    });

    // Usa el tamaño real del archivo cuando ya está cargado: si se reemplaza una imagen
    // por otra de mayor resolución (mismo nombre), no hace falta tocar el HTML.
    lightbox.addFilter('itemData', function (itemData) {
      var img = itemData.element && itemData.element.querySelector('img');
      if (img && img.naturalWidth) {
        itemData.width = itemData.w = img.naturalWidth;
        itemData.height = itemData.h = img.naturalHeight;
      }
      return itemData;
    });

    lightbox.init();
  }

  // ---------- Pestaña activa según la sección visible ----------
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('.pestanas a'));
  var lista = document.querySelector('.pestanas ul');

  function activar(id) {
    enlaces.forEach(function (a) {
      var activo = a.hash === '#' + id;
      if (activo) {
        a.setAttribute('aria-current', 'true');
        // Mantiene visible la pestaña activa en pantallas angostas
        var centro = a.offsetLeft - (lista.clientWidth - a.offsetWidth) / 2;
        lista.scrollTo({ left: centro, behavior: 'smooth' });
      } else {
        a.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) activar(e.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    enlaces.forEach(function (a) {
      var seccion = document.querySelector(a.hash);
      if (seccion) observador.observe(seccion);
    });
  }
})();

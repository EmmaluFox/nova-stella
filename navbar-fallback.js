(function(){
  if (typeof window === 'undefined') return;
  function ready(fn){
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function(){
    var ham = document.querySelector('.ns-hamburger');
    var mobile = document.querySelector('.ns-mobile-nav');
    if (!ham || !mobile) return;

    // Toggle mobile nav on hamburger click
    ham.addEventListener('click', function(e){
      e.preventDefault();
      mobile.classList.toggle('active');
    });

    // Close mobile nav when a link inside it is clicked
    mobile.addEventListener('click', function(e){
      var t = e.target;
      if (t && t.tagName && t.tagName.toLowerCase() === 'a') {
        mobile.classList.remove('active');
      }
    });

    // Ensure mobile nav is closed when viewport becomes desktop
    var onResize = function(){
      if (window.innerWidth > 768 && mobile.classList.contains('active')) {
        mobile.classList.remove('active');
      }
    };
    window.addEventListener('resize', onResize);
  });
})();

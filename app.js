// nav background on scroll
(function(){
  var nav=document.getElementById('nav');
  if(!nav) return;
  function s(){ nav.classList.toggle('stuck', window.scrollY>40); }
  window.addEventListener('scroll', s, {passive:true}); s();
})();

// reveal on scroll
(function(){
  var els=document.querySelectorAll('.rv');
  if(!('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('on');}); return; }
  var io=new IntersectionObserver(function(en){
    en.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } });
  },{threshold:0.1, rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){ io.observe(e); });
})();

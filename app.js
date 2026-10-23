(function () {
  'use strict';
  var config = window.ATLAS_CONFIG || {};
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var purchase = document.getElementById('purchase-dialog');
  var checkout = null;
  var advertisingAllowed = false;
  try { if (config.checkoutUrl) { var u = new URL(config.checkoutUrl); if(u.protocol === 'https:') checkout = u.href; } } catch (_) {}
  document.querySelectorAll('[data-checkout]').forEach(function(link){
    if(checkout) link.href = checkout;
    link.addEventListener('click', function(event){
      if(!checkout){event.preventDefault();purchase.showModal();return;}
      if(advertisingAllowed && typeof window.fbq === 'function') window.fbq('track','InitiateCheckout',{currency:'EUR',value:10,content_name:'Visual Therapy Atlas'});
    });
  });
  purchase.querySelectorAll('.dialog-close').forEach(function(button){button.addEventListener('click',function(){purchase.close();});});
  purchase.addEventListener('click',function(event){if(event.target===purchase) purchase.close();});
  document.querySelectorAll('[data-accordion] .acc__trigger').forEach(function(button){
    var panel = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click',function(){
      var open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded',String(!open));
      panel.style.height = open ? '0px' : 'auto';
    });
  });
  document.querySelectorAll('.reveal').forEach(function(element){element.classList.add('is-visible');});
  var gallery = document.getElementById('gallery');
  var marquee = document.getElementById('marquee');
  if(gallery && marquee && gallery.children.length){
    var group = document.createElement('div');group.className='gallery__group';
    while(gallery.firstElementChild) group.appendChild(gallery.firstElementChild);
    gallery.appendChild(group);
    if(!reduced){
      var clone=group.cloneNode(true);clone.setAttribute('aria-hidden','true');gallery.appendChild(clone);
      var x=0,last=null,paused=false;
      function frame(now){if(last!==null&&!paused){x-=Math.min((now-last)/1000,.1)*42;var width=group.getBoundingClientRect().width;if(width&&x<=-width)x+=width;gallery.style.transform='translate3d('+x+'px,0,0)';}last=now;requestAnimationFrame(frame);}
      requestAnimationFrame(frame);
      marquee.addEventListener('mouseenter',function(){paused=true;});marquee.addEventListener('mouseleave',function(){paused=false;});
      marquee.addEventListener('click',function(){paused=!paused;});
      marquee.addEventListener('touchstart',function(){paused=true;},{passive:true});
      document.addEventListener('visibilitychange',function(){last=null;});
    }
  }
  var pixelId = String(config.metaPixelId || '');
  if(!/^\d{8,20}$/.test(pixelId)) return;
  // Banner removed at the owner's explicit request.
  // Keep an existing refusal effective; removing the UI does not revoke that choice.
  var previousChoice = null;
  try { previousChoice = localStorage.getItem('atlas-advertising-consent'); } catch (_) {}
  if (previousChoice === 'no') return;
  if (window.fbq) return;
  advertisingAllowed = true;
  var q = window.fbq = function () {
    q.callMethod ? q.callMethod.apply(q, arguments) : q.queue.push(arguments);
  };
  window._fbq = q; q.push = q; q.loaded = true; q.version = '2.0'; q.queue = [];
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  q('init', pixelId);
  q('track', 'PageView');
  q('track', 'ViewContent', { currency: 'EUR', value: 10, content_name: 'Visual Therapy Atlas' });
})();

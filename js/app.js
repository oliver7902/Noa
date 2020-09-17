function debounce(callback, limit) {
  var timeout;
  return function() {
    var context = this;
    var args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function() {
      timeout = null;
      callback.apply(context, args);
    }, limit);
  };
}

function throttle(callback, limit) {
  var calledCount = 0;
  return function() {
    calledCount++;
    if (calledCount === 1) {
      var context = this;
      var args = arguments;
      callback.apply(context, args);

      setTimeout(function() {
        if (calledCount > 1) {
          callback.apply(context, args);
        }
        calledCount = 0;
      }, limit);
    }
  };
}

var header = document.getElementsByTagName('header')[0];
var btnNavi = document.querySelector('.btn-navi');
var $langBtn = $('header nav .lang-button');

var menuStatus = false;
btnNavi.addEventListener('click', function(e) {
  e.preventDefault();
  header.classList[menuStatus ? 'remove' : 'add']('on');
  menuStatus = !menuStatus;
  $langBtn.removeClass('opened');
});

var $window = $(window);

function parallaxOnce($el, callback) {
  parallax($el, 'parallaxOnce', callback, { mode: 'in-screen' });
}
function parallax($el, namespace, callback, options) {
  var elementTop;
  var elementBottom;
  var windowHeight;
  var viewportTop;
  var viewportBottom;

  function setElementPosition() {
    elementTop = $el.offset().top;
    elementBottom = elementTop + $el.outerHeight();
    windowHeight = $window.height();
  }
  function setScrollPosition() {
    viewportTop = $window.scrollTop();
    viewportBottom = viewportTop + windowHeight;
  }

  function detection() {
    if (options.mode === 'in-screen') {
      return elementBottom > viewportTop && elementTop < viewportBottom;
    }
    if (options.direction === 'top-down') {
      if (!options.offset) options.offset = 0;
      if (options.mode === 'bottom-bottom') {
        return elementBottom + options.offset < viewportBottom;
      } else if (options.mode === 'center-center') {
        return (elementTop + elementBottom) / 2 + options.offset < (viewportTop + viewportBottom) / 2;
      } else if (options.mode === 'center-bottom') {
        return (elementTop + elementBottom) / 2 + options.offset < viewportBottom;
      } else if (options.mode === 'top-bottom') {
        return elementTop + options.offset < viewportBottom;
      }
    }

    return false; // don't run
  }
  function checkPosition() {
    if (detection()) {
      callback();
      $window.off('scroll.' + namespace + ' resize.' + namespace);
    }
  }

  function scroll() {
    setScrollPosition();
    checkPosition();
  }
  function resize() {
    setElementPosition();
    setScrollPosition();
    checkPosition();
  }
  resize();
  $window.on('scroll.' + namespace, throttle(scroll, 50));
  $window.on('resize.' + namespace, debounce(resize, 200));
}

var scrollTop = $window.scrollTop();
var $header = $('header');
var fixedMode = false;
if (scrollTop > 0) {
  $header.addClass('fixed');
  fixedMode = true;
}
$window.on(
  'scroll',
  throttle(function() {
    scrollTop = $window.scrollTop();
    if (scrollTop == 0 && fixedMode) {
      $header.removeClass('fixed');
      fixedMode = false;
    } else if (scrollTop > 50 && !fixedMode) {
      $header.addClass('fixed');
      fixedMode = true;
    }
  }, 50)
);

$langBtn.on('click', function(e) {
  $langBtn.toggleClass('opened');
});
$('header .gnb-item > a.gnb-scroll').on('click', function(e) {
  e.preventDefault();
  $header.removeClass('on');
  $langBtn.removeClass('opened');
  menuStatus = false;
  gsap.to(window, {
    duration: 0.5,
    scrollTo: $($(this).attr('href')).offset().top - 80
  });
});

$('.team-list li')
  .on('mouseenter', function(e) {
    e.preventDefault();
    var $this = $(this);
    $this.addClass('on');
  })
  .on('mouseleave', function(e) {
    e.preventDefault();
    var $this = $(this);
    $this.removeClass('on');
  })
  .on('click', function(e) {
    var $this = $(this);
    $this.toggleClass('on');
  });
$('.partner-nav li a').on('click', function(e) {
  e.preventDefault();
  var $this = $(this);
  if ($this.parent().hasClass('on')) return;
  $('.partner-nav li').removeClass('on');
  $this.parent().addClass('on');
  var id = $this.attr('href');
  $('.partner-list').removeClass('on');
  $(id).addClass('on');
});

var $appList = $('.business-app-list li');
var $appDesc = $('.business-app-desc div');
var $appView = $('.business-circle figure img');
var rotationStop = false;
var rotationCount = 0;
var rotationTimer = 0;
$appList.on('mouseenter click rotate', function(e) {
  e.preventDefault();
  if (e.type != 'rotate') {
    rotationStop = true;
    if (rotationTimer) {
      clearTimeout(rotationTimer);
    }
  }
  var $this = $(this);
  if ($this.hasClass('on')) return;
  $appDesc.removeClass('on');
  $('.' + $this.attr('class').replace('app', 'business')).addClass('on');
  $appView.removeClass('on');
  $('.' + $this.attr('class').replace('app', 'app-view')).addClass('on');
  $appList.removeClass('on');
  $this.addClass('on');
});

function rotateAppList() {
  var position = rotationCount % 5;
  if (position == 3) position = 4;
  else if (position == 4) position = 3;

  $($appList[position]).trigger('rotate');
  if (!rotationStop) {
    rotationCount++;
    rotationTimer = setTimeout(function() {
      rotateAppList();
    }, 1000);
  }
}

rotateAppList();

$('.token-chart button').on('click', function(e) {
  var no = $(this).data('no');
  $('.token-chart-contents li').removeClass('on');
  $('.token-chart-contents-' + no).addClass('on');
});

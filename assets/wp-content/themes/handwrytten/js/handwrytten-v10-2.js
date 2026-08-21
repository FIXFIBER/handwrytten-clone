var mobile = false;
var mobileBreak = 768;
var stickyBreak = 900;
var menuBreak = 1200;
console.log('v7');
if ($(window).width() <= mobileBreak) {
  mobile = true;
}
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var path;
function freezePage() {
  $('body').css({ width: '100%', height: '100%', overflow: 'hidden' });
}
function unfreezePage() {
  $('body').css({ width: '', height: '', overflow: '' });
}
function animScroll(sec, speed, offset) {
  activeOffset = $(sec).offset().top + offset;
  TweenMax.to('html,body', speed, {
    scrollTop: activeOffset,
    ease: Expo.easeInOut,
  });
}
var samplesSent;

// disable interval while tab is open

var pageInactive = false;
$(window).focus(function () {
  pageInactive = false;
});

$(window).blur(function () {
  pageInactive = true;
});

// Greensock config

gsap.config({
  nullTargetWarn: false,
});

/*
$('body').dblclick(function(){
	$('.hasAnim').removeClass('on');
	resetGetStarted();
})
*/

/*! - GLOBAL ***************************** */

//! - GLOBAL: 0 RESIZE

var winW = $(window).width();
var winH = window.innerHeight;
$(window).resize(function () {
  winW = $(window).width();
  winH = window.innerHeight;
  //console.log(winW+' / '+winH);

  if (winW <= mobileBreak && !mobile) {
    mobile = true;
  }
  if (winW > mobileBreak && mobile) {
    mobile = false;
  }

  // update sticky
  if (winW <= stickyBreak) {
    if (stickyOpen) {
      $('#globalHeader').removeClass('sticky');
      $('#globalMenu').removeClass('sticky');
      stickyOpen = false;
    }
  }
  if (winW > stickyBreak) {
    // if already scrolled, set sticky
    if (sT > 0 && !stickyOpen) {
      setSticky();
    }
  }

  // unfreeze if mobile menu open
  if (winW > menuBreak && $('#globalMenu').hasClass('open')) {
    closeMenu();
    unfreezePage();
  }

  // global scale updates
  if ($('.hasScale').length > 0) {
    updateScales();
  }

  // specific js page updating
  if ($('.compare-table').length > 0) {
    updateCompareChart();
  }

  // update sliders
  if ($('.module-slider-wrap').length > 0) {
    updateModSliders();
  }
  if ($('.customer-slider').length > 0) {
    updateCustomerSlides();
  }

  // update writer
  if ($('body').attr('id') == 'page-pricing') {
    updatePricingWriter();
  }

  // update logo scroller
  if ($('.logo-scroller').length > 0) {
    updateLogoScroller();
  }

  // update landing quotes mobile
  if ($('#business-testimonials').length > 0 && winW <= 650) {
    quotesHeightResize();
  }
});

//! - GLOBAL: 1 HELPERS

function updateScales() {
  $('.hasScale').each(function () {
    if (
      winW < Number($(this).attr('data-limit')) &&
      winW > Number($(this).attr('data-min'))
    ) {
      fullW = Number($(this).attr('data-width'));
      trgW = $(this).find('.sizer').width();
      scDif = Number(trgW / fullW);
      if (scDif > 1) {
        scDif = 1;
      }
      if (scDif > 0) {
        TweenMax.set($(this).find('.willScale'), {
          scaleX: scDif,
          scaleY: scDif,
        });
      }
    } else {
      $(this).find('.willScale').attr({ style: '' });
    }
  });
}

// load retina images to set width

var retinas = [];
var tmpWs = [];
function sizeRetina() {
  $('.retina').each(function (i) {
    goResize($(this), i);
  });
}

function goResize(trg, num) {
  retinas[num] = setInterval(function () {
    tmpWs[num] = Math.round(trg.find('img').get(0).naturalWidth);

    if (tmpWs[num] > 1) {
      trg.find('img').css({
        width: '100%',
        height: 'auto',
        'max-width': tmpWs[num] / 2 + 'px',
      });
      trg.removeClass('retina');
      //console.log('retina loaded')
      clearInterval(retinas[num]);
    }
  }, 50);
}

// give ID to section if none

c = 0;
$('.hasAnim').each(function () {
  if ($(this).attr('id') == undefined) {
    $(this).attr('id', 'anim' + c);
    c++;
  }
});

// helpers for Contact form 7 plugin

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

$('#s2-country').prepend('<option value=""></option>');

$('.s2-elem').each(function () {
  tmpid = $(this).attr('name');
  if (tmpid == 'ca-province') {
    tmpid = 'province';
  }
  if (tmpid == 'company-size') {
    tmpid = 'Company Size';
  }
  ph = '*' + capitalizeFirstLetter(tmpid);
  $(this).attr('placeholder', ph);
});

// home auto scroll back to top

if ($('body').attr('id') == 'page-home') {
  $('#globalHeader')
    .find('.logo a')
    .click(function () {
      animScroll('#home-hero', 0.75, 0);
      return false;
    });
}

// add no break tags where line breaks should be kept in place

$('.hasNobreak').find('br').addClass('nobreak');
$('.hasMobBreak').find('br').addClass('mob');

// wrap article quotes with custom style

var quotewrapper1 =
  '<div class="quote-wrap"><div class="quote left"><img src="' +
  path +
  'images/quotemark@2x.png"></div><div class="quote right"><img src="' +
  path +
  'images/quotemark@2x.png"></div><blockquote>';
var quotewrapper2 = '</blockquote></div>';
$('#blog-article')
  .find('.bodycopy')
  .find('blockquote')
  .each(function () {
    if ($(this).children('p').html() != '') {
      quoteTxt = $(this).children('p').html();
    } else {
      quoteTxt = $(this).html();
    }
    quoteData = quotewrapper1 + quoteTxt + quotewrapper2;
    $(this).replaceWith(quoteData);
  });

// special style for image inside p (copied from old website)

$('#blog-article')
  .find('.bodycopy')
  .find('p>img')
  .each(function () {
    $(this).parents('p').addClass('figure');
  });

// add SVG special line to subscribe form (keep cms clean)

var subscribeUL =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 335 8" preserveAspectRatio="none"><path d="M335.07836,4.51137C333.1817,6.94611,320.59278,6.089,314.82981,7.33591l-22.02167-.38439c-3.92512.17629-3.48645-.8173-3.64439-1.6537a14.15219,14.15219,0,0,1-9.1896.36889c-4.87446-.08949-10.485.01768-12.8383-.75339-4.96835,1.13507-17.70413-.11936-25.70554.08061-30.71134,1.71344-77.77049-.26141-104.6595.29034-5.61608-.72216-8.96749.03534-14.66392-1.31235-5.37073-.23709-5.65907,1.09656-11.03113.86384-4.975-.41544-14.5791.41818-16.51045-.81748-8.23278.84872-25.60614,1.69228-34.89011.44738-2.60087,1.80934-6.79468-.17153-11.035.86818L32.12431,5.04555c-9.60086.07721-21.47259,2.254-31.22179.51583-2.84011-1.031,1.44428-3.09324,9.22409-2.48769,3.84668-.7665,12.19273-.15327,16.53436-.76778C38.69979,1.15752,49.25933,2.24164,59.73058,1.293c10.87359.28243,22.85589-.2781,34.89011-.44737C105.632.68942,116.95762.57394,129.5029.923c5.26657.68959,14.313.35789,18.33979,1.37871,2.7255-1.35726,6.84907-.29506,11.02189-.3347,4.84935-.04768,10.427-.9185,20.18682.35237,16.09518-.24616,31.19667-1.01027,44.0626.2376,10.48735-1.94294,20.213-.85794,36.73671-.94664,12.14163.69712,25.44479.81906,42.187,2.32426,10.70451-.34465,25.8595-2.59869,33.04062.57673"></svg>';
$('#subscribe-form').find('.underline').html(subscribeUL);

// add SVG special button shape to arrows (keep cms clean)

var arrowBG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" preserveAspectRatio="none"><path d="M27.2,43.1c-0.4-0.1-1-0.4-1.2-0.2c-2.9,2.8-6.1-0.5-9.1,0.5c-0.8,0.3-1.9-0.4-2.8-0.8c-4.3-2-7.9-4.9-10.9-8.6c-0.6-0.8-1.1-1.8-1.3-2.7C1.1,28.1,0.5,25,0,22c-0.1-1,0-2.1,0.4-3c1.5-4.3,2.8-8.7,5.9-12.1c0.5-0.6,1.1-1.3,1.4-2C8.4,3.3,9.2,2.7,11,2.8c1.8,0,2.2-3,4.4-2.7c1.8,0.3,3.8,1.3,5.3,0.9c3.3-1.1,5.2,1.9,7.9,2c1.7,0,2.8,1.4,4.6,1.4c2.1,0,2.2,0.4,2.3,3.1c0,1.3,0.5,2,1.6,2.2c1.8,0.4,2.9,1.3,3,3.3c0,0.2,0.1,0.5,0.2,0.6c5.5,4.8,3.4,11.1,2.6,16.8c-0.6,4.7-4.3,7.9-7.9,10.5C32.5,42.5,29.3,43.1,27.2,43.1"/></svg>';

$('.arrow-btn, .arr-inner').find('.bg').html(arrowBG);

//! - GLOBAL: 2 LOADER

freezePage();
$(window).on('load', function () {
  // size retina images
  if ($('.retina').length > 0) {
    sizeRetina();
  }

  $(window).resize();

  // start ScrollMagic
  initScrollMagic();

  // mark active page in nav
  setTimeout(function () {
    $('#globalHeader').find('.underline').addClass('on');
  }, 400);

  TweenMax.to('#loader', 0.5, {
    delay: 0.2,
    opacity: 0,
    display: 'none',
    onComplete: function () {
      unfreezePage();

      // show special popup
      if ($('body').attr('id') == 'page-home') {
        TweenMax.to($('#special-overlay'), 0.5, {
          startAt: { display: 'block' },
          delay: 1,
          opacity: 1,
        });
      }

      if ($('#pricing-popup').length > 0) {
        showPricingPopup();
      }

      if ($('#business-clients').length > 0) {
        initLogoScroller();
      }
    },
  });
});

//! - GLOBAL: 3 MENU

var menuOpen = false;

$('.menu-btn').click(function () {
  if (!menuOpen) {
    // set for menu view
    $('#globalMenu').addClass('open expanded');

    // animate open
    TweenMax.to('.menu-wrap', 0.75, {
      startAt: { display: 'block' },
      opacity: 1,
      onComplete: function () {
        freezePage();
      },
    });

    menuOpen = true;
  } else {
    closeMenu();
  }
});

function closeMenu() {
  $('#globalMenu').removeClass('open');

  TweenMax.to('.menu-wrap', 0.5, {
    opacity: 0,
    display: 'none',
    onComplete: function () {
      unfreezePage();
      $('.menu-wrap').hide();
      $('#globalMenu').removeClass('expanded');
    },
  });

  menuOpen = false;
}

$('#globalMenu')
  .find('li.hasSub>a')
  .click(function () {
    if (winW <= menuBreak) {
      // close current
      if ($(this).parents('li').hasClass('subOpen')) {
        TweenMax.to($(this).parents('li').find('.subnav'), 0.5, {
          height: 0,
          ease: Power3.easeInOut,
        });
        $(this).parents('li').removeClass('subOpen');
        return false;

        // open current
      } else {
        // close others if open
        $('#globalMenu')
          .find('li.hasSub')
          .each(function () {
            if ($(this).hasClass('subOpen')) {
              TweenMax.to($(this).find('.subnav'), 0.5, {
                height: 0,
                ease: Power3.easeInOut,
              });
              $(this).removeClass('subOpen');
            }
          });

        subH = $(this).parents('li').find('.subnav').find('ul').outerHeight();
        TweenMax.to($(this).parents('li').find('.subnav'), 0.5, {
          height: subH,
          ease: Power3.easeInOut,
        });
        $(this).parents('li').addClass('subOpen');
        return false;
      }
    }
  });

//! - GLOBAL: 4 SUB MENUS

$('#globalHeader')
  .find('li.hasSub')
  .each(function () {
    $(this).mouseenter(function () {
      if (!mobile) {
        $(this).addClass('open');
        $(this).find('.subnav').show();
        TweenMax.killTweensOf($(this).find('.subnav'));
        TweenMax.to($(this).find('.subnav'), 0.75, {
          startAt: { y: -10, opacity: 0 },
          opacity: 1,
          y: 0,
          ease: Elastic.easeOut.config(3, 4),
        });
      }
    });
  });

$('#globalHeader')
  .find('li.hasSub')
  .mouseleave(function () {
    closeSubmenu($(this));
  });

function closeSubmenu(trg) {
  trg.removeClass('open');
  TweenMax.killTweensOf(trg.find('.subnav'));
  TweenMax.to(trg.find('.subnav'), 0.5, {
    opacity: 0,
    y: -10,
    ease: Power3.easeInOut,
    onCompleteParams: [trg.find('.subnav')],
    onComplete: function (t) {
      t.hide();
    },
  });
}

$('#globalHeader')
  .find('li.hasSubSub')
  .each(function () {
    $(this).mouseenter(function () {
      if (!mobile) {
        $(this).addClass('open');
        $(this).find('.subsubnav').show();
        TweenMax.killTweensOf($(this).find('.subsubnav'));
        TweenMax.to($(this).find('.subsubnav'), 0.75, {
          startAt: { y: -10, opacity: 0 },
          opacity: 1,
          y: 0,
          ease: Elastic.easeOut.config(3, 4),
        });
      }
    });
  });

$('#globalHeader')
  .find('li.hasSubSub')
  .mouseleave(function () {
    closeSubSubmenu($(this));
  });

function closeSubSubmenu(trg) {
  trg.removeClass('open');
  TweenMax.killTweensOf(trg.find('.subsubnav'));
  TweenMax.to(trg.find('.subsubnav'), 0.5, {
    opacity: 0,
    y: -10,
    ease: Power3.easeInOut,
    onCompleteParams: [trg.find('.subsubnav')],
    onComplete: function (t) {
      t.hide();
    },
  });
}

//! - GLOBAL: 5 FORM SUBMIT

var formSent = false;
var formData;
var formURL;

$('.global-form:not(#search-form)').submit(function () {
  if (validateForm($(this))) {
    sendForm($(this));
  }
  return false;
});

function sendForm(formObj) {
  // animation actions

  formData = formObj.serialize();
  formURL = $(formObj).attr('action');
  if ($(formObj).attr('id') != 'request-ws') {
    $(formObj).addClass('sending');
  }
  $(formObj).find('input, button').attr('disabled', 'disabled');

  // check captcha first

  if ($(formObj).find('.g-recaptcha').length > 0) {
    $.ajax({
      url: url + 'wp-admin/admin-ajax.php',
      type: 'POST',
      data: {
        action: 'validate_captcha',
        captcha: grecaptcha.getResponse(),
      },

      success: function (result) {
        // captcha verified
        if (result == 'verified') {
          sendValidated(formObj);
        }

        // captcha not verified
        if (result == 'not verified') {
          $(formObj)
            .parents('.form-wrap, .subscribe-wrap')
            .find('.thank-you p')
            .text('Captcha was not verified. Please try again.');
          TweenMax.to(
            $(formObj)
              .parents('.form-wrap, .subscribe-wrap')
              .find('.thank-you'),
            0.5,
            { autoAlpha: 1 }
          );
          $(formObj).removeClass('sending');
          $(formObj).find('input, button').removeAttr('disabled');
        }
      },
    });

    // no captcha required
  } else {
    sendValidated(formObj);
  }
}

// submit form data if captcha verified

function sendValidated(formObj) {
  $.ajax({
    url: formURL,
    type: 'POST',
    data: formData,

    success: function (data) {
      // prompt redirect to new url
      if ($(formObj).attr('id') == 'request-ws') {
        sendDL(formObj);
        window.location = fullurl + '?samples-requested=true';

        // normal ajax response
      } else {
        sendDL(formObj);
        formSent = true;
        // grab thank you message from CF7 output
        msg = $(data).find('.wpcf7-response-output').text();
        $(formObj)
          .parents('.form-wrap, .subscribe-wrap')
          .find('.thank-you p')
          .text(msg);

        // show thank you message
        TweenMax.to(
          $(formObj).parents('.form-wrap, .subscribe-wrap').find('.thank-you'),
          0.5,
          { autoAlpha: 1 }
        );
        $(formObj).removeClass('sending');

        // add in Hyperise
        //var em = '';
        //if($(formObj).attr('id') == 'request-ws'){
        //	em = document.getElementById("ws_email").value;
        //}
        //if($(formObj).attr('id') == 'request-wp'){
        //	em = document.getElementById("wp_email").value;
        //}
        // hyperise.personalize({email: em});

        if (
          msg != 'One or more fields have an error. Please check and try again.'
        ) {
          // reset form
          $(formObj).trigger('reset');
          $(formObj).find('input, button').removeAttr('disabled');
          $('.s2-elem').val('').trigger('change');
          if ($(formObj).find('.g-recaptcha').length > 0) {
            grecaptcha.reset();
          }
        }
      }
    },
  });
}

if (samplesSent) {
  $('.business-hero')
    .find('.thank-you')
    .css({ opacity: 1, visibility: 'visible' });
}

// two-part form

let formPart = 1;
if ($('.form-part').length > 0) {
  $('.form-wrap')
    .find('a.next')
    .click(function () {
      if (validateForm($(this).parents('form'), 1)) {
        gsap.to($('.business-hero').find('form'), {
          duration: 0.3,
          opacity: 0,
          onComplete: function () {
            $('.form-wrap').find('.form-part').removeClass('on');

            // change form
            formPart = 2;
            $('.form-wrap')
              .find('.form-part[data-num="' + formPart + '"')
              .addClass('on');

            // update buttons
            $('.form-wrap').find('a.back, button.submit-form').show();
            $('.form-wrap').find('a.next').hide();

            // fade back
            gsap.to($('.business-hero').find('form'), {
              duration: 0.3,
              opacity: 1,
            });
          },
        });
        gsap.to(
          $('.global-form')
            .parents('.form-wrap, .subscribe-wrap')
            .find('.thank-you, .error-msg'),
          { duration: 0.5, autoAlpha: 0 }
        );
      }

      return false;
    });
  /*   $('.form-wrap')
    .find('a.back')
    .click(function () {
      gsap.to($('.business-hero').find('form'), {
        duration: 0.3,
        opacity: 0,
        onComplete: function () {
          $('.form-wrap').find('.form-part').removeClass('on');

          // change form
          formPart = 1;
          $('.form-wrap')
            .find('.form-part[data-num="' + formPart + '"')
            .addClass('on');

          // update buttons
          $('.form-wrap').find('a.back, button.submit-form').hide();
          $('.form-wrap').find('a.next').show();

          // fade back
          gsap.to($('.business-hero').find('form'), {
            duration: 0.3,
            opacity: 1,
          });
        },
      });

      return false;
    }); */
}

var invalidTxt =
  'One or more fields have an error. Please check and try again.';

function validateForm(formObj, part) {
  var vNum = 0;
  var formPart = formObj;
  if (part !== undefined) {
    formPart = $(formObj).find('.form-part[data-num="' + part + '"');
  }

  $(formPart)
    .find('.wpcf7-validates-as-required')
    .each(function () {
      if ($(this).val() == '') {
        vNum++;
        $(this).parents('.field-wrap').addClass('error');
      }

      // special check for email
      if (
        $(this).attr('name') == 'email' ||
        $(this).attr('name') == 'ws_email'
      ) {
        if (!emailIsValid($(this).val())) {
          vNum++;
          $(this).parents('.field-wrap').addClass('error');
        }
      }
    });
  if (vNum == 0) {
    return true;
  } else {
    // show invalid text

    // basic form
    if (
      !$(formObj)
        .parents('.form-wrap, .subscribe-wrap')
        .find('.thank-you')
        .hasClass('full')
    ) {
      $(formObj)
        .parents('.form-wrap, .subscribe-wrap')
        .find('.thank-you p')
        .text(invalidTxt);
      TweenMax.to(
        $(formObj).parents('.form-wrap, .subscribe-wrap').find('.thank-you'),
        0.5,
        { autoAlpha: 1 }
      );

      // uses large box thank you
    } else {
      $(formObj)
        .parents('.form-wrap, .subscribe-wrap')
        .find('.error-msg p')
        .text(invalidTxt);
      TweenMax.to(
        $(formObj).parents('.form-wrap, .subscribe-wrap').find('.error-msg'),
        0.5,
        { autoAlpha: 1 }
      );
    }

    return false;
  }
}

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// reset error on click

$('.wpcf7-validates-as-required').on('focus click', function () {
  if ($(this).parents('.field-wrap').hasClass('error')) {
    $(this).parents('.field-wrap').removeClass('error');
  }
});

// remove signup thank you on click

$('.global-form input').on('focus click', function () {
  TweenMax.to(
    $('.global-form')
      .parents('.form-wrap, .subscribe-wrap')
      .find('.thank-you, .error-msg'),
    0.5,
    { autoAlpha: 0 }
  );
});

//! select2 list styling
let lastCountry = 'United States';
$(document).ready(function () {
  $('.s2-elem')
    .each(function () {
      ph = $(this).attr('placeholder');
      $(this).select2({
        width: '100%',
        minimumResultsForSearch: -1,
        placeholder: ph,
      });
    })
    .on('select2:open', function (e) {
      if ($(this).parents('.field-wrap').hasClass('error')) {
        $(this).parents('.field-wrap').removeClass('error');
      }
    })
    .on('select2:open', function (e) {
      //console.log('open')
      $('.select2-dropdown').addClass('on');
    })
    .on('select2:closing', function (e) {
      $('.select2-dropdown').removeClass('on');
    })
    .on('select2:select', function (e) {
      // check if country for switching
      q = e.params.data._resultId.split('s2-country');
      if (q.length > 1) {
        sel = e.params.data.id;
        if (sel != lastCountry) {
          updateFields(sel, e.value);
        }
      }
    });

  $('.select2-selection__arrow').append(
    '<img src="' + path + 'images/icomoon/chevron.svg" class="icon">'
  );
});

function updateFields(id) {
  // reset others
  $('.toggle').removeClass('on');
  $('.toggle').find('input, select').removeClass('wpcf7-validates-as-required');
  $('.toggle').find('input').val('');
  $('.toggle').find('.s2-elem').val('').trigger('change');

  if (id == 'United States') {
    $('[data-id="us-state"]').addClass('on');
    $('[data-id="us-state"]')
      .find('select')
      .addClass('wpcf7-validates-as-required');
  } else if (id == 'Canada') {
    $('[data-id="ca-province"]').addClass('on');
    $('[data-id="ca-province"]')
      .find('select')
      .addClass('wpcf7-validates-as-required');
  } else {
    $('[data-id="province"]').addClass('on');
    $('[data-id="province"]')
      .find('input')
      .addClass('wpcf7-validates-as-required');
  }

  lastCountry = id;
}
$('[data-id="us-state"]')
  .find('select')
  .addClass('wpcf7-validates-as-required');

//! - GLOBAL: 6 OVERLAYS

function openContactOverlay() {
  freezePage();

  // open overlay
  $('#contact-overlay').css({ display: 'block' });
  TweenMax.to($('#contact-overlay'), 0.5, { opacity: 1 });
}

function closeContactOverlay() {
  TweenMax.to($('#contact-overlay'), 0.5, {
    opacity: 0,
    display: 'none',
    onComplete: function () {
      unfreezePage();
    },
  });
}

$('a[href="#contact"]').click(function () {
  openContactOverlay();
  return false;
});

$('#contact-overlay, #contact-overlay .close-btn').click(function () {
  closeContactOverlay();
});

$('#contact-overlay, #special-overlay')
  .find('.contact-modal')
  .click(function (e) {
    e.stopPropagation();
  });

$('#special-overlay, #special-overlay .close-btn').click(function () {
  closeSpecialOverlay();
});

function closeSpecialOverlay() {
  TweenMax.to($('#special-overlay'), 0.5, {
    opacity: 0,
    display: 'none',
    onComplete: function () {
      unfreezePage();
    },
  });
}

//! - GLOBAL: 7 COOKIES OVERLAY

function closeCookiesOverlay() {
  gsap.to($('#cookies-overlay'), {
    y: '100%',
    ease: 'power3.inOut',
    duration: 0.75,
    onComplete: function () {
      $('#cookies-overlay').hide();
    },
  });
}

$('#cookies-overlay')
  .find('.close-btn, .accept-btn')
  .click(function () {
    closeCookiesOverlay();
    return false;
  });

function createCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

if (readCookie('revisit') === 'true') {
  $('#cookies-overlay').hide();
} else {
  createCookie('revisit', 'true', 7);
}

/*! - SCROLLING ***************************** */

//! - SCROLLING: 0 STICKY ELEMENTS

var sT;
var stickyOpen = false;

$(window).on('scrollstart', function () {
  scroll_interval = setInterval(function () {
    sT = $(this).scrollTop();

    // set sticky bar
    if (winW > stickyBreak) {
      setSticky();
    }
  }, 10);
});

$(window).on('scrollstop', function () {
  if (scroll_interval) {
    clearInterval(scroll_interval);
  }
});

function setSticky() {
  // drop sticky bar on scroll up
  if (sT > 0) {
    if (!stickyOpen) {
      $('#globalHeader').addClass('sticky');
      $('#globalMenu').addClass('sticky');

      // animate sticky logo

      // setup H for animation
      TweenMax.set('.logo-dot', { scaleX: 1.4, scaleY: 1.4, x: 0, opacity: 0 });
      TweenMax.set('.h1-rect', { attr: { height: 0 } });
      TweenMax.set('.h2-rect', { attr: { width: 0 } });

      // animate draw H
      TweenMax.to('.logo-dot', 0.75, {
        delay: 0.3,
        x: 0,
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        ease: Elastic.easeOut.config(2, 1),
      });
      TweenMax.to('.h1-rect', 0.5, {
        delay: 0.4,
        attr: { height: 29 },
        ease: Power3.easeIn,
      });
      TweenMax.to('.h2-rect', 1, {
        delay: 0.9,
        attr: { width: 17 },
        ease: Power3.easeOut,
      });

      // for developers page
      if ($('body').attr('id') == 'page-developers') {
        $('#dev-sidebar').addClass('sticky');
      }

      stickyOpen = true;
    }
  } else {
    if (stickyOpen) {
      $('#globalHeader').removeClass('sticky');
      $('#globalMenu').removeClass('sticky');

      // for developers page
      if ($('body').attr('id') == 'page-developers') {
        $('#dev-sidebar').removeClass('sticky');
      }

      stickyOpen = false;
    }
  }

  lastSt = sT;
}

//! - SCROLLING: 1 SCROLLMAGIC

var controller = new ScrollMagic.Controller();

function initScrollMagic() {
  // global: sections with animations

  $('.hasAnim').each(function () {
    var currentElem = '#' + $(this).attr('id');
    var added = 0;
    var elemOffset = 0;
    if ($(this).attr('data-added')) {
      added = $(this).attr('data-added');
    }
    if ($(this).attr('data-offset')) {
      elemOffset = -$(this).attr('data-offset');
    }

    var scene = new ScrollMagic.Scene({
      triggerElement: currentElem,
      triggerHook: 2,
      offset: elemOffset,
      duration: winH + $(currentElem).outerHeight() + Number(added),
    })
      .on('enter', function () {
        activateAnim(currentElem);
      })
      .on('leave', function () {
        resetAnim(currentElem);
      })
      .addTo(controller);
    scene.setClassToggle(currentElem, 'on');
  });
}

/*! - PAGE ***************************** */

//! - PAGE: 0 HOME -> 0 CUSTOMER SLIDES

var cusCur = 1;
var totCusSlides = $('.customer-slide').length;
var customerBreak = 768;
var totMarg = 50;

$('.customer-slide').each(function (i) {
  $(this).attr('data-num', i + 1);
});

$('.customers')
  .find('.arrow-btn')
  .click(function () {
    if ($(this).hasClass('left')) {
      dir = -1;
    } else {
      dir = 1;
    }
    changeCustomerSlider(dir);
  });

function changeCustomerSlider(dir) {
  if (winW <= customerBreak) {
    cusW = winW;
  } else {
    cusW = $('.customer-slide').width();
  }

  // slide current over
  TweenMax.to($('.customer-slide[data-num="' + cusCur + '"]'), 1, {
    x: -dir * cusW,
    ease: Power3.easeInOut,
    onCompleteParams: [$('.customer-slide[data-num="' + cusCur + '"]')],
    onComplete: function (t) {
      t.css('display', 'none');
    },
  });

  // change active num, get new offset position
  cusCur += dir;

  // bring new on
  TweenMax.to($('.customer-slide[data-num="' + cusCur + '"]'), 1, {
    startAt: { display: 'block', x: dir * cusW },
    x: 0,
    ease: Power3.easeInOut,
  });

  // special adjustments
  if (cusCur == 1) {
    $('.customers').find('.arrow-btn.left').addClass('off');
  } else if ($('.customers').find('.arrow-btn.left').hasClass('off')) {
    $('.customers').find('.arrow-btn.left').removeClass('off');
  }

  if (cusCur == totCusSlides) {
    $('.customers').find('.arrow-btn.right').addClass('off');
  } else if ($('.customers').find('.arrow-btn.right').hasClass('off')) {
    $('.customers').find('.arrow-btn.right').removeClass('off');
  }

  // change counter
  showCur = cusCur;
  $('.customers').find('.count-current').text(showCur);
}

function updateCustomerSlides() {
  if (winW <= customerBreak) {
    // set width based on window size
    cusSetW = winW - totMarg;
    $('.customer-slide').width(cusSetW);
  } else {
    $('.customer-slide').css('width', '');
  }
}

//! - PAGE: 1 BUSINESS -> 0 MODULE SLIDER

var modW = Number($('.module-slider-wrap').attr('data-width'));
var modGap;
var modGapD = Number($('.module-slider-wrap').attr('data-gap'));
var modGapM = Number($('.module-slider-wrap').attr('data-gap-mob'));

var modCur = 0;
var nextCur = 0;
var totModSlides = $('.module-slide').length;
var totalModW;
var modBreak = 650;

function updateModSliders() {
  // set width based on window size
  if (winW <= modBreak) {
    modW = winW - totMarg;
    if (modW > 380) {
      modW = 380;
    }
    if ($('body').attr('id') == 'page-pricing') {
      modW = winW - totMarg;
    }
    $('.module-slide').width(modW);
  } else {
    modW = Number($('.module-slider-wrap').attr('data-width'));
    $('.module-slide').css('width', '');
  }

  if (winW > 768) {
    modGap = modGapD;
  } else {
    modGap = modGapM;
  }
  $('.module-sliders').find('.count-total').text(totModSlides);
  totalModW = modW * totModSlides + modGap * (totModSlides - 1);
  $('.module-slider').width(totalModW);
  newPos = modW * modCur + modGap * modCur;
  TweenMax.set($('.module-slider'), { x: -newPos });
}
if ($('.module-slider-wrap').length > 0) {
  updateModSliders();
}

$('.module-slide').each(function (i) {
  $(this).attr('data-num', i);
});

$('.module-sliders')
  .find('.arrow-btn')
  .click(function () {
    if ($(this).hasClass('left')) {
      dir = -1;
    } else {
      dir = 1;
    }
    changeModSlider(dir);
  });

function changeModSlider(dir) {
  // change active num, get new offset position
  modCur += dir;
  nextCur = modCur;
  if (winW > 768) {
    modGap = modGapD;
  } else {
    modGap = modGapM;
  }
  newPos = modW * modCur + modGap * modCur;
  if (winW <= 650) {
    newPos = modW * modCur + modGap * modCur;
  }

  // slide over
  TweenMax.to($('.module-slider'), 1, { x: -newPos, ease: Power3.easeInOut });

  // special adjustments
  if (modCur == 0) {
    $('.module-sliders').find('.arrow-btn.left').addClass('off');
  } else if ($('.module-sliders').find('.arrow-btn.left').hasClass('off')) {
    $('.module-sliders').find('.arrow-btn.left').removeClass('off');
  }

  if (modCur == totModSlides - 1) {
    $('.module-sliders').find('.arrow-btn.right').addClass('off');
  } else if ($('.module-sliders').find('.arrow-btn.right').hasClass('off')) {
    $('.module-sliders').find('.arrow-btn.right').removeClass('off');
  }

  // change counter
  $('.module-sliders')
    .find('.count-current')
    .text(modCur + 1);

  // if has title, change title
  if ($('.module-sliders').find('.slide-title').length > 0) {
    modTitle = $('.module-slide[data-num="' + modCur + '"]').attr('data-title');
    TweenMax.to($('.module-sliders').find('.slide-title'), 0.5, {
      opacity: 0,
      onComplete: function () {
        $('.module-sliders').find('.slide-title').text(modTitle);
        TweenMax.to($('.module-sliders').find('.slide-title'), 0.5, {
          opacity: 1,
        });
      },
    });
  }
}

//! - PAGE: 3 FEATURES -> 0 APP SLIDER

var appCur = 0;
var appW = 283;
var totAppSlides = $('.phone-screen').length;
var appInt = 3500;

$('.dot-btn').each(function (i) {
  $(this).attr('data-num', i);
});
$('.phone-screen').each(function (i) {
  $(this)
    .attr('data-num', i)
    .css('left', appW * i + 'px');
});

$('#phone-slider')
  .find('.dot-btn')
  .click(function () {
    if (appSliders) {
      clearInterval(appSliders);
    }
    $('#phone-slider').find('.dot-btn').removeClass('on');
    $(this).addClass('on');
    appCur = $(this).attr('data-num');
    newX = -(appW * appCur);
    TweenMax.to($('.phone-screen-slider'), 1, {
      x: newX,
      ease: Power3.easeInOut,
    });
  });

function initAppSlideshow() {
  // reset
  appCur = 0;
  TweenMax.set($('.phone-screen-slider'), { x: 0 });
  $('#phone-slider').find('.dot-btn').removeClass('on');
  $('#phone-slider').find('.dot-btn[data-num="0"]').addClass('on');

  appSliders = setInterval(function () {
    appCur++;
    if (appCur == totAppSlides) {
      appCur = 0;
    }
    newX = -(appW * appCur);
    TweenMax.to($('.phone-screen-slider'), 1, {
      x: newX,
      ease: Power3.easeInOut,
    });

    $('#phone-slider').find('.dot-btn').removeClass('on');
    $('#phone-slider')
      .find('.dot-btn[data-num="' + appCur + '"]')
      .addClass('on');
  }, appInt);
}

function resetAppSlideshow() {
  clearInterval(appSliders);
}

//! - PAGE: 4 BLOG -> 0 SPECIAL HOVER

$('.blog-grid .blog-thumb')
  .mouseenter(function () {
    if (winW > 1024) {
      tmpH = $(this).find('.thumb-hover').outerHeight();
      if ($(this).find('.thumb-hover').css('visibility') == 'hidden') {
        TweenMax.set($(this).find('.thumb-hover'), {
          y: tmpH,
          visibility: 'visible',
          opacity: 0,
        });
      }

      TweenMax.killTweensOf($(this).find('.txt, .thumb-hover'));
      TweenMax.to($(this).find('.txt'), 0.5, {
        y: -tmpH,
        ease: Power3.easeOut,
      });
      TweenMax.to($(this).find('.thumb-hover'), 0.5, {
        y: 0,
        opacity: 1,
        ease: Power3.easeOut,
      });
    }
  })
  .mouseleave(function () {
    if (winW > 1024) {
      tmpH = $(this).find('.thumb-hover').outerHeight();
      TweenMax.killTweensOf($(this).find('.txt, .thumb-hover'));
      TweenMax.to($(this).find('.txt'), 0.5, { y: 0, ease: Quad.easeInOut });
      TweenMax.to($(this).find('.thumb-hover'), 0.5, {
        y: tmpH,
        autoAlpha: 0,
        ease: Quad.easeInOut,
      });
    }
  });

//! - PAGE: 4 BLOG -> 1 SEARCH MODAL

function openSearchOverlay() {
  freezePage();

  // open overlay
  $('#search-overlay').css({ display: 'block' });
  TweenMax.to($('#search-overlay'), 0.5, { opacity: 1 });

  // focus search field
  $('.searchinput').focus();
}

function closeSearchOverlay() {
  TweenMax.to($('#search-overlay'), 0.5, {
    opacity: 0,
    display: 'none',
    onComplete: function () {
      unfreezePage();
    },
  });
}

$('[id^="search-btn"]').click(function () {
  openSearchOverlay();
});

$('#search-overlay, #search-overlay .close-btn').click(function () {
  closeSearchOverlay();
});

$('#search-overlay')
  .find('.search-modal')
  .click(function (e) {
    e.stopPropagation();
  });

//! - PAGE: 4 BLOG -> 2 AUTO SEARCH

var autoSearchW = 0;

$('.searchinput').on('input', function (e) {
  autoObj = $(this).parents('.search-wrap').find('.search-auto');

  if (winW > autoSearchW) {
    if ($(this).val() != '') {
      autoObj.addClass('on');
      setSearchListener();
      //console.log("a")
    } else {
      autoObj.removeClass('on');
    }
  }
});

$('.searchinput').on('click', function (e) {
  autoObj = $(this).parents('.search-wrap').find('.search-auto');

  if (winW > autoSearchW) {
    if ($(this).val() != '') {
      autoObj.addClass('on');
      setSearchListener();
    }
  }
});

function setSearchListener() {
  setTimeout(function () {
    $('body').bind('click', function () {
      $('.search-wrap').removeClass('open');
      $('.search-auto').removeClass('on');
      $('body').unbind('click');
    });
    $('.search-wrap').click(function (e) {
      e.stopPropagation();
    });
  }, 100);
}

// auto populate with titles on search

var tmpS = '';
var tmpM = '';
var tmpSLen = 0;
var autoLimit = 10;
var auto_matches = '';

$('.searchinput').bind('input', function () {
  // get current search text
  autoObj = $(this).parents('.search-wrap').find('.search-auto');
  tmpS = $(this).val();
  tmpSLen = tmpS.length;
  auto_matches = '';
  matchNum = 0;

  // check for match among titles
  if (tmpSLen > 0) {
    for (i = 0; i < post_titles.length; i++) {
      //console.log(tmpS+' / '+post_titles[i]);

      // search for match
      tmpM = post_titles[i].substr(0, tmpSLen);
      if (tmpS.toLowerCase() == tmpM.toLowerCase()) {
        if (matchNum < autoLimit) {
          auto_matches +=
            '<li><a href="' +
            post_urls[i] +
            '">' +
            post_titles[i] +
            '</a></li>';
          matchNum++;
        }
      }
    }
  }

  // if match found
  if (matchNum > 0) {
    autoObj.addClass('on');

    // show matches
    autoObj.find('ul').html(auto_matches);
  } else {
    autoObj.removeClass('on');

    // remove matches
    setTimeout(function () {
      autoObj.find('ul').html('');
    }, 300);
  }
});

//! - PAGE: 5 ABOUT -> 0 FAQ

$('.faq-question').find('.answer').height(0);
$('.faq-question .question').click(function () {
  if (!$(this).parents('.faq-question').hasClass('open')) {
    resetfaqs($(this).parents('.faq-question'));
    $(this).parents('.faq-question').addClass('open');
    tmpH = $(this).parents('.faq-question').find('.answer>div').outerHeight();
    TweenMax.to($(this).parents('.faq-question').find('.answer'), 0.5, {
      startAt: { height: 0 },
      height: tmpH,
      ease: Power3.easeInOut,
      onCompleteParams: [$(this).parents('.faq-question').find('.answer')],
      onComplete: function (t) {
        t.css('height', '');
      },
    });
  } else {
    $(this).parents('.faq-question').removeClass('open');
    $(this)
      .parents('.faq-question')
      .find('.answer')
      .css({
        height: $(this)
          .parents('.faq-question')
          .find('.answer>div')
          .outerHeight(),
      });
    TweenMax.to($(this).parents('.faq-question').find('.answer'), 0.5, {
      height: 0,
      ease: Power3.easeInOut,
    });
  }
});

function resetfaqs(obj) {
  $('.faq-question').each(function () {
    if ($(this).hasClass('open') && $(this) != obj) {
      $(this).removeClass('open');
      $(this)
        .find('.answer')
        .css({ height: $(this).find('.answer>div').outerHeight() });
      TweenMax.to($(this).find('.answer'), 0.5, {
        height: 0,
        ease: Power3.easeInOut,
      });
    }
  });
}

//! - PAGE: 5 ABOUT -> 1 COMPARE CHART

if ($('.compare-table').length > 0) {
  var totCRows = [];

  $('.compare-table').each(function (i) {
    totCRows[i] = $(this).find('.col').find('.table-row').length;

    $(this)
      .find('.col')
      .each(function () {
        $(this)
          .find('.table-row')
          .each(function (i) {
            $(this).attr('data-num', i);
          });
      });
  });
}

function updateCompareChart() {
  if (winW > 650) {
    // cycle through rows and expand to match heights
    $('.compare-table').each(function (n) {
      for (i = 0; i < totCRows[n]; i++) {
        maxH = 0;

        // find largest value
        $(this)
          .find('.col')
          .each(function () {
            $(this)
              .find('.table-row[data-num="' + i + '"]')
              .css({ 'min-height': '', height: '' });
            tmpH = $(this)
              .find('.table-row[data-num="' + i + '"]')
              .outerHeight();
            if (tmpH > maxH) {
              maxH = tmpH;
            }
          });

        // apply largest value to all rows
        $(this)
          .find('.col')
          .each(function () {
            if (
              $(this)
                .find('.table-row[data-num="' + i + '"]')
                .hasClass('cta tall') ||
              $(this)
                .find('.table-row[data-num="' + i + '"]')
                .hasClass('long')
            ) {
              $(this)
                .find('.table-row[data-num="' + i + '"]')
                .css({ height: maxH + 10 + 'px' });
            } else {
              $(this)
                .find('.table-row[data-num="' + i + '"]')
                .css({ 'min-height': maxH + 'px' });
            }
          });
      }
    });

    // reset values for mobile
  } else {
    $('.compare-table')
      .find('.table-row')
      .css({ 'min-height': '', height: '' });

    // update mobile chart
    if ($('body').attr('id') == 'page-pricing') {
      totBRows = $('#bulk-slider').find('.col').find('.table-row').length;

      $('#bulk-slider')
        .find('.col')
        .each(function () {
          $(this)
            .find('.table-row')
            .each(function (a) {
              $(this).attr('data-num', a);
            });
        });

      for (i = 0; i < totBRows; i++) {
        maxH = 0;
        $('#bulk-slider')
          .find('.col')
          .each(function () {
            $(this)
              .find('.table-row[data-num="' + i + '"]')
              .css({ 'min-height': '', height: '' });
            tmpH = $(this)
              .find('.table-row[data-num="' + i + '"]')
              .outerHeight();
            if (tmpH > maxH) {
              maxH = tmpH;
            }
          });
        $('#bulk-slider')
          .find('.col')
          .each(function () {
            if (
              $(this)
                .find('.table-row[data-num="' + i + '"]')
                .hasClass('long')
            ) {
              $(this)
                .find('.table-row[data-num="' + i + '"]')
                .css({ height: maxH + 17 + 'px' });
            } else {
              $(this)
                .find('.table-row[data-num="' + i + '"]')
                .css({ 'min-height': maxH + 'px' });
            }
          });
      }

      newH = $('#bulk-slider').find('.module-slide').height();
      $('#bulk-slider')
        .find('.module-slider-wrap')
        .css({ height: newH + 'px' });
    }
  }

  // special update for new pricing chart
  $('.compare-table.pricing')
    .find('.table-row.title, .table-row.cta')
    .css({ 'min-height': '', height: '' });
}

//! - PAGE: 6 ROBOTS -> 0 DIAGRAM SLIDER

var modCurRob = 1;
var totModSlidesRob = $('.robot-mod-wrap').find('.mobile-label').length;

$('.robot-mod-wrap')
  .find('.arrow-btn')
  .click(function () {
    if ($(this).hasClass('left')) {
      dir = -1;
    } else {
      dir = 1;
    }
    changeModSliderRobot(dir);
  });

$('.robot-mod-wrap')
  .find('.label')
  .mouseenter(function () {
    if ($('.robot-mod-wrap').find('.label[data-num="1"]').hasClass('first')) {
      $('.robot-mod-wrap').find('.label[data-num="1"]').removeClass('first');
    }
  });

function changeModSliderRobot(dir) {
  // fade out current
  $('.robot-mod-wrap')
    .find('.label[data-num="' + modCurRob + '"]')
    .removeClass('on');
  TweenMax.to(
    $('.robot-mod-wrap').find('.mobile-label[data-num="' + modCurRob + '"]'),
    0.25,
    { opacity: 0, display: 'none', ease: Linear.easeNone }
  );

  // change active num, get new offset position
  modCurRob += dir;

  // fade in new
  TweenMax.to(
    $('.robot-mod-wrap').find('.mobile-label[data-num="' + modCurRob + '"]'),
    0.5,
    {
      delay: 0.35,
      startAt: { display: 'block' },
      opacity: 1,
      ease: Linear.easeNone,
    }
  );

  // highlight diagram
  $('.robot-mod-wrap')
    .find('.label[data-num="' + modCurRob + '"]')
    .addClass('on');

  // special adjustments
  if (modCurRob == 1) {
    $('.robot-mod-wrap').find('.arrow-btn.left').addClass('off');
  } else if ($('.robot-mod-wrap').find('.arrow-btn.left').hasClass('off')) {
    $('.robot-mod-wrap').find('.arrow-btn.left').removeClass('off');
  }

  if (modCurRob == totModSlidesRob - 1) {
    $('.robot-mod-wrap').find('.arrow-btn.right').addClass('off');
  } else if ($('.robot-mod-wrap').find('.arrow-btn.right').hasClass('off')) {
    $('.robot-mod-wrap').find('.arrow-btn.right').removeClass('off');
  }

  // change counter
  $('.robot-mod-wrap').find('.count-current').text(modCurRob);
}

//! - PAGE: 7 SEO LANDING -> 0 CLIENT TICKER

var totLogoW = 0;
var logoGap = 75;
var logoInit = false;

function initLogoScroller() {
  trg = $('.logo-scroller');

  // get width of all text parts
  trg
    .find('.scroll-group[data-num="1"]')
    .find('.ticker-logo')
    .each(function (i) {
      totLogoW += Math.round($(this).outerWidth());
    });

  // add gap
  gapW =
    (trg.find('.scroll-group[data-num="1"]').find('div').length - 1) * logoGap;
  totLogoW += gapW;

  // position each group
  gsap.set(trg.find('.scroll-group'), { width: totLogoW });
  gsap.set(trg.find('.scroll-group[data-num="2"]'), { left: totLogoW });

  // set full width of slider wrap
  gsap.set(trg.find('.scroll-mover'), { width: totLogoW * 2 });

  logoInit = true;
  updateLogoScroller();
}

function updateLogoScroller() {
  trg = $('.logo-scroller');

  if (logoInit) {
    if (winW > 768) {
      newW2 = totLogoW;
      gsap.set(trg.find('.scroll-group'), { width: totLogoW });
      gsap.set(trg.find('.scroll-group[data-num="2"]'), { left: newW2 });
      gsap.set(trg.find('.scroll-mover'), { width: newW2 * 2 });
    } else {
      newW2 = totLogoW / 2;
      gapW =
        (trg.find('.scroll-group[data-num="1"]').find('div').length - 1) * 20;
      totLogoW2 = totLogoW / 2;
      totLogoW2 += gapW / 2;

      gsap.set(trg.find('.scroll-group'), { width: totLogoW2 });
      gsap.set(trg.find('.scroll-group[data-num="2"]'), { left: totLogoW2 });
      gsap.set(trg.find('.scroll-mover'), { width: totLogoW2 * 2 });
    }
  }
}

/*! - x ANIMATION ***************************** */

//! - x ANIMATION: 0 INIT

// set objects along path in default pos
if ($('.plane').length > 0) {
  TweenMax.set($('.hasAnim').find('.plane'), {
    xPercent: -50,
    yPercent: -50,
    display: 'none',
  });
}
if ($('.bot-pencil').length > 0) {
  TweenMax.set($('.hasAnim').find('.bot-pencil, .bot-card'), {
    xPercent: -50,
    yPercent: -50,
    display: 'none',
  });
  if ($('body').attr('id') == 'page-home') {
    $('.bot-card').html(
      '<div class="line" data-num="1"></div><div class="line-wrap"><div class="line" data-num="2"></div><img src="' +
        path +
        'images/home/parts/cards-card.svg" class="card"></div>'
    );
  } else {
    $('.bot-card').html(
      '<div class="line" data-num="1"></div><div class="line" data-num="2"></div><img src="' +
        path +
        'images/about/parts/cards-card.svg" class="card">'
    );
  }
}

if ($('.path-dot.bez').length > 0) {
  TweenMax.set($('.hasAnim').find('.path-dot.bez'), {
    xPercent: -50,
    yPercent: -50,
    display: 'none',
  });
}

//! - x ANIMATION: 1 ACTIVATION

function activateAnim(obj) {
  //console.log('-start '+obj);

  // home -> hero
  if (obj == '#home-hero') {
    initHomeHero();
  }

  // home -> about
  if (obj == '#home-about') {
    initHomeAbout();
  }
  if (obj == '#home-about-ul') {
    initHomeAboutUL();
  }

  // home -> cards
  if (obj == '#home-cards') {
    initHomeCards();
  }

  // home -> cta
  if (obj == '#footer-cta') {
    initHomeCTA();
  }

  // business -> hero
  if ($(obj).hasClass('business-hero')) {
    initBusinessHero();
  }

  // integrations -> demos
  if ($(obj).hasClass('int-demo')) {
    initIntDemo(obj);
  }

  // features -> feature row
  if (obj == '#feature1') {
    initFeature1();
  }
  if (obj == '#feature2') {
    initFeature2();
  }
  if (obj == '#feature3') {
    initFeature3();
  }
  if (obj == '#feature4') {
    initFeature4();
  }
  if (obj == '#feature5') {
    initFeature5();
  }
  if (obj == '#feature6') {
    initFeature6();
  }

  // about -> help
  if (obj == '#about-help') {
    initAboutHelp();
  }

  // global -> phone slider
  if (obj == '#phone-slider') {
    initAppSlideshow();
  }

  // tutorials -> hero
  if ($(obj).hasClass('tutorials-hero')) {
    initTutorialsHero();
  }

  // pricing -> hero
  if ($(obj).hasClass('pricing-hero')) {
    initPricingHero();
  }

  // pricing -> bulk
  if (obj == '#pricing-bulk') {
    initPricingBulk();
  }

  // gift cards -> hero
  if ($(obj).hasClass('giftcards-hero')) {
    initGiftCards();
  }

  // get started cta
  if (obj == '#cta-getstarted') {
    initGetStarted();
  }

  // team -> hero
  if ($(obj).hasClass('team-hero')) {
    initTeamHero();
  }

  // seo landing
  if (obj == '#features-landing') {
    initFeatureL3();
  }
}

function resetAnim(obj) {
  //console.log('--stop '+obj);

  // home -> hero
  if (obj == '#home-hero') {
    resetHomeHero();
  }

  // home -> about
  if (obj == '#home-about') {
    resetHomeAbout();
  }

  // home -> cards
  if (obj == '#home-cards') {
    resetHomeCards();
  }

  // home -> cta
  if (obj == '#footer-cta') {
    resetHomeCTA();
  }

  // business -> hero
  if ($(obj).hasClass('business-hero')) {
    resetBusinessHero();
  }

  // integrations -> demos
  if ($(obj).hasClass('int-demo')) {
    resetIntDemo(obj);
  }

  // features -> feature row
  if (obj == '#feature1') {
    resetFeature1();
  }
  if (obj == '#feature2') {
    resetFeature2();
  }
  if (obj == '#feature3') {
    resetFeature3();
  }
  if (obj == '#feature4') {
    resetFeature4();
  }
  if (obj == '#feature5') {
    resetFeature5();
  }
  if (obj == '#feature6') {
    resetFeature6();
  }

  // about -> help
  if (obj == '#about-help') {
    resetAboutHelp();
  }

  // global -> phone slider
  if (obj == '#phone-slider') {
    resetAppSlideshow();
  }

  // tutorials -> hero
  if ($(obj).hasClass('tutorials-hero')) {
    resetTutorialsHero();
  }

  // pricing -> hero
  if ($(obj).hasClass('pricing-hero')) {
    resetPricingHero();
  }

  // pricing -> bulk
  if (obj == '#pricing-bulk') {
    resetPricingBulk();
  }

  // gift cards -> hero
  if ($(obj).hasClass('giftcards-hero')) {
    reseGiftCards();
  }

  // get started cta
  if (obj == '#cta-getstarted') {
    initGetStarted();
  }

  // team -> hero
  if ($(obj).hasClass('team-hero')) {
    resetTeamHero();
  }

  // seo landing
  if (obj == '#features-landing') {
    resetFeatureL3();
  }
}

//! - x ANIMATION: 2 HOME -> 0 HERO

if ($('body').attr('id') == 'page-home') {
  // desktop planes

  var planeSp = 4;

  var planeTL1a = gsap.timeline({ repeat: -1, repeatDelay: 8 });
  planeTL1a
    .to($('#home-hero').find('.dline-anim[data-num="1"].dsk').find('.plane'), {
      duration: planeSp,
      ease: 'none',
      motionPath: { path: '#hero-path1', start: 1, end: 0, autoRotate: true },
      display: 'block',
    })

    // fade on/off
    .to(
      $('#home-hero').find('.dline-anim[data-num="1"].dsk').find('.plane img'),
      { opacity: 0, duration: 0.1 },
      planeSp - 0.1
    )
    .pause();

  var planeTL1b = gsap.timeline({ repeat: -1, repeatDelay: 8 });
  planeTL1b
    .to($('#home-hero').find('.dline-anim[data-num="2"].dsk').find('.plane'), {
      duration: planeSp,
      ease: 'none',
      motionPath: { path: '#hero-path2', start: 1, end: 0, autoRotate: true },
      display: 'block',
    })

    // fade on/off
    .to(
      $('#home-hero').find('.dline-anim[data-num="2"].dsk').find('.plane img'),
      { opacity: 0, duration: 0.1 },
      planeSp - 0.1
    )
    .pause();

  // mobile planes

  var planeTLM1a = gsap.timeline({ repeat: -1, repeatDelay: 6 });
  planeTLM1a
    .to($('#home-hero').find('.dline-anim[data-num="1"].mob').find('.plane'), {
      duration: planeSp,
      ease: 'none',
      motionPath: { path: '#hero-path1m', start: 0, end: 1, autoRotate: true },
      display: 'block',
    })

    // fade on/off
    .to(
      $('#home-hero').find('.dline-anim[data-num="1"].mob').find('.plane img'),
      { opacity: 0, duration: 0.1 },
      planeSp - 0.1
    )
    .pause();

  var planeTLM1b = gsap.timeline({ repeat: -1, repeatDelay: 6 });
  planeTLM1b
    .to($('#home-hero').find('.dline-anim[data-num="2"].mob').find('.plane'), {
      duration: planeSp,
      ease: 'none',
      motionPath: { path: '#hero-path2m', start: 1, end: 0, autoRotate: true },
      display: 'block',
    })

    // fade on/off
    .to(
      $('#home-hero').find('.dline-anim[data-num="1"].mob').find('.plane img'),
      { opacity: 0, duration: 0.1 },
      planeSp - 0.1
    )
    .pause();

  // side bot underline

  uBot1 = $('#home-hero').find('.writer-wrap.side');

  var heroUline1 = gsap
    .timeline({ delay: 0.5, repeat: -1, repeatDelay: 5 })
    .set($('#home-hero').find('.writer-wrap .underline'), {
      width: '0%',
      opacity: 1,
      y: 0,
      rotation: 0,
    })

    // mover into start pos
    .to(uBot1.find('.side-arm'), { x: 5, duration: 1, ease: 'power3.inOut' }, 0)
    .to(
      uBot1.find('.hand-inner'),
      { y: -64, duration: 1, ease: 'power3.inOut' },
      0
    )
    .to(
      uBot1.find('.stretch-arm'),
      { scaleY: 0.64, duration: 1, ease: 'power3.inOut' },
      0
    )

    // slide over / write
    .to(
      uBot1.find('.side-arm'),
      { x: 61, duration: 0.5, ease: 'quad.inOut' },
      1
    )
    .to(
      uBot1.find('.hand-inner img'),
      { rotation: -18, duration: 0.5, ease: 'quad.inOut' },
      1
    )
    .to(
      $('#home-hero').find('.writer-wrap .underline'),
      { width: '100%', duration: 0.5, ease: 'quad.inOut' },
      1
    )

    // mover back down
    .to(
      uBot1.find('.side-arm'),
      { x: 0, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.hand-inner'),
      { y: -24, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.hand-inner img'),
      { rotation: -14, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.stretch-arm'),
      { scaleY: 0.24, duration: 1, ease: 'power3.inOut' },
      1.5
    )

    .to(
      $('#home-hero').find('.writer-wrap .underline'),
      { y: 100, rotation: 60, opacity: 0, duration: 0.5, ease: 'expo.in' },
      3.5
    )

    .pause();

  var heroUline2 = gsap
    .timeline({ delay: 0, repeat: -1, repeatDelay: 5 })
    .set($('#home-hero').find('.writer-wrap .underline'), {
      width: '0%',
      opacity: 1,
      y: 0,
      rotation: 0,
    })

    // mover into start pos
    .to(
      uBot1.find('.side-arm'),
      { x: -138, duration: 1, ease: 'power3.inOut' },
      0
    )
    .to(
      uBot1.find('.hand-inner'),
      { y: -64, duration: 1, ease: 'power3.inOut' },
      0
    )
    .to(
      uBot1.find('.stretch-arm'),
      { scaleY: 0.64, duration: 1, ease: 'power3.inOut' },
      0
    )

    // slide over / write
    .to(
      uBot1.find('.side-arm'),
      { x: -91, duration: 0.5, ease: 'quad.inOut' },
      1
    )
    .to(
      uBot1.find('.hand-inner img'),
      { rotation: -18, duration: 0.5, ease: 'quad.inOut' },
      1
    )
    .to(
      $('#home-hero').find('.writer-wrap .underline'),
      { width: '100%', duration: 0.5, ease: 'quad.inOut' },
      1
    )

    // mover back down
    .to(
      uBot1.find('.side-arm'),
      { x: 0, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.hand-inner'),
      { y: -24, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.hand-inner img'),
      { rotation: -14, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.stretch-arm'),
      { scaleY: 0.24, duration: 1, ease: 'power3.inOut' },
      1.5
    )

    .to(
      $('#home-hero').find('.writer-wrap .underline'),
      { y: 100, rotation: 60, opacity: 0, duration: 0.5, ease: 'expo.in' },
      3.5
    )

    .pause();

  var heroUline3 = gsap
    .timeline({ delay: 1 })
    .set($('#home-hero').find('.writer-wrap .underline'), { width: '0%' })
    .to($('#home-hero').find('.writer-wrap .underline'), {
      width: '100%',
      duration: 0.5,
      ease: 'quad.inOut',
    })
    .pause();

  // center bot doodler

  var dBot = $('#home-hero').find('.arm.doodler');
  var dSmiley = $('#home-hero').find('.smiley.drawn');
  var dHeart = $('#home-hero').find('.heart.drawn');
  var hDel = 3;

  var doodleWriter = gsap
    .timeline({ delay: 1, repeat: -1, repeatDelay: 1 })
    .set(dSmiley, { y: 0, rotation: 0, opacity: 1 })
    .set(dHeart, { y: 0, rotation: 0, opacity: 1 })

    // smiley //

    // left eye
    .to(dBot, { x: -53, y: -49, duration: 1, ease: 'power3.inOut' }, 0)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: 4, duration: 0.5, ease: 'power3.inOut' },
      0.5
    )
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: 2, duration: 0.2, ease: 'power3.out' },
      1
    )
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: 4, duration: 0.2, ease: 'power3.out' },
      1.2
    )
    .to(
      dSmiley.find('.eye[data-num="1"]'),
      {
        startAt: { scaleX: 0, scaleY: 0 },
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.3,
      },
      1
    )

    // right eye
    .to(dBot, { x: -45, y: -48, duration: 0.5, ease: 'power3.inOut' }, 1)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: 2, duration: 0.2, ease: 'power3.out' },
      1.5
    )
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: 4, duration: 0.2, ease: 'power3.out' },
      1.7
    )
    .to(
      dSmiley.find('.eye[data-num="2"]'),
      {
        startAt: { scaleX: 0, scaleY: 0 },
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.3,
      },
      1.5
    )

    // smile left
    .to(dBot, { x: -64, y: -48, duration: 0.5, ease: 'power3.inOut' }, 1.5)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: 2, duration: 0.3, ease: 'power3.in' },
      1.7
    )
    .to(dBot, { x: -55, y: -40, duration: 0.5, ease: 'power3.in' }, 2)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: -5, duration: 0.4, ease: 'power3.in' },
      2
    )
    .to(
      dSmiley.find('.mouth[data-num="1"]'),
      {
        startAt: { opacity: 1 },
        opacity: 1,
        height: 18,
        duration: 0.5,
        ease: 'power3.in',
      },
      1.95
    )

    // smile middle
    .to(dBot, { x: -40, y: -41, duration: 0.5, ease: 'none' }, 2.5)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: -8, duration: 0.35, ease: 'none' },
      2.5
    )
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: -6, duration: 0.15, ease: 'none' },
      2.85
    )
    .to(
      dSmiley.find('.mouth[data-num="2"]'),
      {
        startAt: { opacity: 1 },
        opacity: 1,
        width: 17,
        duration: 0.5,
        ease: 'none',
      },
      2.55
    )

    // smile right
    .to(dBot, { x: -35, y: -49, duration: 0.45, ease: 'quad.out' }, 3)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: 2, duration: 0.25, ease: 'quad.out' },
      3.05
    )
    .to(
      dSmiley.find('.mouth[data-num="3"] rect'),
      {
        startAt: { opacity: 1 },
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'quad.out',
      },
      3
    )

    // heart //

    // heart top left
    .to(
      dBot,
      { x: -11, y: -22, duration: 0.5, ease: 'power3.inOut' },
      hDel + 0.5
    )
    .to(dBot, { x: -20, y: -37, duration: 0.5, ease: 'power3.inOut' }, hDel + 1)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: 3, duration: 0.25, ease: 'quad.in' },
      hDel + 1
    )
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: -2, duration: 0.25, ease: 'quad.out' },
      hDel + 1.25
    )
    .to(
      dHeart.find('.heart-piece[data-num="1"] rect'),
      {
        startAt: { opacity: 1 },
        opacity: 1,
        x: -4,
        y: 2,
        rotation: -33,
        duration: 0.5,
        ease: 'power3.inOut',
      },
      hDel + 1
    )

    // heart bot left
    .to(dBot, { x: -14, y: -37, duration: 0.45, ease: 'none' }, hDel + 1.6)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: -25, duration: 0.4, ease: 'none' },
      hDel + 1.55
    )
    .to(
      dHeart.find('.heart-piece[data-num="2"]'),
      {
        startAt: { opacity: 1 },
        opacity: 1,
        height: 27,
        duration: 0.5,
        ease: 'none',
      },
      hDel + 1.5
    )

    // heart bot right
    .to(dBot, { x: 7, y: -34, duration: 0.5, ease: 'none' }, hDel + 2.05)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: -6, duration: 0.5, ease: 'none' },
      hDel + 2.1
    )
    .to(
      dHeart.find('.heart-piece[data-num="3"] rect'),
      {
        startAt: { opacity: 1 },
        opacity: 1,
        x: -7,
        y: 22,
        rotation: -44,
        duration: 0.55,
        ease: 'none',
      },
      hDel + 2.05
    )

    .to(
      dHeart.find('.heart-piece[data-num="3"] rect'),
      { x: -5, y: 17, rotation: -44, duration: 0.1, ease: 'quad.in' },
      hDel + 2.55
    )
    .to(dBot, { x: 7, y: -37, duration: 0.1, ease: 'quad.in' }, hDel + 2.55)

    // heart top right
    .to(dBot, { x: -9, y: -26, duration: 0.5, ease: 'power3.out' }, hDel + 2.65)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: -2, duration: 0.4, ease: 'power3.out' },
      hDel + 2.65
    )
    .to(
      dHeart.find('.heart-piece[data-num="4"] rect'),
      {
        startAt: { opacity: 1 },
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      },
      hDel + 2.65
    )

    // move back to start
    .to(dBot, { x: 0, y: 0, duration: 1, ease: 'power3.inOut' }, hDel + 2.95)
    .to(
      dBot.find('.hand-inner>img'),
      { rotation: 2, duration: 0.5, ease: 'power3.inOut' },
      hDel + 2.95
    )

    // drop marks
    .to(
      dSmiley,
      {
        y: 100,
        rotation: 60,
        opacity: 0,
        duration: 0.75,
        ease: 'back.inOut(1)',
      },
      hDel + 5
    )
    .to(
      dHeart,
      {
        y: 100,
        rotation: -90,
        opacity: 0,
        duration: 0.75,
        ease: 'back.inOut(1)',
      },
      hDel + 5.15
    )

    .pause();

  // controller
  var pl1;

  function initHomeHero() {
    // planes

    clearTimeout(pl1);
    if (winW > 650) {
      planeTL1a.seek(0).play();
      pl1 = setTimeout(function () {
        planeTL1b.seek(0).play();
      }, 6000);
    } else {
      planeTLM1a.seek(0).play();
      pl1 = setTimeout(function () {
        planeTLM1b.seek(0).play();
      }, 6000);
    }

    // side bot underline

    if (winW > 1024) {
      heroUline1.seek(0).play();
    } else if (winW <= 1024 && winW > 650) {
      heroUline2.seek(0).play();
    } else {
      heroUline3.seek(0).play();
    }

    // bot doodler
    doodleWriter.seek(0).play();
  }

  function resetHomeHero() {
    clearTimeout(pl1);
    planeTL1a.seek(0).pause();
    planeTL1b.seek(0).pause();
    planeTLM1a.seek(0).pause();
    planeTLM1b.seek(0).pause();

    heroUline1.seek(0).pause();
    heroUline2.seek(0).pause();
    heroUline3.seek(0).pause();

    doodleWriter.pause();
  }
}

//! - x ANIMATION: 2 HOME -> 1a ABOUT BOT LINE

// underline bot

var aboutUline = gsap.timeline({ delay: 0.5 });
var aboutUL = $('#home-hero').find('.writer');
aboutUline
  .set($('#home-about').find('.hw-font .underline'), { width: '0%' })

  // move arm over
  .to(
    aboutUL.find('.arm-inner'),
    { x: 20, duration: 1, ease: 'power3.inOut' },
    0
  )

  // drop hand
  .to(
    aboutUL.find('.hand-inner'),
    { y: -114, duration: 1, ease: 'power3.inOut' },
    1
  )
  .to(
    aboutUL.find('.hand-inner>img'),
    { rotation: -20, duration: 1, ease: 'power3.inOut' },
    1
  )
  .to(
    aboutUL.find('.stretch-arm'),
    { scaleY: 1.14, duration: 1, ease: 'power3.inOut' },
    1
  )

  // draw line
  .to(
    aboutUL.find('.arm-inner'),
    { x: 313, duration: 1, ease: 'power3.inOut' },
    2
  )
  .to(
    aboutUL.find('.hand-inner>img'),
    { rotation: -24, duration: 1, ease: 'power3.inOut' },
    2
  )
  .to(
    $('#home-about').find('.hw-font .underline'),
    { width: '100%', duration: 1, ease: 'power3.inOut' },
    2
  )

  // return to start
  .to(
    aboutUL.find('.arm-inner'),
    { x: 275, duration: 1, ease: 'power3.inOut' },
    3
  )
  .to(
    aboutUL.find('.hand-inner'),
    { y: -24, duration: 1, ease: 'power3.inOut' },
    3
  )
  .to(
    aboutUL.find('.hand-inner>img'),
    { rotation: -35, duration: 1, ease: 'power3.inOut' },
    3
  )
  .to(
    aboutUL.find('.stretch-arm'),
    { scaleY: 0.24, duration: 1, ease: 'power3.inOut' },
    3
  )

  .pause();

var aboutUlineMob = gsap.timeline({ delay: 1 });
aboutUlineMob
  .set($('#home-about').find('.hw-font .underline'), { width: '0%' })

  // move arm over
  .to(
    aboutUL.find('.arm-inner'),
    { x: 10, duration: 1, ease: 'power3.inOut' },
    0
  )

  // drop hand
  .to(
    aboutUL.find('.hand-inner'),
    { y: -137, duration: 1, ease: 'power3.inOut' },
    1
  )
  .to(
    aboutUL.find('.hand-inner>img'),
    { rotation: -20, duration: 1, ease: 'power3.inOut' },
    1
  )
  .to(
    aboutUL.find('.stretch-arm'),
    { scaleY: 1.37, duration: 1, ease: 'power3.inOut' },
    1
  )

  // draw line
  .to(
    aboutUL.find('.arm-inner'),
    { x: 275, duration: 1, ease: 'power3.inOut' },
    2
  )
  .to(
    aboutUL.find('.hand-inner>img'),
    { rotation: -64, duration: 1, ease: 'power3.inOut' },
    2
  )
  .to(
    $('#home-about').find('.hw-font .underline'),
    { width: '100%', duration: 1, ease: 'power3.inOut' },
    2
  )
  .to(
    aboutUL.find('.hand-inner'),
    { y: -119, duration: 1, ease: 'power3.inOut' },
    2
  )
  .to(
    aboutUL.find('.stretch-arm'),
    { scaleY: 1.19, duration: 1, ease: 'power3.inOut' },
    2
  )

  // return to start
  .to(
    aboutUL.find('.arm-inner'),
    { x: 275, duration: 1, ease: 'power3.inOut' },
    3
  )
  .to(
    aboutUL.find('.hand-inner'),
    { y: -24, duration: 1, ease: 'power3.inOut' },
    3
  )
  .to(
    aboutUL.find('.hand-inner>img'),
    { rotation: -35, duration: 1, ease: 'power3.inOut' },
    3
  )
  .to(
    aboutUL.find('.stretch-arm'),
    { scaleY: 0.24, duration: 1, ease: 'power3.inOut' },
    3
  )

  .pause();

// controller

function initHomeAboutUL() {
  if (winW > 650) {
    aboutUline.seek(0).play();
  } else {
    aboutUlineMob.seek(0).play();
  }
}
function resetHomeAboutUL() {
  aboutUline.seek(0).pause();
  aboutUlineMob.seek(0).pause();
}

//! - x ANIMATION: 2 HOME -> 1b ABOUT BUCKETS

// you type

let aboutText1;

if ($('body').attr('id') == 'page-home') {
  // construct typer
  aboutText1 = new TypeIt('#tf1', {
    strings: $('#tf1').parents('.typer-field').attr('data-text'),
    lifeLike: false,
    cursor: false,
    speed: 80,
    afterComplete: function () {
      aboutPhoneAnim.seek(0).play();
    },
  });
}

// setup timeline for full sequence
var aboutPhoneAnim = gsap.timeline();
aboutPhoneAnim
  .to(
    $('#home-about').find('.phone-button'),
    { opacity: 1, duration: 0.3 },
    0.75
  )
  .to(
    $('#home-about').find('.phone-button'),
    { opacity: 0, duration: 0.3 },
    1.05
  )

  // send dot along path
  .add(sendDot, 0.9)

  .to($('#tf1').parents('.typer-field'), { opacity: 0, duration: 0.5 }, 4)
  .add(loopTyper, 5)
  .pause();

function loopTyper() {
  gsap.set($('#tf1').parents('.typer-field'), { opacity: 1 });
  if ($('body').attr('id') == 'page-home') {
    aboutText1.reset().go();
  }
}

function sendDot() {
  gsap.to($('#home-about').find('.path-dot.bez'), {
    duration: 2.5,
    ease: 'quad.inOut',
    motionPath: { path: '#about-path0', start: 0.08, end: 0.85 },
    display: 'block',
    onComplete: function () {
      drawHeart();
    },
  });
}

var hBot = $('#home-about').find('.robot-hand[data-num="3"]');
var hHeart = $('#home-about').find('.heart.drawn');
var heartWriter = gsap
  .timeline()
  .set(hHeart, { y: 0, rotation: 0, opacity: 1 })

  // move out
  .to(
    hBot.find('.hand-inner'),
    { y: -25, duration: 1, ease: 'power3.inOut' },
    0
  )
  .to(
    hBot.find('.stretch-arm'),
    { scaleY: 0.6, duration: 1, ease: 'power3.inOut' },
    0
  )

  // flip hand up
  .to(
    hBot.find('.hand-inner img'),
    { rotation: 108, duration: 0.5, ease: 'power3.inOut' },
    1
  )
  .to(
    hBot.find('.hand-inner'),
    { y: -29, duration: 0.5, ease: 'power3.inOut' },
    1
  )

  // draw heart line left
  .to(
    hHeart.find('.heart-piece.left rect'),
    { y: 0, duration: 0.5, ease: 'power3.inOut' },
    1
  )

  // move hand back top heart
  .to(
    hBot.find('.hand-inner'),
    { y: -20, duration: 0.5, ease: 'power3.inOut' },
    1.5
  )
  .to(
    hBot.find('.stretch-arm'),
    { scaleY: 0.53, duration: 0.5, ease: 'power3.inOut' },
    1.5
  )
  .to(
    hBot.find('.hand-inner img'),
    { rotation: 119, duration: 0.25, ease: 'power3.inOut' },
    1.5
  )
  .to(
    hBot.find('.hand-inner img'),
    { rotation: 108, duration: 0.25, ease: 'power3.inOut' },
    1.75
  )

  // draw heart line top
  .to(
    hHeart.find('.heart-piece.top'),
    { width: 9, duration: 0.5, ease: 'power3.inOut' },
    1.5
  )

  // hand back down
  .to(
    hBot.find('.hand-inner img'),
    { rotation: 131, duration: 0.5, ease: 'power3.inOut' },
    2
  )
  .to(
    hBot.find('.hand-inner'),
    { y: -24, duration: 0.5, ease: 'power3.inOut' },
    2
  )

  // draw heart line right
  .to(
    hHeart.find('.heart-piece.right'),
    { height: 19, duration: 0.5, ease: 'power3.inOut' },
    2
  )

  // move back to start
  .to(
    hBot.find('.hand-inner'),
    { y: 12, duration: 1, ease: 'power3.inOut' },
    2.5
  )
  .to(
    hBot.find('.stretch-arm'),
    { scaleY: 0.12, duration: 1, ease: 'power3.inOut' },
    2.5
  )

  // heart fall / reset
  .to(
    hHeart,
    { y: 100, rotation: 60, opacity: 0, duration: 0.75, ease: 'back.inOut(1)' },
    5
  )

  .pause();

function drawHeart() {
  heartWriter.seek(0).play();
}

// plane path

var planeTL2 = gsap.timeline({ repeat: -1, repeatDelay: 1 });
var planeTL2Sp1 = 2.5;
var planeTL2Sp2 = 4;

// plane right
planeTL2
  .to($('#home-about').find('.dline-anim[data-num="1"]').find('.plane'), {
    duration: planeTL2Sp1,
    ease: 'none',
    motionPath: { path: '#about-path1', autoRotate: true },
    display: 'block',
  })
  //.to($('#home-about').find('.dline-anim[data-num="1"]').find('.plane img'), {opacity:1, duration:.3}, 0) // fade on/off
  .to(
    $('#home-about').find('.dline-anim[data-num="1"]').find('.plane img'),
    { opacity: 0, duration: 0.1 },
    planeTL2Sp1 - 0.1
  )

  // plane left
  .to(
    $('#home-about').find('.dline-anim[data-num="2"]').find('.plane'),
    {
      duration: planeTL2Sp2,
      ease: 'none',
      motionPath: {
        path: '#about-path2',
        start: 0.2,
        end: 1,
        autoRotate: true,
      },
      display: 'block',
    },
    planeTL2Sp1 + 0.1
  )
  //.to($('#home-about').find('.dline-anim[data-num="2"]').find('.plane img'), {opacity:1, duration:.3}, planeTL2Sp1-.2) // fade on/off
  .to(
    $('#home-about').find('.dline-anim[data-num="2"]').find('.plane img'),
    { opacity: 0, duration: 0.1 },
    planeTL2Sp2 + planeTL2Sp1
  )
  .pause();

// controller

function initHomeAbout() {
  aboutText1.reset().go();
  planeTL2.seek(0).play();
}
function resetHomeAbout() {
  aboutText1.freeze();
  aboutPhoneAnim.pause();
  planeTL2.seek(0).pause();
  gsap.killTweensOf($('#home-about').find('.path-dot.bez'));
  $('#home-about').find('.path-dot.bez').hide();
  heartWriter.seek(0).pause();
}

//! - x ANIMATION: 2 HOME -> 2 CARDS

if ($('body').attr('id') == 'page-home') {
  var cardLineSp = 20;
  var cardChange = cardLineSp * 0.33;

  // bot with pencil

  var cardPencils = {};
  var pencilStart = [0, 8, 16];

  for (i = 0; i < 3; i++) {
    cardPencils['cardLineTL' + i] = gsap.timeline({ repeat: -1 });
    cardPencils['cardLineTL' + i]
      .to($('#home-cards').find('.bot-pencil[data-num="' + (i + 1) + '"]'), {
        duration: cardLineSp,
        ease: 'none',
        motionPath: { path: '#cards-path1', start: 1, end: 0.4 },
        display: 'block',
      })
      .pause();
  }

  // bot with card

  var cardCards = {};
  var cardStart = [3, 12];

  for (i = 0; i < 2; i++) {
    cardCards['cardLineTL' + i] = gsap.timeline({ repeat: -1 });
    cardCards['cardLineTL' + i]
      .to($('#home-cards').find('.bot-card[data-num="' + (i + 1) + '"]'), {
        duration: cardLineSp,
        ease: 'none',
        motionPath: { path: '#cards-path1', start: 1, end: 0.4 },
        display: 'block',
      })
      .to(
        $('#home-cards')
          .find('.bot-card[data-num="' + (i + 1) + '"]')
          .find('.line[data-num="1"]'),
        { scaleX: 0, duration: 1.5, ease: 'quad.out' },
        cardChange
      )
      .pause();
  }

  // controller

  function initHomeCards() {
    for (i = 0; i < 3; i++) {
      cardPencils['cardLineTL' + i].seek(pencilStart[i]).play();
    }
    for (i = 0; i < 2; i++) {
      cardCards['cardLineTL' + i].seek(cardStart[i]).play();
    }
  }
  function resetHomeCards() {
    for (i = 0; i < 3; i++) {
      cardPencils['cardLineTL' + i].seek(4).pause();
    }
    for (i = 0; i < 2; i++) {
      cardCards['cardLineTL' + i].seek(0).pause();
    }
  }
}

//! - x ANIMATION: 2 HOME -> 3 CTA

if ($('body').attr('id') == 'page-home') {
  var ctaTrg = $('#footer-cta').find('.robot-wrap');
  var ctaRobotDraw = gsap.timeline({ repeat: -1, delay: 1, repeatDelay: 2 });

  ctaRobotDraw
    .to(ctaTrg.find('.arm-inner'), { x: -6, duration: 1, ease: 'power3.inOut' })
    .set($('#footer-cta').find('.excla'), {
      height: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
    })

    // raise hand
    .to(
      ctaTrg.find('.hand-inner'),
      { y: -52, duration: 0.5, ease: 'power3.inOut' },
      1
    )
    .to(
      ctaTrg.find('.stretch-arm'),
      { scaleY: 0.52, duration: 0.5, ease: 'power3.inOut' },
      1
    )

    // lower hand
    .to(
      ctaTrg.find('.hand-inner'),
      { y: -24, duration: 0.5, ease: 'power3.inOut' },
      1.5
    )
    .to(
      ctaTrg.find('.stretch-arm'),
      { scaleY: 0.24, duration: 0.5, ease: 'power3.inOut' },
      1.5
    )

    // draw mark
    .to(
      $('#footer-cta').find('.excla'),
      { height: 27, duration: 0.5, ease: 'power3.inOut' },
      1.5
    )

    // move arm back
    .to(
      ctaTrg.find('.arm-inner'),
      { x: -215, duration: 1, ease: 'power3.inOut' },
      2
    )

    // drop mark
    .to(
      $('#footer-cta').find('.excla'),
      {
        y: 100,
        rotation: 60,
        opacity: 0,
        duration: 0.75,
        ease: 'back.inOut(1)',
      },
      4
    )

    .pause();

  // controller

  function initHomeCTA() {
    ctaRobotDraw.seek(0).play();
  }
  function resetHomeCTA() {
    ctaRobotDraw.seek(0).pause();
  }
}

//! - x ANIMATION: 3 BUSINESS -> 0 HERO

if (
  $('body').attr('id') == 'page-business' ||
  $('body').attr('id') == 'page-business-new'
) {
  // plane / mailbox

  var planeSp = 10;
  var planeTL4 = gsap.timeline({ repeat: -1 });
  planeTL4
    .set($('#tier-hero').find('.dline-anim[data-num="1"]').find('.plane img'), {
      opacity: 1,
    })
    .to($('#tier-hero').find('.dline-anim[data-num="1"]').find('.plane'), {
      duration: planeSp,
      ease: 'none',
      motionPath: { path: '#hero-path1', start: 0, end: 1, autoRotate: true },
      display: 'block',
    })
    .to(
      $('#tier-hero').find('.dline-anim[data-num="1"]').find('.plane img'),
      { opacity: 0, duration: 0.2 },
      planeSp - 0.2
    )

    // animate flag
    .to(
      $('#tier-hero').find('.flag'),
      { rotation: 0, duration: 1.5, ease: 'elastic.inOut(2,2)' },
      planeSp - 1
    )
    .to(
      $('#tier-hero').find('.sent-txt'),
      {
        startAt: { y: 50, opacity: 0 },
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: Power3.easeOut,
      },
      planeSp
    )

    // remove flag
    .to(
      $('#tier-hero').find('.flag'),
      { rotation: 90, duration: 1, ease: Power3.easeInOut },
      planeSp + 1.25
    )
    .to(
      $('#tier-hero').find('.sent-txt'),
      { y: 50, opacity: 0, duration: 0.5, ease: Power3.easeInOut },
      planeSp + 1.6
    )
    .pause();

  // conveyer cards

  var totC = 4;
  var activeGr = 4;
  var cMoverSp = 14;
  var grRot = ['', -108, -95, -108, -95];
  var cRot = 11;

  var conveyerTLs = {};
  var cardMovers = {};
  var startOS = cMoverSp / totC;

  for (i = 0; i < totC; i++) {
    conveyerTLs['conveyerTL' + (i + 1)] = gsap
      .timeline()
      .set($('#tier-hero').find('.robot-arm'), { x: 200 })
      .set($('#tier-hero').find('.robot-arm').find('.claw[data-num="1"]'), {
        rotation: cRot,
      })
      .set($('#tier-hero').find('.robot-arm').find('.claw[data-num="2"]'), {
        rotation: -cRot,
      })
      .set($('#tier-hero').find('.card-grab[data-num="' + (i + 1) + '"]'), {
        display: 'none',
      })

      // move out
      .to(
        $('#tier-hero').find('.robot-arm'),
        { x: 0, rotation: -35, duration: 1, ease: 'power3.inOut' },
        0
      )
      .to(
        $('#tier-hero').find('.robot-arm').find('.arm[data-num="2"]'),
        { rotation: grRot[i + 1], duration: 1, ease: 'power3.inOut' },
        0
      )

      // close claw
      .to(
        $('#tier-hero').find('.robot-arm').find('.claw'),
        { rotation: 0, duration: 0.5, ease: 'power3.out' },
        1
      )

      // move back
      .set(
        $('#tier-hero').find('.card-grab[data-num="' + (i + 1) + '"]'),
        { display: 'block' },
        1
      )
      .to(
        $('#tier-hero').find('.robot-arm'),
        { x: 200, rotation: 0, duration: 1, ease: 'power3.inOut' },
        1
      )
      .to(
        $('#tier-hero').find('.robot-arm').find('.arm[data-num="2"]'),
        { rotation: -150, duration: 1, ease: 'power3.inOut' },
        1
      )
      .set(
        $('#tier-hero').find('.card-grab[data-num="' + (i + 1) + '"]'),
        { display: 'none' },
        2
      )
      .pause();
  }

  for (i = 0; i < totC; i++) {
    cardMovers['cardTL' + (i + 1)] = gsap
      .timeline({ repeat: -1, repeatDelay: 0.1 })
      .set($('#tier-hero').find('.card-move[data-num="' + (i + 1) + '"]'), {
        x: 20,
      })
      .to(
        $('#tier-hero').find('.card-move[data-num="' + (i + 1) + '"]'),
        { x: 680, duration: cMoverSp, ease: 'none' },
        0
      )
      .add(grabCard, cMoverSp - 1)
      .pause();
  }

  function grabCard(id) {
    conveyerTLs['conveyerTL' + activeGr].seek(0).play();

    activeGr--;
    if (activeGr == 0) {
      activeGr = totC;
    }
  }

  // controller

  function initBusinessHero() {
    if (winW > 768) {
      planeTL4.seek(0).play();
    }

    gsap.set($('#tier-hero').find('.robot-arm'), { x: 200 });
    activeGr = 4;

    for (i = 0; i < totC; i++) {
      startPos = startOS * i;
      cardMovers['cardTL' + (i + 1)].seek(startPos).play();
    }
  }
  function resetBusinessHero() {
    planeTL4.seek(0).pause();
    for (i = 0; i < totC; i++) {
      cardMovers['cardTL' + (i + 1)].seek(0).pause();
      conveyerTLs['conveyerTL' + (i + 1)].seek(0).pause();
    }
  }
}

//! - x ANIMATION: 4 INTEGRATIONS -> 0 SALESFORCE

if ($('body').hasClass('salesforce')) {
  // box 1

  var box1Trg = $('#int-salesforce1');
  var salesforceTL1 = gsap
    .timeline({ repeat: -1, repeatDelay: 1 })
    .set(box1Trg.find('.hand'), { x: -130, y: -272 })
    .set(box1Trg.find('.menu-box'), { opacity: 0 })

    // slide hand to button
    .to(
      box1Trg.find('.hand'),
      { x: 70, y: -272, duration: 1, ease: 'power3.inOut' },
      0
    )

    // open menu
    .to(
      box1Trg.find('.menu-box'),
      { opacity: 1, duration: 0.5, ease: 'none' },
      1
    )

    // slide hand to menu
    .to(
      box1Trg.find('.hand'),
      { x: 0, y: 0, duration: 1, ease: 'power3.inOut' },
      2
    )

    // click link
    .to(
      box1Trg.find('.txt-item'),
      { color: '#ff5037', duration: 0.5, ease: 'none' },
      2.75
    )

    // slide hand out / reset
    .to(
      box1Trg.find('.hand'),
      { x: -130, y: 0, duration: 0.75, ease: 'power3.inOut' },
      4.5
    )
    .to(
      box1Trg.find('.txt-item'),
      { color: '#020f14', duration: 0.3, ease: 'none' },
      4.7
    )
    .to(
      box1Trg.find('.menu-box'),
      { opacity: 0, duration: 0.5, ease: 'none' },
      4.7
    )

    .pause();

  // box 2

  var box2Trg = $('#int-salesforce2');
  var salesforceTL2 = gsap
    .timeline({ repeat: -1, repeatDelay: 1 })
    .set(box2Trg.find('.hand'), { x: -90 })
    .set(box2Trg.find('.msg-box'), { opacity: 0 })

    // slide hand to button
    .to(box2Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 0)

    // show message
    .to(
      box2Trg.find('.msg-box'),
      { opacity: 1, duration: 0.5, ease: 'none' },
      1
    )

    // slide hand out / reset
    .to(
      box2Trg.find('.hand'),
      { x: -90, y: 0, duration: 0.75, ease: 'power3.inOut' },
      3
    )
    .to(
      box2Trg.find('.msg-box'),
      { opacity: 0, duration: 0.5, ease: 'none' },
      3.2
    )

    .pause();

  // box 3

  var box3Trg = $('#int-salesforce3');
  var salesforceTL3 = gsap
    .timeline({ repeat: -1, repeatDelay: 1 })
    .set(box3Trg.find('.hand'), { x: 0, y: 0 })
    .set(box3Trg.find('.menu-box'), { opacity: 0 })

    // slide hand to button
    .to(
      box3Trg.find('.hand'),
      { x: 586, duration: 1.5, ease: 'power3.inOut' },
      0
    )

    // open menu
    .to(
      box3Trg.find('.menu-box'),
      { opacity: 1, duration: 0.5, ease: 'none' },
      1.5
    )

    // slide hand to menu
    .to(
      box3Trg.find('.hand'),
      { x: 468, y: 112, duration: 1, ease: 'power3.inOut' },
      2.5
    )

    // click link
    .to(
      box3Trg.find('.txt-item'),
      { color: '#ff5037', duration: 0.5, ease: 'none' },
      3.25
    )

    // slide hand out / reset
    .to(box3Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 5)
    .to(
      box3Trg.find('.txt-item'),
      { color: '#020f14', duration: 0.3, ease: 'none' },
      5.2
    )
    .to(
      box3Trg.find('.menu-box'),
      { opacity: 0, duration: 0.5, ease: 'none' },
      5.2
    )

    .pause();

  // box 4

  var box4Trg = $('#int-salesforce4');
  var salesforceTL4 = gsap
    .timeline({ repeat: -1, repeatDelay: 1 })
    .set(box4Trg.find('.hand'), { x: 0, y: 0 })

    // slide hand to button
    .to(box4Trg.find('.hand'), { x: 194, duration: 1, ease: 'power3.inOut' }, 0)
    .to(
      box4Trg.find('.txt-row[data-num="1"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ff5037', duration: 0.5, ease: 'none' },
      0.5
    )
    .to(
      box4Trg.find('.txt-row[data-num="1"]').find('p'),
      { color: '#ff5037', duration: 0.5, ease: 'none' },
      0.5
    )
    .to(
      box4Trg.find('.txt-row[data-num="1"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ECEFEF', duration: 0.5, ease: 'none' },
      1.5
    )
    .to(
      box4Trg.find('.txt-row[data-num="1"]').find('p'),
      { color: '#cccccc', duration: 0.5, ease: 'none' },
      1.5
    )

    // step hand down / highlight row
    .to(
      box4Trg.find('.hand'),
      { y: 60, duration: 0.5, ease: 'power3.inOut' },
      1.5
    )
    .to(
      box4Trg.find('.txt-row[data-num="2"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ff5037', duration: 0.5, ease: 'none' },
      1.75
    )
    .to(
      box4Trg.find('.txt-row[data-num="2"]').find('p'),
      { color: '#ff5037', duration: 0.5, ease: 'none' },
      1.75
    )
    .to(
      box4Trg.find('.txt-row[data-num="2"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ECEFEF', duration: 0.5, ease: 'none' },
      2.75
    )
    .to(
      box4Trg.find('.txt-row[data-num="2"]').find('p'),
      { color: '#cccccc', duration: 0.5, ease: 'none' },
      2.75
    )

    .to(
      box4Trg.find('.hand'),
      { y: 120, duration: 0.5, ease: 'power3.inOut' },
      2.75
    )
    .to(
      box4Trg.find('.txt-row[data-num="3"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ff5037', duration: 0.5, ease: 'none' },
      3
    )
    .to(
      box4Trg.find('.txt-row[data-num="3"]').find('p'),
      { color: '#ff5037', duration: 0.5, ease: 'none' },
      3
    )
    .to(
      box4Trg.find('.txt-row[data-num="3"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ECEFEF', duration: 0.5, ease: 'none' },
      4
    )
    .to(
      box4Trg.find('.txt-row[data-num="3"]').find('p'),
      { color: '#cccccc', duration: 0.5, ease: 'none' },
      4
    )

    .to(
      box4Trg.find('.hand'),
      { y: 180, duration: 0.5, ease: 'power3.inOut' },
      4
    )
    .to(
      box4Trg.find('.txt-row[data-num="4"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ff5037', duration: 0.5, ease: 'none' },
      4.25
    )
    .to(
      box4Trg.find('.txt-row[data-num="4"]').find('p'),
      { color: '#ff5037', duration: 0.5, ease: 'none' },
      4.25
    )
    .to(
      box4Trg.find('.txt-row[data-num="4"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ECEFEF', duration: 0.5, ease: 'none' },
      5.25
    )
    .to(
      box4Trg.find('.txt-row[data-num="4"]').find('p'),
      { color: '#cccccc', duration: 0.5, ease: 'none' },
      5.25
    )

    .to(
      box4Trg.find('.hand'),
      { y: 240, duration: 0.5, ease: 'power3.inOut' },
      5.25
    )
    .to(
      box4Trg.find('.txt-row[data-num="5"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ff5037', duration: 0.5, ease: 'none' },
      5.5
    )
    .to(
      box4Trg.find('.txt-row[data-num="5"]').find('p'),
      { color: '#ff5037', duration: 0.5, ease: 'none' },
      5.5
    )
    .to(
      box4Trg.find('.txt-row[data-num="5"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ECEFEF', duration: 0.5, ease: 'none' },
      6.5
    )
    .to(
      box4Trg.find('.txt-row[data-num="5"]').find('p'),
      { color: '#cccccc', duration: 0.5, ease: 'none' },
      6.5
    )

    .to(
      box4Trg.find('.hand'),
      { y: 300, duration: 0.5, ease: 'power3.inOut' },
      6.5
    )
    .to(
      box4Trg.find('.txt-row[data-num="6"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ff5037', duration: 0.5, ease: 'none' },
      6.75
    )
    .to(
      box4Trg.find('.txt-row[data-num="6"]').find('p'),
      { color: '#ff5037', duration: 0.5, ease: 'none' },
      6.75
    )
    .to(
      box4Trg.find('.txt-row[data-num="6"]').find('.oval-fill, .circ-fill'),
      { backgroundColor: '#ECEFEF', duration: 0.5, ease: 'none' },
      7.75
    )
    .to(
      box4Trg.find('.txt-row[data-num="6"]').find('p'),
      { color: '#cccccc', duration: 0.5, ease: 'none' },
      7.75
    )

    // return hand
    .to(
      box4Trg.find('.hand'),
      { x: 0, duration: 1, ease: 'power3.inOut' },
      7.75
    )

    .pause();
}

//! - x ANIMATION: 4 INTEGRATIONS -> 1 HUBSPOT

if ($('body').hasClass('hubspot')) {
  // box 1

  var box1Trg = $('#int-hubspot1');
  var hubspotTL1 = gsap
    .timeline({ repeat: -1, repeatDelay: 1.5 })
    .set(box1Trg.find('.hand'), { x: 0 })
    .set(box1Trg.find('.demo-btn'), {
      backgroundColor: '#f7f8f9',
      color: '#020F14',
    })

    // slide hand to button
    .to(
      box1Trg.find('.hand'),
      { x: 640, duration: 1.5, ease: 'power3.inOut' },
      0
    )

    // highlight button
    .to(
      box1Trg.find('.demo-btn[data-num="2"]'),
      { backgroundColor: '#ff5037', duration: 0.3, ease: 'none' },
      1
    )
    .to(
      box1Trg.find('.demo-btn[data-num="2"] p'),
      { color: '#ffffff', duration: 0.3, ease: 'none' },
      1
    )

    // slide hand out / reset
    .to(box1Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 3)
    .to(
      box1Trg.find('.demo-btn'),
      { backgroundColor: '#f7f8f9', duration: 0.3, ease: 'none' },
      3.3
    )
    .to(
      box1Trg.find('.demo-btn[data-num="2"] p'),
      { color: '#020F14', duration: 0.3, ease: 'none' },
      3.3
    )

    .pause();
}

//! - x ANIMATION: 4 INTEGRATIONS -> 2 ZAPIER

if ($('body').hasClass('zapier')) {
  // box 1

  var box1Trg = $('#int-zapier1');
  var zapierTL1 = gsap
    .timeline({ repeat: -1, repeatDelay: 1 })
    .set(box1Trg.find('.hand'), { x: 0, y: 0 })

    // slide hand to button
    .to(box1Trg.find('.hand'), { x: 175, duration: 1, ease: 'power3.inOut' }, 0)

    // click link
    .to(
      box1Trg.find('.txt-item[data-num="1"]'),
      { color: '#ff5037', duration: 0.3, ease: 'none' },
      0.5
    )

    // slide hand to menu
    .to(
      box1Trg.find('.hand'),
      { x: 365, y: 184, duration: 1, ease: 'power3.inOut' },
      1.8
    )
    .to(
      box1Trg.find('.txt-item[data-num="1"]'),
      { color: '#020f14', duration: 0.3, ease: 'none' },
      1.9
    )

    // click link
    .to(
      box1Trg.find('.txt-item[data-num="2"]'),
      { color: '#ff5037', duration: 0.3, ease: 'none' },
      2.3
    )

    // slide hand out / reset
    .to(box1Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 4.6)
    .to(
      box1Trg.find('.txt-item[data-num="2"]'),
      { color: '#020f14', duration: 0.3, ease: 'none' },
      4.7
    )

    .pause();

  // box 2

  var box2Trg = $('#int-zapier2');
  var zapierTL2 = gsap
    .timeline({ repeat: -1, repeatDelay: 1 })
    .set(box2Trg.find('.hand'), { x: 110 })
    .set(box2Trg.find('.msg-box'), { opacity: 0 })

    // slide hand to button
    .to(box2Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 0)

    // show message
    .to(
      box2Trg.find('.msg-box'),
      { opacity: 1, duration: 0.5, ease: 'none' },
      0.8
    )

    // slide hand out / reset
    .to(
      box2Trg.find('.hand'),
      { x: 110, duration: 0.75, ease: 'power3.inOut' },
      3
    )
    .to(
      box2Trg.find('.msg-box'),
      { opacity: 0, duration: 0.3, ease: 'none' },
      3.2
    )

    .pause();

  // box 3

  var box3Trg = $('#int-zapier3');
  var zapierTL3 = gsap
    .timeline({ repeat: -1, repeatDelay: 1.5 })
    .set(box3Trg.find('.hand'), { x: 350, y: 0 })

    // slide hand to button
    .to(box3Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 0)

    // highlight button
    .to(
      box3Trg.find('.demo-btn'),
      { backgroundColor: '#ff5037', duration: 0.3, ease: 'none' },
      0.7
    )
    .to(
      box3Trg.find('.demo-btn p'),
      { color: '#ffffff', duration: 0.3, ease: 'none' },
      0.7
    )

    // slide hand out / reset
    .to(box3Trg.find('.hand'), { x: 350, duration: 1, ease: 'power3.inOut' }, 3)
    .to(
      box3Trg.find('.demo-btn'),
      { backgroundColor: '#f7f8f9', duration: 0.3, ease: 'none' },
      3.2
    )
    .to(
      box3Trg.find('.demo-btn p'),
      { color: '#020F14', duration: 0.3, ease: 'none' },
      3.2
    )

    .pause();
}

//! - x ANIMATION: 4 INTEGRATIONS -> 3 AMAZON

if ($('body').hasClass('amazon')) {
  // box 1

  // construct typer
  amazonText1 = new TypeIt('#tf1', {
    strings: $('#tf1').parents('.typer-field').attr('data-text'),
    lifeLike: false,
    cursor: false,
    speed: 80,
    afterComplete: function () {
      amazonTL1.seek(0).play();
    },
  });

  function loopTyperA() {
    gsap.set($('#tf1').parents('.typer-field'), { opacity: 1 });
    amazonText1.reset().go();
  }

  var box1Trg = $('#int-amazon1');
  var amazonTL1 = gsap
    .timeline()
    .set(box1Trg.find('.hand'), { x: -230 })

    // show amazon app icon
    .to(box1Trg.find('.slot'), { opacity: 0, duration: 0.3, ease: 'none' }, 0)
    .to(box1Trg.find('.app'), { opacity: 1, duration: 0.5, ease: 'none' }, 0.3)

    // slide hand to button
    .to(box1Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 0.5)
    .to(
      box1Trg.find('.txt-item'),
      { color: '#ff5037', duration: 0.3, ease: 'none' },
      1.2
    )

    // slide hand out
    .to(
      box1Trg.find('.hand'),
      { x: -230, duration: 1, ease: 'power3.inOut' },
      3
    )
    .to(
      box1Trg.find('.txt-item'),
      { color: '#020f14', duration: 0.3, ease: 'none' },
      3.2
    )

    // start typer again / reset
    .to(box1Trg.find('.app'), { opacity: 0, duration: 0.3, ease: 'none' }, 3.5)
    .to(box1Trg.find('.slot'), { opacity: 1, duration: 0.5, ease: 'none' }, 3.8)
    .to(
      box1Trg.find('.typer-field'),
      { opacity: 0, duration: 0.3, ease: 'none' },
      3.5
    )
    .add(loopTyperA, 5)

    .pause();

  // box 2

  var box2Trg = $('#int-amazon2');
  var amazonTL2 = gsap
    .timeline({ repeat: -1, repeatDelay: 0.5 })
    .set(box2Trg.find('.hand'), { x: 590, y: 0 })
    .set(box2Trg.find('.msg-box'), { opacity: 0 })

    // show message
    .to(
      box2Trg.find('.msg-box'),
      { opacity: 1, duration: 0.5, ease: 'none' },
      0
    )

    // slide hand to button
    .to(box2Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 1.5)

    // click link
    .to(
      box2Trg.find('.txt-item'),
      { color: '#ff5037', duration: 0.3, ease: 'none' },
      2.2
    )
    .to(
      box2Trg.find('.msg-box'),
      { opacity: 0, duration: 0.5, ease: 'none' },
      2.2
    )

    // slide hand out / reset
    .to(box2Trg.find('.hand'), { x: 590, duration: 1, ease: 'power3.inOut' }, 4)
    .to(
      box2Trg.find('.txt-item'),
      { color: '#020F14', duration: 0.3, ease: 'none' },
      4.2
    )

    .pause();
}

//! - x ANIMATION: 4 INTEGRATIONS -> 4 INTEGRATELY

if ($('body').hasClass('integrately')) {
  // box 1

  var box1Trg = $('#int-integrately1');
  var integratelyTL1 = gsap
    .timeline({ repeat: -1, repeatDelay: 1.5 })
    .set(box1Trg.find('.hand'), { x: -500 })

    // slide hand to button
    .to(box1Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 0)

    // highlight button
    .to(
      box1Trg.find('.btn-dot'),
      { backgroundColor: '#ff5037', duration: 0.3, ease: 'none' },
      0.7
    )
    .to(
      box1Trg.find('.btn-txt'),
      { color: '#ff5037', duration: 0.3, ease: 'none' },
      0.7
    )

    // slide hand out / reset
    .to(
      box1Trg.find('.hand'),
      { x: -500, duration: 1, ease: 'power3.inOut' },
      3
    )
    .to(
      box1Trg.find('.btn-dot'),
      { backgroundColor: '#fff', duration: 0.3, ease: 'none' },
      3.2
    )
    .to(
      box1Trg.find('.btn-txt'),
      { color: '#020F14', duration: 0.3, ease: 'none' },
      3.2
    )

    .pause();

  // box 2

  var box2Trg = $('#int-integrately2');
  var integratelyTL2 = gsap
    .timeline({ repeat: -1, repeatDelay: 1.5 })
    .set(box2Trg.find('.hand'), { x: -500 })

    // slide hand to button
    .to(box2Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 0)

    // highlight button
    .to(
      box2Trg.find('.demo-btn'),
      { backgroundColor: '#ff5037', duration: 0.3, ease: 'none' },
      0.7
    )
    .to(
      box2Trg.find('.demo-btn p'),
      { color: '#ffffff', duration: 0.3, ease: 'none' },
      0.7
    )

    // slide hand out / reset
    .to(
      box2Trg.find('.hand'),
      { x: -500, duration: 1, ease: 'power3.inOut' },
      3
    )
    .to(
      box2Trg.find('.demo-btn'),
      { backgroundColor: '#fff', duration: 0.3, ease: 'none' },
      3.2
    )
    .to(
      box2Trg.find('.demo-btn p'),
      { color: '#020F14', duration: 0.3, ease: 'none' },
      3.2
    )

    .pause();
}

//! - x ANIMATION: 4 INTEGRATIONS -> 5 CDK

if ($('body').hasClass('cdk/fortellis-integration')) {
  // box 3

  var box3Trg = $('#int-cdk-fortellis3');
  var cdkTL3 = gsap
    .timeline({ repeat: -1, repeatDelay: 1 })
    .set(box3Trg.find('.hand'), { x: -590 })

    // slide hand to button
    .to(box3Trg.find('.hand'), { x: 0, duration: 1, ease: 'power3.inOut' }, 0)

    // slide hand out / reset
    .to(
      box3Trg.find('.hand'),
      { x: -590, y: 0, duration: 0.75, ease: 'power3.inOut' },
      2
    )

    .pause();
}

// handle all integrations demos

function initIntDemo(id) {
  // salesforce
  if (id == '#int-salesforce1') {
    salesforceTL1.seek(0).play();
  }
  if (id == '#int-salesforce2') {
    salesforceTL2.seek(0).play();
  }
  if (id == '#int-salesforce3') {
    salesforceTL3.seek(0).play();
  }
  if (id == '#int-salesforce4') {
    salesforceTL4.seek(0).play();
  }

  // hubspot
  if (id == '#int-hubspot1') {
    hubspotTL1.seek(0).play();
  }

  // zapier
  if (id == '#int-zapier1') {
    zapierTL1.seek(0).play();
  }
  if (id == '#int-zapier2') {
    zapierTL2.seek(0).play();
  }
  if (id == '#int-zapier3') {
    zapierTL3.seek(0).play();
  }

  // amazon
  if (id == '#int-amazon1') {
    loopTyper();
  }
  if (id == '#int-amazon2') {
    amazonTL2.seek(0).play();
  }

  // integrately
  if (id == '#int-integrately1') {
    integratelyTL1.seek(0).play();
  }
  if (id == '#int-integrately2') {
    integratelyTL2.seek(0).play();
  }

  // cdk
  if (id == '#int-cdk-fortellis3') {
    cdkTL3.seek(0).play();
  }
}
function resetIntDemo(id) {
  // salesforce
  if (id == '#int-salesforce1') {
    salesforceTL1.seek(0).pause();
  }
  if (id == '#int-salesforce2') {
    salesforceTL2.seek(0).pause();
  }
  if (id == '#int-salesforce3') {
    salesforceTL3.seek(0).pause();
  }
  if (id == '#int-salesforce4') {
    salesforceTL4.seek(0).pause();
  }

  // hubspot
  if (id == '#int-hubspot1') {
    hubspotTL1.seek(0).pause();
  }

  // zapier
  if (id == '#int-zapier1') {
    zapierTL1.seek(0).pause();
  }
  if (id == '#int-zapier2') {
    zapierTL2.seek(0).pause();
  }
  if (id == '#int-zapier3') {
    zapierTL3.seek(0).pause();
  }

  // amazon
  if (id == '#int-amazon1') {
    amazonTL1.seek(0).pause();
    amazonText1.freeze();
  }
  if (id == '#int-amazon2') {
    amazonTL2.seek(0).pause();
  }

  // integrately
  if (id == '#int-integrately1') {
    integratelyTL1.seek(0).pause();
  }
  if (id == '#int-integrately2') {
    integratelyTL2.seek(0).pause();
  }

  // cdk
  if (id == '#int-cdk-fortellis3') {
    cdkTL3.seek(0).pause();
  }
}

//! - x ANIMATION: 5 FEATURES -> 1 FEATURES

if ($('body').attr('id') == 'page-features') {
  // feature 1
  var feat1_dline = gsap.timeline({ repeat: -1, repeatDelay: 2 });
  feat1_dline
    .to($('#features').find('.feature-row[data-num="1"]').find('.dline-mask'), {
      duration: 2,
      startAt: { drawSVG: '0% 0%' },
      drawSVG: '0% 100%',
      ease: Power3.easeInOut,
    })
    .to(
      $('#features').find('.feature-row[data-num="1"]').find('.dline-mask'),
      { duration: 1, drawSVG: '100% 100%', ease: Quad.easeOut },
      1.2
    )
    .pause();

  function initFeature1() {
    feat1_dline.seek(0).play();
  }

  function resetFeature1() {
    // reset lines
    TweenMax.set(
      $('#features').find('.feature-row[data-num="1"]').find('.dline-mask'),
      { drawSVG: '0% 0%' }
    );

    feat1_dline.seek(0).pause();
  }
  resetFeature1();

  // feature 2
  var feat2_dline = gsap.timeline({ repeat: -1, repeatDelay: 2 });
  feat2_dline
    .to($('#features').find('.feature-row[data-num="2"]').find('.dline-mask'), {
      duration: 2,
      startAt: { drawSVG: '100% 100%' },
      drawSVG: '0% 100%',
      ease: Power3.easeInOut,
    })
    .to(
      $('#features').find('.feature-row[data-num="2"]').find('.dline-mask'),
      { duration: 1, drawSVG: '0% 0%', ease: Quad.easeOut },
      1.2
    )
    .pause();

  function initFeature2() {
    feat2_dline.seek(0).play();
  }

  function resetFeature2() {
    // reset lines
    TweenMax.set(
      $('#features').find('.feature-row[data-num="2"]').find('.dline-mask'),
      { drawSVG: '100% 100%' }
    );

    feat2_dline.seek(0).pause();
  }
  resetFeature2();

  // feature 3
  var feat3_dline = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  feat3_dline
    .to(
      $('#features')
        .find('.feature-row[data-num="3"]')
        .find('.d-line[data-num="1"]')
        .find('.dline-mask'),
      {
        duration: 1.75,
        startAt: { drawSVG: '-5% -5%' },
        drawSVG: '0% 100%',
        ease: Quad.easeInOut,
      },
      0
    )
    .to(
      $('#features')
        .find('.feature-row[data-num="3"]')
        .find('.d-line[data-num="1"]')
        .find('.dline-mask'),
      { duration: 1, drawSVG: '100% 100%', ease: Quad.easeOut },
      1.2
    )

    .to(
      $('#features')
        .find('.feature-row[data-num="3"]')
        .find('.d-line[data-num="2"]')
        .find('.dline-mask'),
      {
        duration: 2,
        startAt: { drawSVG: '0% 0%' },
        drawSVG: '100% 0%',
        ease: Power3.easeInOut,
      },
      0.8
    )
    .to(
      $('#features')
        .find('.feature-row[data-num="3"]')
        .find('.d-line[data-num="2"]')
        .find('.dline-mask'),
      { duration: 0.75, drawSVG: '100% 100%', ease: Quad.easeOut },
      2.2
    )

    .pause();

  function initFeature3() {
    feat3_dline.seek(0).play();
  }

  function resetFeature3() {
    // reset lines
    TweenMax.set(
      $('#features').find('.feature-row[data-num="3"]').find('.dline-mask'),
      { drawSVG: '100% 100%' }
    );

    feat3_dline.seek(0).pause();
  }
  resetFeature3();

  // feature 4
  var feat4_dline = gsap.timeline({ repeat: -1 });
  feat4_dline
    .to($('#features').find('.feature-row[data-num="4"]').find('.dline-mask'), {
      duration: 3,
      startAt: { drawSVG: '100% 100%' },
      drawSVG: '0% 100%',
      ease: Power3.easeInOut,
    })
    .to(
      $('#features').find('.feature-row[data-num="4"]').find('.dline-mask'),
      { duration: 2, drawSVG: '0% 0%', ease: Quad.easeOut },
      2
    )
    .pause();

  function initFeature4() {
    feat4_dline.seek(0).play();
  }

  function resetFeature4() {
    // reset lines
    TweenMax.set(
      $('#features').find('.feature-row[data-num="4"]').find('.dline-mask'),
      { drawSVG: '100% 100%' }
    );

    feat4_dline.seek(0).pause();
  }
  resetFeature4();

  // feature 5
  var feat5_dline = gsap.timeline({ repeat: -1, repeatDelay: 2 });
  feat5_dline
    .to($('#features').find('.feature-row[data-num="5"]').find('.dline-mask'), {
      duration: 2,
      startAt: { drawSVG: '100% 100%' },
      drawSVG: '0% 100%',
      ease: Power3.easeInOut,
    })
    .to(
      $('#features').find('.feature-row[data-num="5"]').find('.dline-mask'),
      { duration: 1, drawSVG: '0% -1%', ease: Quad.easeOut },
      1.3
    )
    .pause();

  function initFeature5() {
    feat5_dline.seek(0).play();
  }

  function resetFeature5() {
    // reset lines
    TweenMax.set(
      $('#features').find('.feature-row[data-num="5"]').find('.dline-mask'),
      { drawSVG: '100% 100%' }
    );

    feat5_dline.seek(0).pause();
  }
  resetFeature5();

  // feature 6
  var feat6_dline = gsap.timeline({ repeat: -1, repeatDelay: 2 });
  feat6_dline
    .to($('#features').find('.feature-row[data-num="6"]').find('.dline-mask'), {
      duration: 2,
      startAt: { drawSVG: '100% 100%' },
      drawSVG: '0% 100%',
      ease: Power3.easeInOut,
    })
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.dline-mask'),
      { duration: 1, drawSVG: '0% -1%', ease: Quad.easeOut },
      1.3
    )
    .pause();

  var feat6_arm = gsap
    .timeline({ repeat: -1, repeatDelay: 1 })

    // pos 1
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.arm-bot-mover'),
      { duration: 1, x: 170, ease: Power3.easeInOut },
      0
    )
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.arm-top-mover'),
      { duration: 1, y: -70, ease: Power3.easeInOut },
      1
    )
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.arm-bot-mover'),
      { duration: 1, x: 60, ease: Power3.easeInOut },
      2
    )

    // pos 2
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.arm-top-mover'),
      { duration: 1, y: -20, ease: Power3.easeInOut },
      4
    )
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.arm-bot-mover'),
      { duration: 1, x: 140, ease: Power3.easeInOut },
      5
    )
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.arm-top-mover'),
      { duration: 1, y: -50, ease: Power3.easeInOut },
      7
    )

    // return
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.arm-bot-mover'),
      { duration: 1, x: 100, ease: Power3.easeInOut },
      8
    )
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.arm-top-mover'),
      { duration: 1, y: -10, ease: Power3.easeInOut },
      10
    )
    .to(
      $('#features').find('.feature-row[data-num="6"]').find('.arm-bot-mover'),
      { duration: 1, x: 18, ease: Power3.easeInOut },
      11
    )

    .pause();

  function initFeature6() {
    feat6_dline.seek(0).play();
    feat6_arm.seek(3).play();
  }

  function resetFeature6() {
    // reset lines
    TweenMax.set(
      $('#features').find('.feature-row[data-num="6"]').find('.dline-mask'),
      { drawSVG: '100% 100%' }
    );

    feat6_dline.seek(0).pause();
    feat6_arm.seek(0).pause();
  }
  resetFeature6();
}

//! - x ANIMATION: 6 ABOUT -> 0 HELP

if ($('body').attr('id') == 'page-about') {
  // planes

  var planeSp = 6;

  var planeTL1a = gsap.timeline({ repeat: -1 });
  planeTL1a
    .to($('#about-help').find('.dline-anim[data-num="1"]').find('.plane'), {
      duration: planeSp,
      ease: 'none',
      motionPath: { path: '#help-path1', start: 1, end: 0, autoRotate: true },
      display: 'block',
    })

    // fade on/off
    //.to($('#about-help').find('.dline-anim[data-num="1"]').find('.plane img'), {opacity:1, duration:.5}, 0.2)
    .set(
      $('#about-help').find('.dline-anim[data-num="1"]').find('.plane img'),
      { opacity: 0 },
      planeSp
    )
    .pause();

  var planeTL1b = gsap.timeline({ repeat: -1 });
  planeTL1b
    .to($('#about-help').find('.dline-anim[data-num="2"]').find('.plane'), {
      duration: planeSp,
      ease: 'none',
      motionPath: { path: '#help-path2', start: 0, end: 1, autoRotate: true },
      display: 'block',
    })

    // fade on/off
    //.to($('#about-help').find('.dline-anim[data-num="2"]').find('.plane img'), {opacity:1, duration:.5}, 0.2)
    .to(
      $('#about-help').find('.dline-anim[data-num="2"]').find('.plane img'),
      { opacity: 0, duration: 0.1 },
      planeSp - 0.1
    )
    .pause();

  // conveyer mover

  var cardLineSp = 20;
  var cardChange = cardLineSp * 0.47;

  // bot with pencil

  var cardPencils = {};
  var pencilStart = [0, 9, 16];

  for (i = 0; i < 3; i++) {
    cardPencils['cardLineTL' + i] = gsap.timeline({ repeat: -1 });
    cardPencils['cardLineTL' + i]
      .to($('#about-help').find('.bot-pencil[data-num="' + (i + 1) + '"]'), {
        duration: cardLineSp,
        ease: 'none',
        motionPath: { path: '#cards-path1', start: 0, end: 1 },
        display: 'block',
      })
      .pause();
  }

  // bot with card

  var cardCards = {};
  var cardStart = [4, 14];

  for (i = 0; i < 2; i++) {
    cardCards['cardLineTL' + i] = gsap.timeline({ repeat: -1 });
    cardCards['cardLineTL' + i]
      .to($('#about-help').find('.bot-card[data-num="' + (i + 1) + '"]'), {
        duration: cardLineSp,
        ease: 'none',
        motionPath: { path: '#cards-path1', start: 0, end: 1 },
        display: 'block',
      })
      .to(
        $('#about-help')
          .find('.bot-card[data-num="' + (i + 1) + '"]')
          .find('.line[data-num="1"]'),
        { scaleX: 0, duration: 2, ease: 'quad.out' },
        cardChange
      )
      .pause();
  }

  // controller

  function initAboutHelp() {
    for (i = 0; i < 2; i++) {
      cardPencils['cardLineTL' + i].seek(pencilStart[i]).play();
    }
    for (i = 0; i < 2; i++) {
      cardCards['cardLineTL' + i].seek(cardStart[i]).play();
    }

    // planes
    planeTL1a.seek(2).play();
    planeTL1b.seek(2).play();
  }
  function resetAboutHelp() {
    for (i = 0; i < 2; i++) {
      cardPencils['cardLineTL' + i].seek(0).pause();
    }
    for (i = 0; i < 2; i++) {
      cardCards['cardLineTL' + i].seek(0).pause();
    }

    // planes
    planeTL1a.seek(0).pause();
    planeTL1b.seek(0).pause();
  }
}

//! - x ANIMATION: 7 TUTORIALS -> 0 HERO

if (
  $('body').attr('id') == 'page-resources' &&
  $('body').hasClass('tutorials')
) {
  var tut_dline1 = gsap.timeline({ repeat: -1, repeatDelay: 2 });
  tut_dline1
    .to(
      $('.tutorials-hero').find('.d-line[data-num="1"]').find('.dline-mask'),
      {
        duration: 2,
        startAt: { drawSVG: '100% 100%' },
        drawSVG: '100% 0%',
        ease: Power1.easeInOut,
      }
    )
    .to(
      $('.tutorials-hero').find('.d-line[data-num="1"]').find('.dline-mask'),
      { duration: 1, drawSVG: '0% -1%', ease: Quad.easeOut },
      1.4
    )
    .pause();

  var tut_dline2 = gsap.timeline({ repeat: -1, repeatDelay: 2 });
  tut_dline2
    .to(
      $('.tutorials-hero').find('.d-line[data-num="2"]').find('.dline-mask'),
      {
        duration: 2,
        startAt: { drawSVG: '100% 100%' },
        drawSVG: '100% 0%',
        ease: Power1.easeInOut,
      }
    )
    .to(
      $('.tutorials-hero').find('.d-line[data-num="2"]').find('.dline-mask'),
      { duration: 1, drawSVG: '0% -2%', ease: Quad.easeOut },
      1.4
    )
    .pause();

  function initTutorialsHero() {
    tut_dline1.seek(0).play();
    tut_dline2.seek(1.5).play();
  }

  function resetTutorialsHero() {
    // reset lines
    TweenMax.set($('.tutorials-hero').find('.dline-mask'), {
      drawSVG: '0% 0%',
    });

    tut_dline1.seek(0).pause();
    tut_dline2.seek(0).pause();
  }
  resetTutorialsHero();
}

//! - x ANIMATION: 8 PRICING -> 0 HERO

if ($('body').attr('id') == 'page-pricing') {
  // arm dropping card
  var heroArm = $('#tier-hero').find('.arm-dropper');

  var pricingHeroTL = gsap
    .timeline({ repeat: -1, repeatDelay: 0 })
    //.set($('#tier-hero').find('.writer-wrap .underline'), {width:'0%', opacity:1, y:0, rotation:0})

    // move over to drop card
    //.to(heroArm, {x:20, duration: 1, ease:"power3.inOut"}, 0)
    .to(
      heroArm.find('.arm-inner, .bolt'),
      { x: 1, duration: 1, ease: 'power3.inOut' },
      0
    )
    .to(
      heroArm.find('.bolt img'),
      { rotation: -180, duration: 1, ease: 'power3.inOut' },
      0
    )

    // open claw
    .to(
      heroArm.find('.robot-arm').find('.claw[data-num="1"]'),
      { rotation: 15, duration: 0.5, ease: 'power3.inOut' },
      1
    )
    .to(
      heroArm.find('.robot-arm').find('.claw[data-num="2"]'),
      { rotation: -15, duration: 0.5, ease: 'power3.inOut' },
      1
    )

    // drop card
    .to(
      heroArm.find('.card-drop'),
      { y: 125, duration: 1, ease: 'power3.inOut' },
      1
    )
    .to(
      heroArm.find('.card-drop img'),
      { rotation: 70, duration: 1, ease: 'power3.inOut' },
      1
    )

    .to(
      $('#tier-hero').find('.bag-card[data-num="1"]'),
      { y: -3, rotation: -3, duration: 0.2, ease: 'power3.out' },
      1.6
    )
    .to(
      $('#tier-hero').find('.bag-card[data-num="2"]'),
      { y: -2, rotation: 3, duration: 0.2, ease: 'power3.out' },
      1.6
    )
    .to(
      $('#tier-hero').find('.bag-card[data-num="3"]'),
      { y: -4, rotation: 4, duration: 0.2, ease: 'power3.out' },
      1.6
    )
    .to(
      $('#tier-hero').find('.bag-card[data-num="1"]'),
      { y: 0, rotation: 0, duration: 0.5, ease: 'power3.out' },
      1.75
    )
    .to(
      $('#tier-hero').find('.bag-card[data-num="2"]'),
      { y: 0, rotation: 0, duration: 0.5, ease: 'power3.out' },
      1.75
    )
    .to(
      $('#tier-hero').find('.bag-card[data-num="3"]'),
      { y: 0, rotation: 0, duration: 0.5, ease: 'power3.out' },
      1.75
    )

    // close claw
    .set(heroArm.find('.card-drop'), { y: 300 }, 2)
    .to(
      heroArm.find('.robot-arm').find('.claw[data-num="1"]'),
      { rotation: -5, duration: 0.75, ease: 'power3.inOut' },
      1.8
    )
    .to(
      heroArm.find('.robot-arm').find('.claw[data-num="2"]'),
      { rotation: 5, duration: 0.75, ease: 'power3.inOut' },
      1.8
    )

    // move back to start
    //.to(heroArm, {x:20, duration: 1.5, ease:"power3.inOut"}, 2)
    .to(
      heroArm.find('.arm-inner'),
      { x: 98, duration: 1.5, ease: 'power3.inOut' },
      2.2
    )
    .to(
      heroArm.find('.bolt'),
      { x: 83, duration: 1.5, ease: 'power3.inOut' },
      2.2
    )
    .to(
      heroArm.find('.bolt img'),
      { rotation: 0, duration: 1.5, ease: 'power3.inOut' },
      2.2
    )

    .pause();

  // side bot underline

  var uBot1 = $('#tier-hero').find('.writer-wrap.side');

  var heroUline1 = gsap
    .timeline({ delay: 1, repeat: -1, repeatDelay: 3 })
    .set($('#tier-hero').find('.writer-wrap .underline'), {
      width: '0%',
      opacity: 1,
      y: 0,
      rotation: 0,
    })

    // mover into start pos
    .to(uBot1.find('.side-arm'), { x: 2, duration: 1, ease: 'power3.inOut' }, 0)
    .to(
      uBot1.find('.hand-inner'),
      { y: -65, duration: 1, ease: 'power3.inOut' },
      0
    )
    .to(
      uBot1.find('.stretch-arm'),
      { scaleY: 0.65, duration: 1, ease: 'power3.inOut' },
      0
    )

    // slide over / write
    .to(
      uBot1.find('.side-arm'),
      { x: 50, duration: 0.5, ease: 'quad.inOut' },
      1
    )
    .to(
      uBot1.find('.hand-inner img'),
      { rotation: -18, duration: 0.5, ease: 'quad.inOut' },
      1
    )
    .to(
      $('#tier-hero').find('.writer-wrap .underline'),
      { width: '100%', duration: 0.5, ease: 'quad.inOut' },
      1
    )

    // mover back down
    .to(
      uBot1.find('.side-arm'),
      { x: 0, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.hand-inner'),
      { y: -24, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.hand-inner img'),
      { rotation: -14, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.stretch-arm'),
      { scaleY: 0.24, duration: 1, ease: 'power3.inOut' },
      1.5
    )

    .to(
      $('#tier-hero').find('.writer-wrap .underline'),
      { y: 100, rotation: 60, opacity: 0, duration: 0.5, ease: 'expo.in' },
      3.5
    )

    .pause();

  var heroUline2 = gsap
    .timeline({ repeat: -1, repeatDelay: 5 })
    .set($('#tier-hero').find('.writer-wrap .underline'), {
      width: '0%',
      opacity: 1,
      y: 0,
      rotation: 0,
    })

    // mover into start pos
    .to(uBot1.find('.side-arm'), { x: 0, duration: 1, ease: 'power3.inOut' }, 0)
    .to(
      uBot1.find('.hand-inner'),
      { y: -56, duration: 1, ease: 'power3.inOut' },
      0
    )
    .to(
      uBot1.find('.stretch-arm'),
      { scaleY: 0.56, duration: 1, ease: 'power3.inOut' },
      0
    )

    // slide over / write
    .to(
      uBot1.find('.side-arm'),
      { x: 45, duration: 0.5, ease: 'quad.inOut' },
      1
    )
    .to(
      uBot1.find('.hand-inner img'),
      { rotation: -18, duration: 0.5, ease: 'quad.inOut' },
      1
    )
    .to(
      $('#tier-hero').find('.writer-wrap .underline'),
      { width: '100%', duration: 0.5, ease: 'quad.inOut' },
      1
    )

    // mover back down
    .to(
      uBot1.find('.side-arm'),
      { x: 0, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.hand-inner'),
      { y: -24, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.hand-inner img'),
      { rotation: -14, duration: 1, ease: 'power3.inOut' },
      1.5
    )
    .to(
      uBot1.find('.stretch-arm'),
      { scaleY: 0.24, duration: 1, ease: 'power3.inOut' },
      1.5
    )

    .to(
      $('#tier-hero').find('.writer-wrap .underline'),
      { y: 100, rotation: 60, opacity: 0, duration: 0.5, ease: 'expo.in' },
      3.5
    )

    .pause();

  var heroUline3 = gsap
    .timeline()
    .set($('#tier-hero').find('.writer-wrap .underline'), { width: '0%' }, 1)
    .to(
      $('#tier-hero').find('.writer-wrap .underline'),
      { width: '100%', duration: 0.5, ease: 'quad.inOut' },
      1
    )
    .pause();
}

// controller

var hU1 = false;
var hU2 = false;
var hU3 = false;

function initPricingHero() {
  // card dropper

  pricingHeroTL.seek(0).play();

  // side bot underline

  hU1 = false;
  hU2 = false;
  hU3 = false;

  if (winW > 1024) {
    heroUline1.seek(0).play();
    hU1 = true;
  } else if (winW <= 1024 && winW > 650) {
    heroUline1.seek(0).pause();
    heroUline2.seek(0).play();

    hU1 = false;
    hU2 = true;
  } else {
    heroUline3.seek(0).play();
    hU3 = true;
  }
}
function resetPricingHero() {
  heroUline1.seek(0).pause();
  heroUline2.seek(0).pause();
  heroUline3.seek(0).pause();

  pricingHeroTL.seek(0).pause();
}

function updatePricingWriter() {
  if ($('#tier-hero').hasClass('on')) {
    if (winW > 1024) {
      if (!hU1) {
        heroUline2.seek(0).pause();
        heroUline1.seek(0).play();

        hU2 = false;
        hU1 = true;
      }
    } else if (winW <= 1024 && winW > 650) {
      if (!hU2) {
        heroUline1.seek(0).pause();
        heroUline2.seek(0).play();

        hU1 = false;
        hU2 = true;
      }
    } else {
      if (!hU3) {
        heroUline2.seek(0).pause();
        heroUline3.seek(0).play();

        hU2 = false;
        hU3 = true;
      }
    }
  }
}

//! - x ANIMATION: 8 PRICING -> 1 BULK

if ($('body').attr('id') == 'page-pricing') {
  // robot draw circle

  var bulkArm = $('#pricing-bulk').find('.robot-arm');
  var drawDur = 0.5;
  var del = 0.5;

  delBR1 = drawDur * 3 + del;
  delBR2 = drawDur * 3 + drawDur / 2 + del;
  delBL1 = delBR2 + drawDur / 2;
  delBL2 = delBL1 + drawDur / 2;
  delRT = drawDur * 6 + del;
  delEnd = drawDur * 6 + 2 + del;

  var pricingBulkTL = gsap
    .timeline({ repeat: -1, repeatDelay: 1 })
    .set($('#pricing-bulk').find('.circle-piece'), { opacity: 1 })

    // 1. move into start pos

    .to(
      bulkArm.find('.arm-inner[data-num="1"]'),
      { y: 32, duration: 1, ease: 'power3.inOut' },
      0
    )
    .to(
      bulkArm.find('.arm-inner[data-num="2"]'),
      { x: -239, duration: 1, ease: 'power3.inOut' },
      0
    )
    .to(
      bulkArm.find('.hand-inner img'),
      { rotation: -30, duration: 1, ease: 'power3.inOut' },
      0
    )

    // 2. TL: slide over / draw top part 1 of oval

    .to(
      bulkArm.find('.arm-inner[data-num="1"]'),
      { y: 8, duration: drawDur, ease: 'none' },
      drawDur + del
    )
    .to(
      bulkArm.find('.arm-inner[data-num="2"]'),
      { x: -192, duration: drawDur, ease: 'none' },
      drawDur + del
    )
    .to(
      bulkArm.find('.hand-inner img'),
      { rotation: 0, duration: drawDur, ease: 'none' },
      drawDur + del
    )
    .to(
      $('#pricing-bulk').find('.circle-piece[data-num="1"] rect'),
      { x: -122, duration: drawDur, ease: 'none' },
      drawDur + del
    )

    // 3. TR: slide over / draw top part 2 of oval

    .to(
      bulkArm.find('.arm-inner[data-num="1"]'),
      { y: -2, duration: drawDur, ease: 'none' },
      drawDur * 2 + del
    )
    .to(
      bulkArm.find('.arm-inner[data-num="2"]'),
      { x: -100, duration: drawDur, ease: 'none' },
      drawDur * 2 + del
    )
    .to(
      bulkArm.find('.hand-inner img'),
      { rotation: 75, duration: drawDur, ease: 'quad.in' },
      drawDur * 2 + del
    )
    .to(
      $('#pricing-bulk').find('.circle-piece[data-num="1"] rect'),
      { x: 0, duration: drawDur, ease: 'none' },
      drawDur * 2 + del
    )

    // 4. BR1: slide over / draw bottom part 1 of oval

    .to(
      bulkArm.find('.arm-inner[data-num="1"]'),
      { y: -4, duration: drawDur / 2, ease: 'none' },
      delBR1
    )
    .to(
      bulkArm.find('.arm-inner[data-num="2"]'),
      { x: -115, duration: drawDur / 2, ease: 'quad.in' },
      delBR1
    )
    .to(
      bulkArm.find('.hand-inner img'),
      { rotation: 110, duration: drawDur / 2, ease: 'none' },
      delBR1
    )
    .to(
      $('#pricing-bulk').find('.circle-piece[data-num="2"] rect'),
      { x: 167, duration: drawDur / 2, ease: 'none' },
      delBR1
    )

    // 5. BR2: slide over / draw bottom part 2 of oval

    .to(
      bulkArm.find('.arm-inner[data-num="1"]'),
      { y: 12, duration: drawDur / 2, ease: 'none' },
      delBR2
    )
    .to(
      bulkArm.find('.arm-inner[data-num="2"]'),
      { x: -165, duration: drawDur / 2, ease: 'none' },
      delBR2
    )
    .to(
      bulkArm.find('.hand-inner img'),
      { rotation: 98, duration: drawDur / 2, ease: 'none' },
      delBR2
    )
    .to(
      $('#pricing-bulk').find('.circle-piece[data-num="2"] rect'),
      { x: 120, duration: drawDur / 2, ease: 'none' },
      delBR2
    )

    // 6. BL1: slide over / draw bottom part 3 of oval

    .to(
      bulkArm.find('.arm-inner[data-num="1"]'),
      { y: 33, duration: drawDur / 2, ease: 'none' },
      delBL1
    )
    .to(
      bulkArm.find('.arm-inner[data-num="2"]'),
      { x: -243, duration: drawDur / 2, ease: 'none' },
      delBL1
    )
    .to(
      bulkArm.find('.hand-inner img'),
      { rotation: 65, duration: drawDur / 2, ease: 'none' },
      delBL1
    )
    .to(
      $('#pricing-bulk').find('.circle-piece[data-num="2"] rect'),
      { x: 50, duration: drawDur / 2, ease: 'none' },
      delBL1
    )

    // 7. BL2: slide over / draw bottom part 4 of oval

    .to(
      bulkArm.find('.arm-inner[data-num="1"]'),
      { y: 36, duration: drawDur, ease: 'power3.out' },
      delBL2
    )
    .to(
      bulkArm.find('.arm-inner[data-num="2"]'),
      { x: -277, duration: drawDur, ease: 'power3.out' },
      delBL2
    )
    .to(
      bulkArm.find('.hand-inner img'),
      { rotation: 50, duration: drawDur, ease: 'power3.out' },
      delBL2
    )
    .to(
      $('#pricing-bulk').find('.circle-piece[data-num="2"] rect'),
      { x: 0, duration: drawDur, ease: 'quad.out' },
      delBL2
    )

    // 8. return to start position

    .to(
      bulkArm.find('.arm-inner[data-num="1"]'),
      { y: 46, duration: drawDur * 2, ease: 'power3.inOut' },
      delRT
    )
    .to(
      bulkArm.find('.arm-inner[data-num="2"]'),
      { x: -287, duration: drawDur * 2, ease: 'power3.inOut' },
      delRT
    )
    .to(
      bulkArm.find('.hand-inner img'),
      { rotation: 15, duration: drawDur * 2, ease: 'power3.inOut' },
      delRT
    )

    // 9. fade out circle
    .to(
      $('#pricing-bulk').find('.circle-piece'),
      { opacity: 0, duration: drawDur * 2, ease: 'power3.in' },
      delEnd
    )

    .pause();
}

// controller

function initPricingBulk() {
  pricingBulkTL.seek(0).play();
}
function resetPricingBulk() {
  pricingBulkTL.seek(0).pause();
}

//! - x ANIMATION: 8 PRICING -> 2 POPUP

$('#pricing-popup')
  .find('.popup-close, .close-btn')
  .click(function () {
    dropY = 380;
    if (winW <= 900) {
      dropY = 202;
    }
    TweenMax.to($('#pricing-popup').find('.popup-box'), 0.75, {
      y: dropY,
      ease: Power3.easeInOut,
      onComplete: function () {
        $('#pricing-popup').find('.popup-box').hide();
      },
    });

    clearTimeout(ppCloser);
    return false;
  });

var ppCloser;
var ppTimer = 10000;
function showPricingPopup() {
  setTimeout(function () {
    TweenMax.to($('#pricing-popup').find('.popup-box'), 1.5, {
      delay: 0.2,
      y: 0,
      rotation: 0,
      ease: Elastic.easeOut.config(1.1, 2),
    });
    ppCloser = setTimeout(function () {
      dropY = 380;
      if (winW <= 900) {
        dropY = 202;
      }
      TweenMax.to($('#pricing-popup').find('.popup-box'), 0.75, {
        y: dropY,
        ease: Power3.easeInOut,
        onComplete: function () {
          $('#pricing-popup').find('.popup-box').hide();
        },
      });
    }, 30000);
  }, ppTimer);
}

//! - x ANIMATION: 9 GIFT CARDS -> 0 HERO

if (
  $('body').attr('id') == 'page-gift-cards' ||
  $('body').attr('id') == 'page-gift-card-detail'
) {
  gsap.set($('#tier-hero').find('.arm'), { y: 70 });
  gsap.set($('#tier-hero').find('.arm img'), { rotation: 70 });
  gsap.set($('#tier-hero').find('.confetti'), { y: 150 });
  gsap.set($('#tier-hero').find('.card'), { y: 100 });
  gsap.set($('#tier-hero').find('.c-dot[data-num="1"]'), { y: 50 });
  gsap.set($('#tier-hero').find('.c-dot[data-num="2"]'), { y: 150 });
}

var giftcardsHero = gsap
  .timeline()
  .set($('#tier-hero').find('.arm'), { y: 70 })
  .set($('#tier-hero').find('.arm img'), { rotation: 70 })
  .set($('#tier-hero').find('.confetti'), { y: 150 })
  .set($('#tier-hero').find('.card'), { y: 100 })
  .set($('#tier-hero').find('.c-dot[data-num="1"]'), { y: 50 })
  .set($('#tier-hero').find('.c-dot[data-num="2"]'), { y: 150 })

  .to(
    $('#tier-hero').find('.confetti[data-num="1"]'),
    { duration: 0.5, y: 0, ease: Quad.easeOut },
    0
  )
  .to(
    $('#tier-hero').find('.confetti[data-num="2"]'),
    { duration: 0.5, y: 0, ease: Quad.easeOut },
    0.2
  )

  .to(
    $('#tier-hero').find('.c-dot[data-num="1"]'),
    { duration: 0.5, y: 0, ease: Quad.easeOut },
    0.4
  )
  .to(
    $('#tier-hero').find('.c-dot[data-num="2"]'),
    { duration: 0.5, y: 0, ease: Quad.easeOut },
    0.6
  )

  .to(
    $('#tier-hero').find('.card[data-num="1"]'),
    { duration: 0.5, y: 0, ease: Quad.easeOut },
    0.8
  )
  .to(
    $('#tier-hero').find('.card[data-num="2"]'),
    { duration: 0.5, y: 0, ease: Quad.easeOut },
    1
  )

  .to(
    $('#tier-hero').find('.arm'),
    { duration: 1.5, y: 0, ease: 'elastic.out(1.5,2)' },
    0.65
  )
  .to(
    $('#tier-hero').find('.arm img'),
    { duration: 1.5, rotation: 0, ease: 'elastic.out(1.5,2)' },
    0.65
  )

  .pause();

// controller

var gcPlayed = false;

function initGiftCards() {
  if (!gcPlayed) {
    giftcardsHero.seek(0).play();
    gcPlayed = true;
  }
}
function resetGiftCards() {
  giftcardsHero.seek(0).pause();
}

//! - x ANIMATION: x10 GET STARTED

if ($('#cta-getstarted').length > 0) {
  // mailbox

  trg = $('#cta-getstarted').find('.mailbox-wrap');
  var planeSp = 5;
  var planeTL_mb = gsap
    .timeline({ repeat: -1 })

    .set(trg.find('.dline-anim').find('.plane img'), { opacity: 0 })
    .set(trg.find('.dline-mask'), { drawSVG: '0% 0%', opacity: 0 })

    // fly plane
    .to(
      trg.find('.dline-anim').find('.plane'),
      {
        duration: planeSp,
        ease: 'none',
        motionPath: { path: '#hero-path1', start: 0, end: 1, autoRotate: true },
        display: 'block',
      },
      0
    )
    .to(
      trg.find('.dline-anim').find('.plane img'),
      { opacity: 1, duration: 0.5 },
      0
    )
    .to(
      trg.find('.dline-anim').find('.plane img'),
      { opacity: 0, duration: 0.2 },
      planeSp - 0.2
    )

    // draw line
    .to(trg.find('.dline-mask'), { opacity: 1, duration: 0.5 }, 0)
    .to(
      trg.find('.dline-mask'),
      {
        duration: planeSp,
        startAt: { drawSVG: '0% 0%' },
        drawSVG: '0% 100%',
        ease: 'none',
      },
      0.05
    )
    .to(
      trg.find('.dline-mask'),
      { duration: 1.5, drawSVG: '100% 100%', ease: Quad.easeIn },
      planeSp - 1
    )

    // animate flag
    .to(
      trg.find('.flag'),
      { rotation: 0, duration: 1.5, ease: 'elastic.inOut(2,2)' },
      planeSp - 1
    )
    .to(
      trg.find('.sent-txt'),
      {
        startAt: { y: 50, opacity: 0 },
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: Power3.easeOut,
      },
      planeSp
    )

    // remove flag
    .to(
      trg.find('.flag'),
      { rotation: 90, duration: 1, ease: Power3.easeInOut },
      planeSp + 1.25
    )
    .to(
      trg.find('.sent-txt'),
      { y: 50, opacity: 0, duration: 0.5, ease: Power3.easeInOut },
      planeSp + 1.6
    )
    .pause();

  // card dropper

  var gs_dropSp = 8;
  var gs_dropGo = gs_dropSp - 1.5;
  var cardDrops = {};
  var totCardDrops = 6;

  for (i = 0; i < totCardDrops; i++) {
    trg = $('#cta-getstarted')
      .find('.claw-droppers')
      .find('.card-claw[data-num="' + (i + 1) + '"]');
    gsap.set(trg, { x: 630 });
    gsap.set(trg.find('.claw-fader'), { opacity: 0, y: -60 });

    cardDrops['card' + i] = gsap
      .timeline({ repeat: -1 })

      // move over to drop card
      .to(trg, { x: -100, duration: gs_dropSp, ease: 'none' }, 0)
      .to(
        trg.find('.claw-fader'),
        { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
        0
      )
      //.to(trg.find('.claw-fader'), {opacity:1, duration: .3, ease:"none"}, 0)

      // open claw
      .to(
        trg.find('.claw[data-num="1"]'),
        { rotation: 15, duration: 0.5, ease: 'power3.inOut' },
        gs_dropGo
      )
      .to(
        trg.find('.claw[data-num="2"]'),
        { rotation: -15, duration: 0.5, ease: 'power3.inOut' },
        gs_dropGo
      )

      // close claw
      .to(
        trg.find('.claw[data-num="1"]'),
        { rotation: -15, duration: 0.75, ease: 'power3.inOut' },
        gs_dropGo + 0.4
      )
      .to(
        trg.find('.claw[data-num="2"]'),
        { rotation: 15, duration: 0.75, ease: 'power3.inOut' },
        gs_dropGo + 0.4
      )

      // drop card
      .to(
        trg.find('.card-drop'),
        { y: 80, duration: 0.75, ease: 'power3.inOut' },
        gs_dropGo
      )
      .to(
        trg.find('.card-drop img'),
        { rotation: 70, duration: 0.75, ease: 'power3.inOut' },
        gs_dropGo
      )

      // fade out card
      .set(trg.find('.card-drop'), { display: 'none' }, gs_dropSp - 0.5)
      .to(
        trg.find('.claw-fader'),
        { opacity: 1, y: -65, duration: 0.5, ease: 'quad.out' },
        gs_dropSp - 0.5
      )
      //.to(trg.find('.claw-fader'), {opacity:0, duration: .3, ease:"none"}, gs_dropSp-.3)

      // cards in box move
      .to(
        $('#cta-getstarted').find('.box-card[data-num="1"]'),
        { y: -3, rotation: -3, duration: 0.2, ease: 'power3.out' },
        gs_dropGo + 0.45
      )
      .to(
        $('#cta-getstarted').find('.box-card[data-num="2"]'),
        { y: -2, rotation: 3, duration: 0.2, ease: 'power3.out' },
        gs_dropGo + 0.45
      )
      .to(
        $('#cta-getstarted').find('.box-card[data-num="3"]'),
        { y: -4, rotation: 4, duration: 0.2, ease: 'power3.out' },
        gs_dropGo + 0.45
      )
      .to(
        $('#cta-getstarted').find('.box-card[data-num="1"]'),
        { y: 0, rotation: 0, duration: 0.5, ease: 'power3.out' },
        gs_dropGo + 0.6
      )
      .to(
        $('#cta-getstarted').find('.box-card[data-num="2"]'),
        { y: 0, rotation: 0, duration: 0.5, ease: 'power3.out' },
        gs_dropGo + 0.6
      )
      .to(
        $('#cta-getstarted').find('.box-card[data-num="3"]'),
        { y: 0, rotation: 0, duration: 0.5, ease: 'power3.out' },
        gs_dropGo + 0.6
      )

      .pause();
  }

  // build master timeline

  function cardDropSeq() {
    for (i = 0; i < totCardDrops; i++) {
      startPer = ((100 / totCardDrops) * i) / 100;
      startPos = cardDrops['card' + i].duration() * startPer;
      cardDrops['card' + i].seek(startPos).play();
    }
  }

  // conveyer stamp

  //$('#cta-getstarted').find('.module, .pen').css({'visibility':'hidden'})

  // init

  var cardMakes = {};
  var totCardMakes = 8;
  var cardMakeXsp = 10;
  var stampSt = (7 / cardMakeXsp) * 10 - 0.18;
  var grabSt = cardMakeXsp - 0.5;
  var grabSp = 2.5;
  var gNum = 0;

  // create duplicates

  for (i = 0; i < totCardMakes - 1; i++) {
    $('.conveyer-cards')
      .find('.c-card[data-num="1"]')
      .clone()
      .appendTo($('.conveyer-cards'))
      .attr('data-num', i + 2);
  }
  for (i = 0; i < totCardMakes - 1; i++) {
    $('.grab-claws')
      .find('.grab-claw[data-num="1"]')
      .clone()
      .appendTo($('.grab-claws'))
      .attr('data-num', i + 2);
  }

  // build timelines

  for (i = 0; i < totCardMakes; i++) {
    trg = $('#cta-getstarted')
      .find('.conveyer-cards')
      .find('.c-card[data-num="' + (i + 1) + '"]');
    trgGrab = $('#cta-getstarted').find(
      '.grab-claw[data-num="' + (i + 1) + '"]'
    );

    gsap.set(trg, { x: -26 });
    gsap.set(trg.find('.ymov'), { y: 32 });
    gsap.set(trg.find('.rmov'), { rotation: -33 });
    gsap.set(trg.find('.open-c'), { opacity: 0 });

    // begin timeline
    cardMakes['card' + i] = gsap
      .timeline({ repeat: -1 })

      // fade on start
      .to(trg.find('.open-c'), { opacity: 1, duration: 0.2, ease: 'none' }, 0)

      // move x along belt
      .to(
        trg,
        {
          x: 700,
          duration: cardMakeXsp,
          ease: 'none',
          onUpdate: function () {
            /* console.log(this.progress()); */
          },
        },
        0
      )

      // move y up along incline, drop
      .to(trg.find('.ymov'), { duration: 0.5, y: 8, ease: 'none' }, 0)
      .to(trg.find('.ymov'), { duration: 1.5, y: -30, ease: 'quad.out' }, 0.5)
      .to(
        trg.find('.ymov'),
        { duration: 0.7, y: 5, startAt: { y: -28 }, ease: 'quad.in' },
        1.6
      )
      .to(trg.find('.ymov'), { duration: 0.3, y: 0, ease: 'quad.out' }, 2.3)

      // rotate and level out
      .to(trg.find('.rmov'), { duration: 1, rotation: 0, ease: 'none' }, 0.8)

      // draw lines
      .to(
        trg.find('.drawer[data-num="1"]'),
        { duration: 0.5, scaleY: 1, ease: 'quad.out' },
        3.25
      )
      .to(
        trg.find('.drawer[data-num="2"]'),
        { duration: 0.5, scaleY: 1, ease: 'quad.out' },
        3.75
      )
      .to(
        trg.find('.drawer[data-num="3"]'),
        { duration: 0.5, scaleY: 1, ease: 'quad.out' },
        4.25
      )

      // drop stamper
      .to(
        $('#cta-getstarted').find('.arm-stamp'),
        { duration: 0.5, y: 60, ease: 'power3.in' },
        stampSt
      )
      .to(
        $('#cta-getstarted').find('.stamper').find('.arm-line'),
        { duration: 0.5, scaleY: 1.05, ease: 'power3.in' },
        stampSt
      )

      .to(
        $('#cta-getstarted').find('.arm-stamp'),
        { duration: 0.5, y: -10, ease: 'power3.inOut' },
        stampSt + 0.5
      )
      .to(
        $('#cta-getstarted').find('.stamper').find('.arm-line'),
        { duration: 0.5, scaleY: 0.37, ease: 'power3.inOut' },
        stampSt + 0.5
      )

      // swap card
      .set(trg.find('.open-c'), { display: 'none' }, stampSt + 0.5)
      .set(trg.find('.stamp-c'), { display: 'block' }, stampSt + 0.5)

      // slide down grabber
      .to(
        trgGrab.find('.claw-drop'),
        { duration: 0.5, y: 0, ease: 'quad.out' },
        grabSt
      )

      // swap card with grabbed card
      .set(trg.find('.stamp-c, .draw-lines'), { display: 'none' }, grabSt + 0.5)
      .set(trgGrab.find('.card-grab'), { display: 'block' }, grabSt + 0.5)

      // swing grabber back to straight
      .to(
        trgGrab.find('.claw-rot'),
        { duration: 1.5, rotation: 0, ease: 'elastic.out(2,1)' },
        grabSt + 0.5
      )
      .to(
        trgGrab.find('.card-grab'),
        { duration: 0.3, rotation: -60, y: 9, ease: 'power3.out' },
        grabSt + 0.5
      )

      // move grabber along belt
      .to(trgGrab, { duration: grabSp, x: 220, ease: 'none' }, grabSt + 0.5)

      // slide up grabber
      .to(
        trgGrab.find('.claw-drop'),
        { duration: 0.85, y: -170, ease: 'back.inOut(1)' },
        grabSt + grabSp
      )
      .to(
        trgGrab.find('.claw-rot'),
        { duration: 0.85, rotation: -44, ease: 'power3.inOut' },
        grabSt + grabSp - 0.2
      )

      .pause();
  }

  function cardMakeSeq() {
    for (i = 0; i < totCardMakes; i++) {
      startPer = ((100 / totCardMakes) * i) / 100;
      startPos = cardMakes['card' + i].duration() * startPer;
      cardMakes['card' + i].seek(startPos).play();
    }
  }
} // close if($('#cta-getstarted').length>0){

function initGetStarted() {
  // mailbox animation
  planeTL_mb.seek(0).play();

  // card drop
  cardDropSeq();

  // conveyer stamp
  cardMakeSeq();
}
function resetGetStarted() {
  // mailbox animation
  planeTL_mb.seek(0).pause();

  // card drop
  for (i = 0; i < totCardDrops; i++) {
    cardDrops['card' + i].seek(0).pause();
  }

  // conveyer stamp
  for (i = 0; i < totCardMakes; i++) {
    cardMakes['card' + i].seek(0).pause();
  }
}

if ($('body').attr('id') == 'page-team') {
  var planeSp = 8;

  var planeTL1a = gsap.timeline({ repeat: -1 });
  planeTL1a.to(
    $('#tier-hero').find('.dline-anim[data-num="1"]').find('.plane img'),
    { duration: 0.3, opacity: 1, ease: 'none' },
    0
  );
  planeTL1a.to(
    $('#tier-hero').find('.dline-anim[data-num="1"]').find('.plane img'),
    { duration: 0.3, opacity: 0, ease: 'none' },
    planeSp - 0.3
  );

  planeTL1a
    .to(
      $('#tier-hero').find('.dline-anim[data-num="1"]').find('.plane'),
      {
        duration: planeSp,
        ease: 'none',
        motionPath: { path: '#help-path1', start: 1, end: 0, autoRotate: true },
        display: 'block',
      },
      0
    )

    // fade on/off
    //.set($('#tier-hero').find('.dline-anim[data-num="1"]').find('.plane img'), {opacity:0}, planeSp)
    .pause();

  function initTeamHero() {
    planeTL1a.seek(2).play();
  }
  function resetTeamHero() {
    planeTL1a.seek(0).pause();
  }
}

function sendDL(formObj) {
  //console.log('Test send DL');

  // const cf7Titles = {
  // 	688: 'Basic Form',
  // 	699: 'Request Free Writing Samples',
  // 	617: 'Request Our White Paper',
  // 	1163: 'Subscribe Popup',
  // 	3580: 'Subscribe Popup_copy',
  // 	687: 'Subscribe to our newsletter',
  // 	1723: 'Webinar Capture'
  // };

  const formId = $(formObj).find('input[name="_wpcf7"]').val();
  //console.log(formId);
  // const formName = cf7Titles[formId] ?? 'Not found form name';
  const formName = formId;

  let sendDL1 = dataLayer.push({
    event: 'event-to-ga',
    eventName: 'success_form',
    eventParam: formName,
  });

  //console.log('DL1: ', sendDL1);
}

//! - x ANIMATION: x11 SEO LANDING

if ($('#features-landing').length > 0) {
  var feat3_dline = gsap.timeline({ repeat: -1, repeatDelay: 1 });
  feat3_dline
    .to(
      $('#features-landing').find('.d-line[data-num="1"]').find('.dline-mask'),
      {
        duration: 1.75,
        startAt: { drawSVG: '-5% -5%' },
        drawSVG: '0% 100%',
        ease: Quad.easeInOut,
      },
      0
    )
    .to(
      $('#features-landing').find('.d-line[data-num="1"]').find('.dline-mask'),
      { duration: 1, drawSVG: '100% 100%', ease: Quad.easeOut },
      1.2
    )

    .to(
      $('#features-landing').find('.d-line[data-num="2"]').find('.dline-mask'),
      {
        duration: 2,
        startAt: { drawSVG: '0% 0%' },
        drawSVG: '100% 0%',
        ease: Power3.easeInOut,
      },
      0.8
    )
    .to(
      $('#features-landing').find('.d-line[data-num="2"]').find('.dline-mask'),
      { duration: 0.75, drawSVG: '100% 100%', ease: Quad.easeOut },
      2.2
    )

    .pause();

  function initFeatureL3() {
    feat3_dline.seek(0).play();
  }

  function resetFeatureL3() {
    // reset lines
    TweenMax.set($('#features-landing').find('.dline-mask'), {
      drawSVG: '100% 100%',
    });

    feat3_dline.seek(0).pause();
  }
  resetFeatureL3();
}

// testimonials for mobile

function quotesHeightResize() {
  maxH = 0;
  $('.customer-slider.mobile').find('.customer-slide').css('display', 'block');
  $('.customer-slider.mobile').find('.card-border').css('height', 'auto');

  $('.customer-slider.mobile')
    .find('.customer-slide')
    .each(function () {
      tmpH = $(this).find('.testimonial-block').outerHeight();
      if (tmpH > maxH) {
        maxH = tmpH;
      }
    });

  $('.customer-slider.mobile').height(maxH);
  $('.customer-slider.mobile').find('.customer-slide').css('display', 'none');
  $('.customer-slider.mobile')
    .find('.customer-slide[data-num="' + cusCur + '"')
    .css('display', 'block');
  $('.customer-slider.mobile').find('.card-border').css('height', '');
}

// blog load more

var loadBatch = 2;

$('.load-more-blog').click(function () {
  loadMoreBlog();
  return false;
});

function loadMoreBlog() {
  // desktop
  $('#home-blog')
    .find('.blog-grid.dsk')
    .find('.blog-col')
    .each(function () {
      showNum = 0;
      $(this)
        .find('.blog-thumb')
        .each(function (i) {
          if (showNum < loadBatch) {
            if ($(this).hasClass('hidden')) {
              $(this).removeClass('hidden');
              showNum++;
            }
          }
        });
    });

  // mobile
  $('#home-blog')
    .find('.blog-grid.mob')
    .find('.blog-thumb')
    .each(function (i) {
      showNumM = 0;
      if (showNumM < loadBatch * 2) {
        if ($(this).hasClass('hidden')) {
          $(this).removeClass('hidden');
          showNumM++;
        }
      }
    });

  // if no more posts, remove load more button
  rem = $('#home-blog').find('.blog-col').find('.blog-thumb.hidden').length;
  if (rem == 0) {
    $('#home-blog').find('.blog-cta').hide();
  }
}
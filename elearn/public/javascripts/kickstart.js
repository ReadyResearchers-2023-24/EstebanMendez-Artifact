/*
	99Lime.com HTML KickStart by Joshua Gatcke
	kickstart.js
*/

jQuery(document).ready(function ($) {
  /* ---------------------------------
		MENU Dropdowns
	----------------------------------- */
  $('ul.menu').each(function () {
    // add the menu toggle
    $(this).prepend('<li class="menu-toggle"><a href="#"><span class="icon" data-icon="Y"></span> Menu</a></li>')

    // find menu items with children.
    $(this).find('li').has('ul').addClass('has-menu')
      .find('a:first').append('<span class="arrow">&nbsp;</span>')
  })

  $('ul.menu li').hover(function () {
    $(this).find('ul:first').stop(true, true).fadeIn('fast')
    $(this).addClass('hover')
  },
  function () {
    $(this).find('ul').stop(true, true).fadeOut('slow')
    $(this).removeClass('hover')
  })

  /* ---------------------------------
		Slideshow
	----------------------------------- */
  $('.slideshow').bxSlider({
    mode: 'horizontal', // 'horizontal', 'vertical', 'fade'
    video: true,
    useCSS: true,
    pager: true,
    speed: 500, // transition time
    startSlide: 0,
    infiniteLoop: true,
    captions: true,
    adaptiveHeight: false,
    touchEnabled: true,
    pause: 4000,
    autoControls: false,
    controls: false,
    autoStart: true,
    auto: true
  })

  /* ---------------------------------
		Fancybox Lightbox
	----------------------------------- */
  $('.gallery').each(function (i) {
    $(this).find('a').attr('rel', 'gallery' + i)
      .fancybox({
        overlayOpacity: 0.2,
        overlayColor: '#000'
      })
  })

  // lightbox links
  $('a.lightbox').fancybox({
    overlayOpacity: 0.2,
    overlayColor: '#000'
  })

  /* ---------------------------------
		Tabs
	----------------------------------- */
  // tab setup
  $('.tab-content').addClass('clearfix').not(':first').hide()
  $('ul.tabs').each(function () {
    let current = $(this).find('li.current')
    if (current.length < 1) { $(this).find('li:first').addClass('current') }
    current = $(this).find('li.current a').attr('href')
    $(current).show()
  })

  // tab click
  $(document).on('click', 'ul.tabs a[href^="#"]', function (e) {
    e.preventDefault()
    const tabs = $(this).parents('ul.tabs').find('li')
    const tab_next = $(this).attr('href')
    const tab_current = tabs.filter('.current').find('a').attr('href')
    $(tab_current).hide()
    tabs.removeClass('current')
    $(this).parent().addClass('current')
    $(tab_next).show()
    history.pushState(null, null, window.location.search + $(this).attr('href'))
    return false
  })

 	// tab hashtag identification and auto-focus
    	const wantedTag = window.location.hash
    	if (wantedTag != '') {
    // This code can and does fail, hard, killing the entire app.
    // Esp. when used with the jQuery.Address project.
    try {
      const allTabs = $('ul.tabs a[href^=' + wantedTag + ']').parents('ul.tabs').find('li')
      const defaultTab = allTabs.filter('.current').find('a').attr('href')
      $(defaultTab).hide()
      allTabs.removeClass('current')
      $('ul.tabs a[href^=' + wantedTag + ']').parent().addClass('current')
      $('#' + wantedTag.replace('#', '')).show()
    } catch (e) {
      // I have no idea what to do here, so I'm leaving this for the maintainer.
    }
    	}

  /* ---------------------------------
		Image Caption
	----------------------------------- */
  $('img.caption').each(function () {
    $(this).wrap('<div class="caption">')
    $(this).parents('div.caption')
      .attr('class', 'img-wrap ' + $(this).attr('class'))
    if ($(this).attr('title')) {
      $(this).parents('div.caption')
        .append('<span>' + $(this).attr('title') + '</span>')
    }
  })

  /* ---------------------------------
		Notice
	----------------------------------- */
  $(document).on('click', '.notice a[class^="icon-remove"]', function (e) {
    e.preventDefault()
    const notice = $(this).parents('.notice')
    $(this).hide()
    notice.fadeOut('slow')
  })

  /* ---------------------------------
		ToolTip - TipTip
	----------------------------------- */

  // Standard tooltip
  $('.tooltip, .tooltip-top, .tooltip-bottom, .tooltip-right, .tooltip-left').each(function () {
    // variables
    let tpos = 'top'
    let content = $(this).attr('title')
    const dataContent = $(this).attr('data-content')
    let keepAlive = false
    let action = 'hover'
    let delay = $(this).attr('data-delay')
    if (delay === undefined) { delay = 1000 }

    // position
    if ($(this).hasClass('tooltip-top')) 	{ tpos = 'top' 	}
    if ($(this).hasClass('tooltip-right')) 	{ tpos = 'right' 	}
    if ($(this).hasClass('tooltip-bottom')) 	{ tpos = 'bottom' 	}
    if ($(this).hasClass('tooltip-left')) 	{ tpos = 'left' 	}

    // content
    $('.tooltip-content').removeClass('hide').wrap('<div class="hide"></div>')
    if (dataContent) { content = $(dataContent).html(); keepAlive = true }

    // action (hover or click) defaults to hover
    if ($(this).attr('data-action') == 'click') { action = 'click' }

    // tooltip
    $(this).attr('title', '')
      .tipTip({ defaultPosition: tpos, content, keepAlive, activation: action, delay })
  })

  /* ---------------------------------
		Table Sort
	----------------------------------- */
  // init
  const aAsc = []
  $('table.sortable').each(function () {
    $(this).find('thead th').each(function (index) { $(this).attr('rel', index) })
    $(this).find('th,td').each(function () { $(this).attr('value', $(this).text()) })
  })

  // table click
  $(document).on('click', 'table.sortable thead th', function (e) {
    // update arrow icon
    $(this).parents('table.sortable').find('span.arrow').remove()
    $(this).append('<span class="arrow"></span>')

    // sort direction
    const nr = $(this).attr('rel')
    aAsc[nr] = aAsc[nr] == 'asc' ? 'desc' : 'asc'
    if (aAsc[nr] == 'desc') { $(this).find('span.arrow').addClass('up') }

    // sort rows
    const rows = $(this).parents('table.sortable').find('tbody tr')
    rows.tsort('td:eq(' + nr + ')', { order: aAsc[nr], attr: 'value' })

    // fix row classes
    rows.removeClass('alt first last')
    const table = $(this).parents('table.sortable')
    table.find('tr:even').addClass('alt')
    table.find('tr:first').addClass('first')
    table.find('tr:last').addClass('last')
  })

  /* ---------------------------------
		CSS Helpers
	----------------------------------- */
  $('input[type=checkbox]').addClass('checkbox')
  $('input[type=radio]').addClass('radio')
  $('input[type=file]').addClass('file')
  $('[disabled=disabled]').addClass('disabled')
  $('table').find('tr:even').addClass('alt')
  $('table').find('tr:first-child').addClass('first')
  $('table').find('tr:last-child').addClass('last')
  $('ul').find('li:first-child').addClass('first')
  $('ul').find('li:last-child').addClass('last')
  $('hr').before('<div class="clear">&nbsp;</div>')
  $('[class*="col_"]').addClass('column')
  $('pre').addClass('prettyprint'); prettyPrint()
});

/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 *
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 *
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function (a) {
  let p; let u; let v; let e; let B; let m; let C; let j; let y; let z; let s = 0; let d = {}; let q = []; let r = 0; let c = {}; let k = []; let E = null; let n = new Image(); const H = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i; const S = /[^\.]\.(swf)\s*$/i; let I; let J = 1; let x = 0; let w = ''; let t; let g; let l = !1; const A = a.extend(a('<div/>')[0], { prop: 0 }); const K = navigator.userAgent.match(/msie [6]/i) && !window.XMLHttpRequest; const L = function () { u.hide(); n.onerror = n.onload = null; E && E.abort(); p.empty() }; const M = function () {
    !1 === d.onError(q, s, d)
      ? (u.hide(), l = !1)
      : (d.titleShow = !1, d.width = 'auto', d.height = 'auto', p.html('<p id="fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>'),
        D())
  }; const G = function () {
    let b = q[s]; let c; let f; let e; let g; let k; let j; L(); d = a.extend({}, a.fn.fancybox.defaults, typeof a(b).data('fancybox') === 'undefined' ? d : a(b).data('fancybox')); j = d.onStart(q, s, d); if (!1 === j)l = !1; else {
      typeof j === 'object' && (d = a.extend(d, j)); e = d.title || (b.nodeName ? a(b).attr('title') : b.title) || ''; b.nodeName && !d.orig && (d.orig = a(b).children('img:first').length ? a(b).children('img:first') : a(b)); e === '' && (d.orig && d.titleFromAlt) && (e = d.orig.attr('alt')); c = d.href || (b.nodeName ? a(b).attr('href') : b.href) || null; if (/^(?:javascript)/i.test(c) ||
c == '#')c = null; d.type ? (f = d.type, c || (c = d.content)) : d.content ? f = 'html' : c && (f = c.match(H) ? 'image' : c.match(S) ? 'swf' : a(b).hasClass('iframe') ? 'iframe' : c.indexOf('#') === 0 ? 'inline' : 'ajax'); if (f) {
        switch (f == 'inline' && (b = c.substr(c.indexOf('#')), f = a(b).length > 0 ? 'inline' : 'ajax'), d.type = f, d.href = c, d.title = e, d.autoDimensions && (d.type == 'html' || d.type == 'inline' || d.type == 'ajax' ? (d.width = 'auto', d.height = 'auto') : d.autoDimensions = !1), d.modal && (d.overlayShow = !0, d.hideOnOverlayClick = !1, d.hideOnContentClick = !1, d.enableEscapeButton =
!1, d.showCloseButton = !1), d.padding = parseInt(d.padding, 10), d.margin = parseInt(d.margin, 10), p.css('padding', d.padding + d.margin), a('.fancybox-inline-tmp').unbind('fancybox-cancel').bind('fancybox-change', function () { a(this).replaceWith(m.children()) }), f) {
          case 'html':p.html(d.content); D(); break; case 'inline':if (!0 === a(b).parent().is('#fancybox-content')) { l = !1; break }a('<div class="fancybox-inline-tmp" />').hide().insertBefore(a(b)).bind('fancybox-cleanup', function () { a(this).replaceWith(m.children()) }).bind('fancybox-cancel',
            function () { a(this).replaceWith(p.children()) }); a(b).appendTo(p); D(); break; case 'image':l = !1; a.fancybox.showActivity(); n = new Image(); n.onerror = function () { M() }; n.onload = function () { l = !0; n.onerror = n.onload = null; d.width = n.width; d.height = n.height; a('<img />').attr({ id: 'fancybox-img', src: n.src, alt: d.title }).appendTo(p); N() }; n.src = c; break; case 'swf':d.scrolling = 'no'; g = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + d.width + '" height="' + d.height + '"><param name="movie" value="' + c + '"></param>'
            k = ''; a.each(d.swf, function (a, b) { g += '<param name="' + a + '" value="' + b + '"></param>'; k += ' ' + a + '="' + b + '"' }); g += '<embed src="' + c + '" type="application/x-shockwave-flash" width="' + d.width + '" height="' + d.height + '"' + k + '></embed></object>'; p.html(g); D(); break; case 'ajax':l = !1; a.fancybox.showActivity(); d.ajax.win = d.ajax.success; E = a.ajax(a.extend({}, d.ajax, {
            url: c,
            data: d.ajax.data || {},
            error: function (a) { a.status > 0 && M() },
            success: function (a, b, f) {
              if ((typeof f === 'object' ? f : E).status == 200) {
                if (typeof d.ajax.win === 'function') {
                  j =
d.ajax.win(c, a, b, f); if (!1 === j) { u.hide(); return } if (typeof j === 'string' || typeof j === 'object')a = j
                }p.html(a); D()
              }
            }
          })); break; case 'iframe':N()
        }
      } else M()
    }
  }; var D = function () {
    var b = d.width; var c = d.height; var b = b.toString().indexOf('%') > -1 ? parseInt((a(window).width() - 2 * d.margin) * parseFloat(b) / 100, 10) + 'px' : b == 'auto' ? 'auto' : b + 'px'; var c = c.toString().indexOf('%') > -1 ? parseInt((a(window).height() - 2 * d.margin) * parseFloat(c) / 100, 10) + 'px' : c == 'auto' ? 'auto' : c + 'px'; p.wrapInner('<div style="width:' + b + ';height:' + c + ';overflow: ' + (d.scrolling ==
'auto'
      ? 'auto'
      : d.scrolling == 'yes' ? 'scroll' : 'hidden') + ';position:relative;"></div>'); d.width = p.width(); d.height = p.height(); N()
  }; var N = function () {
    let b, h; u.hide(); if (e.is(':visible') && !1 === c.onCleanup(k, r, c))a.event.trigger('fancybox-cancel'), l = !1; else {
      l = !0; a(m.add(v)).unbind(); a(window).unbind('resize.fb scroll.fb'); a(document).unbind('keydown.fb'); e.is(':visible') && c.titlePosition !== 'outside' && e.css('height', e.height()); k = q; r = s; c = d; if (c.overlayShow) {
        if (v.css({
          'background-color': c.overlayColor,
          opacity: c.overlayOpacity,
          cursor: c.hideOnOverlayClick ? 'pointer' : 'auto',
          height: a(document).height()
        }), !v.is(':visible')) { if (K)a('select:not(#fancybox-tmp select)').filter(function () { return this.style.visibility !== 'hidden' }).css({ visibility: 'hidden' }).one('fancybox-cleanup', function () { this.style.visibility = 'inherit' }); v.show() }
      } else v.hide(); b = O(); const f = {}; let F = c.autoScale; const n = 2 * c.padding; f.width = c.width.toString().indexOf('%') > -1 ? parseInt(b[0] * parseFloat(c.width) / 100, 10) : c.width + n; f.height = c.height.toString().indexOf('%') > -1
        ? parseInt(b[1] *
parseFloat(c.height) / 100, 10)
        : c.height + n; if (F && (f.width > b[0] || f.height > b[1]))d.type == 'image' || d.type == 'swf' ? (F = c.width / c.height, f.width > b[0] && (f.width = b[0], f.height = parseInt((f.width - n) / F + n, 10)), f.height > b[1] && (f.height = b[1], f.width = parseInt((f.height - n) * F + n, 10))) : (f.width = Math.min(f.width, b[0]), f.height = Math.min(f.height, b[1])); f.top = parseInt(Math.max(b[3] - 20, b[3] + 0.5 * (b[1] - f.height - 40)), 10); f.left = parseInt(Math.max(b[2] - 20, b[2] + 0.5 * (b[0] - f.width - 40)), 10); g = f; w = c.title || ''; x = 0; j.empty().removeAttr('style').removeClass()
      if (!1 !== c.titleShow && (w = a.isFunction(c.titleFormat) ? c.titleFormat(w, k, r, c) : w && w.length ? c.titlePosition == 'float' ? '<table id="fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="fancybox-title-float-left"></td><td id="fancybox-title-float-main">' + w + '</td><td id="fancybox-title-float-right"></td></tr></table>' : '<div id="fancybox-title-' + c.titlePosition + '">' + w + '</div>' : !1) && w !== '') {
        switch (j.addClass('fancybox-title-' + c.titlePosition).html(w).appendTo('body').show(), c.titlePosition) {
          case 'inside':j.css({
            width: g.width -
2 * c.padding,
            marginLeft: c.padding,
            marginRight: c.padding
          }); x = j.outerHeight(!0); j.appendTo(B); g.height += x; break; case 'over':j.css({ marginLeft: c.padding, width: g.width - 2 * c.padding, bottom: c.padding }).appendTo(B); break; case 'float':j.css('left', -1 * parseInt((j.width() - g.width - 40) / 2, 10)).appendTo(e); break; default:j.css({ width: g.width - 2 * c.padding, paddingLeft: c.padding, paddingRight: c.padding }).appendTo(e)
        }
      }j.hide(); e.is(':visible')
        ? (a(C.add(y).add(z)).hide(), b = e.position(), t = {
            top: b.top,
            left: b.left,
            width: e.width(),
            height: e.height()
          }, h = t.width == g.width && t.height == g.height, m.fadeTo(c.changeFade, 0.3, function () { const b = function () { m.html(p.contents()).fadeTo(c.changeFade, 1, P) }; a.event.trigger('fancybox-change'); m.empty().removeAttr('filter').css({ 'border-width': c.padding, width: g.width - 2 * c.padding, height: d.autoDimensions ? 'auto' : g.height - x - 2 * c.padding }); h ? b() : (A.prop = 0, a(A).animate({ prop: 1 }, { duration: c.changeSpeed, easing: c.easingChange, step: Q, complete: b })) }))
        : (e.removeAttr('style'), m.css('border-width', c.padding), c.transitionIn ==
'elastic'
            ? (t = R(), m.html(p.contents()), e.show(), c.opacity && (g.opacity = 0), A.prop = 0, a(A).animate({ prop: 1 }, { duration: c.speedIn, easing: c.easingIn, step: Q, complete: P }))
            : (c.titlePosition == 'inside' && x > 0 && j.show(), m.css({ width: g.width - 2 * c.padding, height: d.autoDimensions ? 'auto' : g.height - x - 2 * c.padding }).html(p.contents()), e.css(g).fadeIn(c.transitionIn == 'none' ? 0 : c.speedIn, P)))
    }
  }; var P = function () {
    a.support.opacity || (m.get(0).style.removeAttribute('filter'), e.get(0).style.removeAttribute('filter')); d.autoDimensions &&
m.css('height', 'auto'); e.css('height', 'auto'); w && w.length && j.show(); c.showCloseButton && C.show(); (c.enableEscapeButton || c.enableKeyboardNav) && a(document).bind('keydown.fb', function (b) { if (b.keyCode == 27 && c.enableEscapeButton)b.preventDefault(), a.fancybox.close(); else if ((b.keyCode == 37 || b.keyCode == 39) && c.enableKeyboardNav && b.target.tagName !== 'INPUT' && b.target.tagName !== 'TEXTAREA' && b.target.tagName !== 'SELECT')b.preventDefault(), a.fancybox[b.keyCode == 37 ? 'prev' : 'next']() }); c.showNavArrows
      ? ((c.cyclic && k.length >
1 || r !== 0) && y.show(), (c.cyclic && k.length > 1 || r != k.length - 1) && z.show())
      : (y.hide(), z.hide()); c.hideOnContentClick && m.bind('click', a.fancybox.close); c.hideOnOverlayClick && v.bind('click', a.fancybox.close); a(window).bind('resize.fb', a.fancybox.resize); c.centerOnScroll && a(window).bind('scroll.fb', a.fancybox.center); c.type == 'iframe' && a('<iframe id="fancybox-frame" name="fancybox-frame' + (new Date()).getTime() + '" frameborder="0" hspace="0" ' + (navigator.userAgent.match(/msie [6]/i)
      ? 'allowtransparency="true""'
      : '') + ' scrolling="' + d.scrolling + '" src="' + c.href + '"></iframe>').appendTo(m); e.show(); l = !1; a.fancybox.center(); c.onComplete(k, r, c); let b, h; k.length - 1 > r && (b = k[r + 1].href, typeof b !== 'undefined' && b.match(H) && (h = new Image(), h.src = b)); r > 0 && (b = k[r - 1].href, typeof b !== 'undefined' && b.match(H) && (h = new Image(), h.src = b))
  }; var Q = function (b) {
    const a = {
      width: parseInt(t.width + (g.width - t.width) * b, 10),
      height: parseInt(t.height + (g.height - t.height) * b, 10),
      top: parseInt(t.top + (g.top - t.top) * b, 10),
      left: parseInt(t.left + (g.left - t.left) * b,
        10)
    }; typeof g.opacity !== 'undefined' && (a.opacity = b < 0.5 ? 0.5 : b); e.css(a); m.css({ width: a.width - 2 * c.padding, height: a.height - x * b - 2 * c.padding })
  }; var O = function () { return [a(window).width() - 2 * c.margin, a(window).height() - 2 * c.margin, a(document).scrollLeft() + c.margin, a(document).scrollTop() + c.margin] }; var R = function () {
    let b = d.orig ? a(d.orig) : !1; let h = {}; b && b.length
      ? (h = b.offset(), h.top += parseInt(b.css('paddingTop'), 10) || 0, h.left += parseInt(b.css('paddingLeft'), 10) || 0, h.top += parseInt(b.css('border-top-width'), 10) || 0, h.left +=
parseInt(b.css('border-left-width'), 10) || 0, h.width = b.width(), h.height = b.height(), h = { width: h.width + 2 * c.padding, height: h.height + 2 * c.padding, top: h.top - c.padding - 20, left: h.left - c.padding - 20 })
      : (b = O(), h = { width: 2 * c.padding, height: 2 * c.padding, top: parseInt(b[3] + 0.5 * b[1], 10), left: parseInt(b[2] + 0.5 * b[0], 10) }); return h
  }; const T = function () { u.is(':visible') ? (a('div', u).css('top', -40 * J + 'px'), J = (J + 1) % 12) : clearInterval(I) }; a.fn.fancybox = function (b) {
    if (!a(this).length) return this; a(this).data('fancybox', a.extend({}, b, a.metadata
      ? a(this).metadata()
      : {})).unbind('click.fb').bind('click.fb', function (b) { b.preventDefault(); l || (l = !0, a(this).blur(), q = [], s = 0, b = a(this).attr('rel') || '', !b || b == '' || b === 'nofollow' ? q.push(this) : (q = a('a[rel=' + b + '], area[rel=' + b + '], img[rel=' + b + ']'), s = q.index(this)), G()) }); return this
  }; a.fancybox = function (b, c) {
    let d; if (!l) {
      l = !0; d = typeof c !== 'undefined' ? c : {}; q = []; s = parseInt(d.index, 10) || 0; if (a.isArray(b)) {
        for (let e = 0, g = b.length; e < g; e++) {
          typeof b[e] === 'object'
            ? a(b[e]).data('fancybox', a.extend({}, d, b[e]))
            : b[e] =
a({}).data('fancybox', a.extend({ content: b[e] }, d))
        } q = jQuery.merge(q, b)
      } else typeof b === 'object' ? a(b).data('fancybox', a.extend({}, d, b)) : b = a({}).data('fancybox', a.extend({ content: b }, d)), q.push(b); if (s > q.length || s < 0)s = 0; G()
    }
  }; a.fancybox.showActivity = function () { clearInterval(I); u.show(); I = setInterval(T, 66) }; a.fancybox.hideActivity = function () { u.hide() }; a.fancybox.next = function () { return a.fancybox.pos(r + 1) }; a.fancybox.prev = function () { return a.fancybox.pos(r - 1) }; a.fancybox.pos = function (b) {
    l || (b = parseInt(b),
    q = k, b > -1 && b < k.length ? (s = b, G()) : c.cyclic && k.length > 1 && (s = b >= k.length ? 0 : k.length - 1, G()))
  }; a.fancybox.cancel = function () { l || (l = !0, a.event.trigger('fancybox-cancel'), L(), d.onCancel(q, s, d), l = !1) }; a.fancybox.close = function () {
    function b () { v.fadeOut('fast'); j.empty().hide(); e.hide(); a.event.trigger('fancybox-cleanup'); m.empty(); c.onClosed(k, r, c); k = d = []; r = s = 0; c = d = {}; l = !1 } if (!l && !e.is(':hidden')) {
      if (l = !0, c && !1 === c.onCleanup(k, r, c))l = !1; else if (L(), a(C.add(y).add(z)).hide(), a(m.add(v)).unbind(), a(window).unbind('resize.fb scroll.fb'),
      a(document).unbind('keydown.fb'), m.find('iframe').attr('src', K && /^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank'), c.titlePosition !== 'inside' && j.empty(), e.stop(), c.transitionOut == 'elastic') { t = R(); const h = e.position(); g = { top: h.top, left: h.left, width: e.width(), height: e.height() }; c.opacity && (g.opacity = 1); j.empty().hide(); A.prop = 1; a(A).animate({ prop: 0 }, { duration: c.speedOut, easing: c.easingOut, step: Q, complete: b }) } else e.fadeOut(c.transitionOut == 'none' ? 0 : c.speedOut, b)
    }
  }; a.fancybox.resize =
function () { v.is(':visible') && v.css('height', a(document).height()); a.fancybox.center(!0) }; a.fancybox.center = function (b) { let a, d; if (!l && (d = !0 === b ? 1 : 0, a = O(), d || !(e.width() > a[0] || e.height() > a[1])))e.stop().animate({ top: parseInt(Math.max(a[3] - 20, a[3] + 0.5 * (a[1] - m.height() - 40) - c.padding)), left: parseInt(Math.max(a[2] - 20, a[2] + 0.5 * (a[0] - m.width() - 40) - c.padding)) }, typeof b === 'number' ? b : 200) }; a.fancybox.init = function () {
    a('#fancybox-wrap').length || (a('body').append(p = a('<div id="fancybox-tmp"></div>'), u = a('<div id="fancybox-loading"><div></div></div>'),
      v = a('<div id="fancybox-overlay"></div>'), e = a('<div id="fancybox-wrap"></div>')), B = a('<div id="fancybox-outer"></div>').append('<div class="fancybox-bg" id="fancybox-bg-n"></div><div class="fancybox-bg" id="fancybox-bg-ne"></div><div class="fancybox-bg" id="fancybox-bg-e"></div><div class="fancybox-bg" id="fancybox-bg-se"></div><div class="fancybox-bg" id="fancybox-bg-s"></div><div class="fancybox-bg" id="fancybox-bg-sw"></div><div class="fancybox-bg" id="fancybox-bg-w"></div><div class="fancybox-bg" id="fancybox-bg-nw"></div>').appendTo(e),
    B.append(m = a('<div id="fancybox-content"></div>'), C = a('<a id="fancybox-close"></a>'), j = a('<div id="fancybox-title"></div>'), y = a('<a href="javascript:;" id="fancybox-left"><span class="fancy-ico" id="fancybox-left-ico"></span></a>'), z = a('<a href="javascript:;" id="fancybox-right"><span class="fancy-ico" id="fancybox-right-ico"></span></a>')), C.click(a.fancybox.close), u.click(a.fancybox.cancel), y.click(function (b) { b.preventDefault(); a.fancybox.prev() }), z.click(function (b) { b.preventDefault(); a.fancybox.next() }),
    a.fn.mousewheel && e.bind('mousewheel.fb', function (b, c) { if (l)b.preventDefault(); else if (a(b.target).get(0).clientHeight == 0 || a(b.target).get(0).scrollHeight === a(b.target).get(0).clientHeight)b.preventDefault(), a.fancybox[c > 0 ? 'prev' : 'next']() }), a.support.opacity || e.addClass('fancybox-ie'), K && (u.addClass('fancybox-ie6'), e.addClass('fancybox-ie6'), a('<iframe id="fancybox-hide-sel-frame" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank') + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(B)))
  }
  a.fn.fancybox.defaults = {
    padding: 10,
    margin: 40,
    opacity: !1,
    modal: !1,
    cyclic: !1,
    scrolling: 'auto',
    width: 560,
    height: 340,
    autoScale: !0,
    autoDimensions: !0,
    centerOnScroll: !1,
    ajax: {},
    swf: { wmode: 'transparent' },
    hideOnOverlayClick: !0,
    hideOnContentClick: !1,
    overlayShow: !0,
    overlayOpacity: 0.7,
    overlayColor: '#777',
    titleShow: !0,
    titlePosition: 'float',
    titleFormat: null,
    titleFromAlt: !1,
    transitionIn: 'fade',
    transitionOut: 'fade',
    speedIn: 300,
    speedOut: 300,
    changeSpeed: 300,
    changeFade: 'fast',
    easingIn: 'swing',
    easingOut: 'swing',
    showCloseButton: !0,
    showNavArrows: !0,
    enableEscapeButton: !0,
    enableKeyboardNav: !0,
    onStart: function () {},
    onCancel: function () {},
    onComplete: function () {},
    onCleanup: function () {},
    onClosed: function () {},
    onError: function () {}
  }; a(document).ready(function () { a.fancybox.init() })
})(jQuery);

/*
 * TipTip
 * Copyright 2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/tiptip-jquery-plugin
 *
 * Version 1.3   -   Updated: Mar. 23, 2010
 *
 * This Plug-In will create a custom tooltip to replace the default
 * browser tooltip. It is extremely lightweight and very smart in
 * that it detects the edges of the browser window and will make sure
 * the tooltip stays within the current window size. As a result the
 * tooltip will adjust itself to be displayed above, below, to the left
 * or to the right depending on what is necessary to stay within the
 * browser window. It is completely customizable as well via CSS.
 *
 * This TipTip jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
(function ($) { $.fn.tipTip = function (options) { const defaults = { activation: 'hover', keepAlive: false, maxWidth: '200px', edgeOffset: 3, defaultPosition: 'bottom', delay: 400, fadeIn: 200, fadeOut: 200, attribute: 'title', content: false, enter: function () {}, exit: function () {} }; const opts = $.extend(defaults, options); if ($('#tiptip_holder').length <= 0) { var tiptip_holder = $('<div id="tiptip_holder" style="max-width:' + opts.maxWidth + ';"></div>'); var tiptip_content = $('<div id="tiptip_content"></div>'); var tiptip_arrow = $('<div id="tiptip_arrow"></div>'); $('body').append(tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div id="tiptip_arrow_inner"></div>'))) } else { var tiptip_holder = $('#tiptip_holder'); var tiptip_content = $('#tiptip_content'); var tiptip_arrow = $('#tiptip_arrow') } return this.each(function () { const org_elem = $(this); if (opts.content) { var org_title = opts.content } else { var org_title = org_elem.attr(opts.attribute) } if (org_title != '') { if (!opts.content) { org_elem.removeAttr(opts.attribute) } let timeout = false; if (opts.activation == 'hover') { org_elem.hover(function () { active_tiptip() }, function () { if (!opts.keepAlive) { deactive_tiptip() } }); if (opts.keepAlive) { tiptip_holder.hover(function () {}, function () { deactive_tiptip() }) } } else if (opts.activation == 'focus') { org_elem.focus(function () { active_tiptip() }).blur(function () { deactive_tiptip() }) } else if (opts.activation == 'click') { org_elem.click(function () { active_tiptip(); return false }).hover(function () {}, function () { if (!opts.keepAlive) { deactive_tiptip() } }); if (opts.keepAlive) { tiptip_holder.hover(function () {}, function () { deactive_tiptip() }) } } function active_tiptip () { opts.enter.call(this); tiptip_content.html(org_title); tiptip_holder.hide().removeAttr('class').css('margin', '0'); tiptip_arrow.removeAttr('style'); const top = parseInt(org_elem.offset().top); const left = parseInt(org_elem.offset().left); const org_width = parseInt(org_elem.outerWidth()); const org_height = parseInt(org_elem.outerHeight()); const tip_w = tiptip_holder.outerWidth(); const tip_h = tiptip_holder.outerHeight(); const w_compare = Math.round((org_width - tip_w) / 2); const h_compare = Math.round((org_height - tip_h) / 2); let marg_left = Math.round(left + w_compare); let marg_top = Math.round(top + org_height + opts.edgeOffset); let t_class = ''; let arrow_top = ''; let arrow_left = Math.round(tip_w - 12) / 2; if (opts.defaultPosition == 'bottom') { t_class = '_bottom' } else if (opts.defaultPosition == 'top') { t_class = '_top' } else if (opts.defaultPosition == 'left') { t_class = '_left' } else if (opts.defaultPosition == 'right') { t_class = '_right' } const right_compare = (w_compare + left) < parseInt($(window).scrollLeft()); const left_compare = (tip_w + left) > parseInt($(window).width()); if ((right_compare && w_compare < 0) || (t_class == '_right' && !left_compare) || (t_class == '_left' && left < (tip_w + opts.edgeOffset + 5))) { t_class = '_right'; arrow_top = Math.round(tip_h - 13) / 2; arrow_left = -12; marg_left = Math.round(left + org_width + opts.edgeOffset); marg_top = Math.round(top + h_compare) } else if ((left_compare && w_compare < 0) || (t_class == '_left' && !right_compare)) { t_class = '_left'; arrow_top = Math.round(tip_h - 13) / 2; arrow_left = Math.round(tip_w); marg_left = Math.round(left - (tip_w + opts.edgeOffset + 5)); marg_top = Math.round(top + h_compare) } const top_compare = (top + org_height + opts.edgeOffset + tip_h + 8) > parseInt($(window).height() + $(window).scrollTop()); const bottom_compare = ((top + org_height) - (opts.edgeOffset + tip_h + 8)) < 0; if (top_compare || (t_class == '_bottom' && top_compare) || (t_class == '_top' && !bottom_compare)) { if (t_class == '_top' || t_class == '_bottom') { t_class = '_top' } else { t_class = t_class + '_top' }arrow_top = tip_h; marg_top = Math.round(top - (tip_h + 5 + opts.edgeOffset)) } else if (bottom_compare | (t_class == '_top' && bottom_compare) || (t_class == '_bottom' && !top_compare)) { if (t_class == '_top' || t_class == '_bottom') { t_class = '_bottom' } else { t_class = t_class + '_bottom' }arrow_top = -12; marg_top = Math.round(top + org_height + opts.edgeOffset) } if (t_class == '_right_top' || t_class == '_left_top') { marg_top = marg_top + 5 } else if (t_class == '_right_bottom' || t_class == '_left_bottom') { marg_top = marg_top - 5 } if (t_class == '_left_top' || t_class == '_left_bottom') { marg_left = marg_left + 5 }tiptip_arrow.css({ 'margin-left': arrow_left + 'px', 'margin-top': arrow_top + 'px' }); tiptip_holder.css({ 'margin-left': marg_left + 'px', 'margin-top': marg_top + 'px' }).attr('class', 'tip' + t_class); if (timeout) { clearTimeout(timeout) }timeout = setTimeout(function () { tiptip_holder.stop(true, true).fadeIn(opts.fadeIn) }, opts.delay) } function deactive_tiptip () { opts.exit.call(this); if (timeout) { clearTimeout(timeout) }tiptip_holder.fadeOut(opts.fadeOut) } } }) } })(jQuery);

/* TINY SORT */
(function (e) { const a = false; const g = null; const f = parseFloat; const b = /(\d+\.?\d*)$/g; e.tinysort = { id: 'TinySort', version: '1.2.18', copyright: 'Copyright (c) 2008-2012 Ron Valstar', uri: 'http://tinysort.sjeiti.com/', licenced: { MIT: 'http://www.opensource.org/licenses/mit-license.php', GPL: 'http://www.gnu.org/licenses/gpl.html' }, defaults: { order: 'asc', attr: g, data: g, useVal: a, place: 'start', returns: a, cases: a, forceStrings: a, sortFunction: g } }; e.fn.extend({ tinysort: function (m, h) { if (m && typeof (m) !== 'string') { h = m; m = g } const n = e.extend({}, e.tinysort.defaults, h); let s; const B = this; const x = e(this).length; const C = {}; const p = !(!m || m == ''); const q = !(n.attr === g || n.attr == ''); const w = n.data !== g; const j = p && m[0] == ':'; const k = j ? B.filter(m) : B; let r = n.sortFunction; const v = n.order == 'asc' ? 1 : -1; const l = []; if (!r) { r = n.order == 'rand' ? function () { return Math.random() < 0.5 ? 1 : -1 } : function (F, E) { let i = !n.cases ? d(F.s) : F.s; let K = !n.cases ? d(E.s) : E.s; if (!n.forceStrings) { const H = i.match(b); const G = K.match(b); if (H && G) { const J = i.substr(0, i.length - H[0].length); const I = K.substr(0, K.length - G[0].length); if (J == I) { i = f(H[0]); K = f(G[0]) } } } return v * (i < K ? -1 : (i > K ? 1 : 0)) } }B.each(function (G, H) { const I = e(H); const E = p ? (j ? k.filter(H) : I.find(m)) : I; const J = w ? E.data(n.data) : (q ? E.attr(n.attr) : (n.useVal ? E.val() : E.text())); const F = I.parent(); if (!C[F]) { C[F] = { s: [], n: [] } } if (E.length > 0) { C[F].s.push({ s: J, e: I, n: G }) } else { C[F].n.push({ e: I, n: G }) } }); for (s in C) { C[s].s.sort(r) } for (s in C) { const y = C[s]; var A = []; var D = x; const u = [0, 0]; var z; switch (n.place) { case 'first':e.each(y.s, function (E, F) { D = Math.min(D, F.n) }); break; case 'org':e.each(y.s, function (E, F) { A.push(F.n) }); break; case 'end':D = y.n.length; break; default:D = 0 } for (z = 0; z < x; z++) { const o = c(A, z) ? !a : z >= D && z < D + y.s.length; const t = (o ? y.s : y.n)[u[o ? 0 : 1]].e; t.parent().append(t); if (o || !n.returns) { l.push(t.get(0)) }u[o ? 0 : 1]++ } } return B.pushStack(l) } }); function d (h) { return h && h.toLowerCase ? h.toLowerCase() : h } function c (j, m) { for (let k = 0, h = j.length; k < h; k++) { if (j[k] == m) { return !a } } return a }e.fn.TinySort = e.fn.Tinysort = e.fn.tsort = e.fn.tinysort })(jQuery);

/* global jQuery */
/* jshint multistr:true browser:true */
/*!
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function ($) {
  'use strict'

  $.fn.fitVids = function (options) {
    const settings = {
      customSelector: null
    }

    const div = document.createElement('div')
    const ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0]

    div.className = 'fit-vids-style'
    div.innerHTML = '&shy;<style>         \
      .fluid-width-video-wrapper {        \
         width: 100%;                     \
         position: relative;              \
         padding: 0;                      \
      }                                   \
                                          \
      .fluid-width-video-wrapper iframe,  \
      .fluid-width-video-wrapper object,  \
      .fluid-width-video-wrapper embed {  \
         position: absolute;              \
         top: 0;                          \
         left: 0;                         \
         width: 100%;                     \
         height: 100%;                    \
      }                                   \
    </style>'

    ref.parentNode.insertBefore(div, ref)

    if (options) {
      $.extend(settings, options)
    }

    return this.each(function () {
      const selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='www.youtube.com']",
        "iframe[src*='www.kickstarter.com']",
        'object',
        'embed'
      ]

      if (settings.customSelector) {
        selectors.push(settings.customSelector)
      }

      const $allVideos = $(this).find(selectors.join(','))

      $allVideos.each(function () {
        const $this = $(this)
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return }
        const height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height()
        const width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width()
        const aspectRatio = height / width
        if (!$this.attr('id')) {
          const videoID = 'fitvid' + Math.floor(Math.random() * 999999)
          $this.attr('id', videoID)
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100) + '%')
        $this.removeAttr('height').removeAttr('width')
      })
    })
  }
})(jQuery);

/**
 * BxSlider v4.0 - Fully loaded, responsive content slider
 * http://bxslider.com
 *
 * Copyright 2012, Steven Wanderski - http://stevenwanderski.com - http://bxcreative.com
 * Written while drinking Belgian ales and listening to jazz
 *
 * Released under the WTFPL license - http://sam.zoy.org/wtfpl/
 */
(function (t) { const e = {}; const n = { mode: 'horizontal', slideSelector: '', infiniteLoop: !0, hideControlOnEnd: !1, speed: 500, easing: null, slideMargin: 0, startSlide: 0, randomStart: !1, captions: !1, ticker: !1, tickerHover: !1, adaptiveHeight: !1, adaptiveHeightSpeed: 500, touchEnabled: !0, swipeThreshold: 50, video: !1, useCSS: !0, pager: !0, pagerType: 'full', pagerShortSeparator: ' / ', pagerSelector: null, buildPager: null, pagerCustom: null, controls: !0, nextText: 'Next', prevText: 'Prev', nextSelector: null, prevSelector: null, autoControls: !1, startText: 'Start', stopText: 'Stop', autoControlsCombine: !1, autoControlsSelector: null, auto: !1, pause: 4e3, autoStart: !0, autoDirection: 'next', autoHover: !1, autoDelay: 0, minSlides: 1, maxSlides: 1, moveSlides: 0, slideWidth: 0, onSliderLoad: function () {}, onSlideBefore: function () {}, onSlideAfter: function () {}, onSlideNext: function () {}, onSlidePrev: function () {} }; t.fn.bxSlider = function (s) { if (this.length != 0) { if (this.length > 1) return this.each(function () { t(this).bxSlider(s) }), this; const o = {}; const r = this; e.el = this; let a = t(window).width(); let l = t(window).height(); const d = function () { o.settings = t.extend({}, n, s), o.children = r.children(o.settings.slideSelector), o.children.length < o.settings.minSlides && (o.settings.minSlides = o.children.length), o.children.length < o.settings.maxSlides && (o.settings.maxSlides = o.children.length), o.settings.randomStart && (o.settings.startSlide = Math.floor(Math.random() * o.children.length)), o.active = { index: o.settings.startSlide }, o.carousel = o.settings.minSlides > 1 || o.settings.maxSlides > 1, o.minThreshold = o.settings.minSlides * o.settings.slideWidth + (o.settings.minSlides - 1) * o.settings.slideMargin, o.maxThreshold = o.settings.maxSlides * o.settings.slideWidth + (o.settings.maxSlides - 1) * o.settings.slideMargin, o.working = !1, o.controls = {}, o.interval = null, o.animProp = o.settings.mode == 'vertical' ? 'top' : 'left', o.usingCSS = o.settings.useCSS && o.settings.mode != 'fade' && (function () { const t = document.createElement('div'); const e = ['WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective']; for (const i in e) if (void 0 !== t.style[e[i]]) return o.cssPrefix = e[i].replace('Perspective', '').toLowerCase(), o.animProp = '-' + o.cssPrefix + '-transform', !0; return !1 }()), o.settings.mode == 'vertical' && (o.settings.maxSlides = o.settings.minSlides), c() }; var c = function () { if (r.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>'), o.viewport = r.parent(), o.loader = t('<div class="bx-loading" />'), o.viewport.prepend(o.loader), r.css({ width: o.settings.mode == 'horizontal' ? 215 * o.children.length + '%' : 'auto', position: 'relative' }), o.usingCSS && o.settings.easing ? r.css('-' + o.cssPrefix + '-transition-timing-function', o.settings.easing) : o.settings.easing || (o.settings.easing = 'swing'), o.viewport.css({ width: '100%', overflow: 'hidden', position: 'relative' }), o.children.css({ float: o.settings.mode == 'horizontal' ? 'left' : 'none', listStyle: 'none', position: 'relative' }), o.children.width(h()), o.settings.mode == 'horizontal' && o.settings.slideMargin > 0 && o.children.css('marginRight', o.settings.slideMargin), o.settings.mode == 'vertical' && o.settings.slideMargin > 0 && o.children.css('marginBottom', o.settings.slideMargin), o.settings.mode == 'fade' && (o.children.css({ position: 'absolute', zIndex: 0, display: 'none' }), o.children.eq(o.settings.startSlide).css({ zIndex: 50, display: 'block' })), o.controls.el = t('<div class="bx-controls" />'), o.settings.captions && T(), o.settings.infiniteLoop && o.settings.mode != 'fade' && !o.settings.ticker) { const e = o.settings.mode == 'vertical' ? o.settings.minSlides : o.settings.maxSlides; const i = o.children.slice(0, e).clone().addClass('bx-clone'); const n = o.children.slice(-e).clone().addClass('bx-clone'); r.append(i).prepend(n) }o.active.last = o.settings.startSlide == v() - 1, o.settings.video && r.fitVids(), o.settings.ticker || (o.settings.pager && S(), o.settings.controls && b(), o.settings.auto && o.settings.autoControls && w(), (o.settings.controls || o.settings.autoControls || o.settings.pager) && o.viewport.after(o.controls.el)), r.children().imagesLoaded(function () { o.loader.remove(), f(), o.settings.mode == 'vertical' && (o.settings.adaptiveHeight = !0), o.viewport.height(g()), o.settings.onSliderLoad(o.active.index), o.initialized = !0, t(window).bind('resize', O), o.settings.auto && o.settings.autoStart && L(), o.settings.ticker && D(), o.settings.pager && y(o.settings.startSlide), o.settings.controls && q(), o.settings.touchEnabled && !o.settings.ticker && H() }) }; var g = function () { let e = 0; let n = t(); if (o.settings.mode == 'vertical' || o.settings.adaptiveHeight) if (o.carousel) { const s = o.settings.moveSlides == 1 ? o.active.index : o.active.index * p(); for (n = o.children.eq(s), i = 1; o.settings.maxSlides - 1 >= i; i++)n = s + i >= o.children.length ? n.add(o.children.eq(i - 1)) : n.add(o.children.eq(s + i)) } else n = o.children.eq(o.active.index); else n = o.children; return o.settings.mode == 'vertical' ? (n.each(function () { e += t(this).outerHeight() }), o.settings.slideMargin > 0 && (e += o.settings.slideMargin * (o.settings.minSlides - 1))) : e = Math.max.apply(Math, n.map(function () { return t(this).outerHeight(!1) }).get()), e }; var h = function () { let t = o.settings.slideWidth; const e = o.viewport.width(); return o.settings.slideWidth == 0 ? t = e : e > o.maxThreshold ? t = (e - o.settings.slideMargin * (o.settings.maxSlides - 1)) / o.settings.maxSlides : o.minThreshold > e && (t = (e - o.settings.slideMargin * (o.settings.minSlides - 1)) / o.settings.minSlides), t }; const u = function () { let t = 1; if (o.settings.mode == 'horizontal') if (o.viewport.width() < o.minThreshold)t = o.settings.minSlides; else if (o.viewport.width() > o.maxThreshold)t = o.settings.maxSlides; else { const e = o.children.first().width(); t = Math.floor(o.viewport.width() / e) } else o.settings.mode == 'vertical' && (t = o.settings.minSlides); return t }; var v = function () { let t = 0; if (o.settings.moveSlides > 0) if (o.settings.infiniteLoop)t = o.children.length / p(); else for (let e = 0, i = 0; o.children.length > e;)++t, e = i + u(), i += o.settings.moveSlides <= u() ? o.settings.moveSlides : u(); else t = Math.ceil(o.children.length / u()); return t }; var p = function () { return o.settings.moveSlides > 0 && o.settings.moveSlides <= u() ? o.settings.moveSlides : u() }; var f = function () { if (o.active.last && !o.settings.infiniteLoop) { if (o.settings.mode == 'horizontal') { const t = o.children.last(); var e = t.position(); x(-(e.left - (o.viewport.width() - t.width())), 'reset', 0) } else if (o.settings.mode == 'vertical') { const i = o.children.length - o.settings.minSlides; var e = o.children.eq(i).position(); x(-e.top, 'reset', 0) } } else { var e = o.children.eq(o.active.index * p()).position(); o.active.index == v() - 1 && (o.active.last = !0), void 0 != e && (o.settings.mode == 'horizontal' ? x(-e.left, 'reset', 0) : o.settings.mode == 'vertical' && x(-e.top, 'reset', 0)) } }; var x = function (t, e, i, n) { if (o.usingCSS) { const s = o.settings.mode == 'vertical' ? 'translate3d(0, ' + t + 'px, 0)' : 'translate3d(' + t + 'px, 0, 0)'; r.css('-' + o.cssPrefix + '-transition-duration', i / 1e3 + 's'), e == 'slide' ? (r.css(o.animProp, s), r.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () { r.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'), z() })) : e == 'reset' ? r.css(o.animProp, s) : e == 'ticker' && (r.css('-' + o.cssPrefix + '-transition-timing-function', 'linear'), r.css(o.animProp, s), r.bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function () { r.unbind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'), x(n.resetValue, 'reset', 0), I() })) } else { const a = {}; a[o.animProp] = t, e == 'slide' ? r.animate(a, i, o.settings.easing, function () { z() }) : e == 'reset' ? r.css(o.animProp, t) : e == 'ticker' && r.animate(a, speed, 'linear', function () { x(n.resetValue, 'reset', 0), I() }) } }; const m = function () { let e = ''; pagerQty = v(); for (let i = 0; pagerQty > i; i++) { let n = ''; o.settings.buildPager && t.isFunction(o.settings.buildPager) ? (n = o.settings.buildPager(i), o.pagerEl.addClass('bx-custom-pager')) : (n = i + 1, o.pagerEl.addClass('bx-default-pager')), e += '<div class="bx-pager-item"><a href="" data-slide-index="' + i + '" class="bx-pager-link">' + n + '</a></div>' }o.pagerEl.html(e) }; var S = function () { o.settings.pagerCustom ? o.pagerEl = t(o.settings.pagerCustom) : (o.pagerEl = t('<div class="bx-pager" />'), o.settings.pagerSelector ? t(o.settings.pagerSelector).html(o.pagerEl) : o.controls.el.addClass('bx-has-pager').append(o.pagerEl), m()), o.pagerEl.delegate('a', 'click', k) }; var b = function () { o.controls.next = t('<a class="bx-next" href="">' + o.settings.nextText + '</a>'), o.controls.prev = t('<a class="bx-prev" href="">' + o.settings.prevText + '</a>'), o.controls.next.bind('click', C), o.controls.prev.bind('click', E), o.settings.nextSelector && t(o.settings.nextSelector).append(o.controls.next), o.settings.prevSelector && t(o.settings.prevSelector).append(o.controls.prev), o.settings.nextSelector || o.settings.prevSelector || (o.controls.directionEl = t('<div class="bx-controls-direction" />'), o.controls.directionEl.append(o.controls.prev).append(o.controls.next), o.controls.el.addClass('bx-has-controls-direction').append(o.controls.directionEl)) }; var w = function () { o.controls.start = t('<div class="bx-controls-auto-item"><a class="bx-start" href="">' + o.settings.startText + '</a></div>'), o.controls.stop = t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">' + o.settings.stopText + '</a></div>'), o.controls.autoEl = t('<div class="bx-controls-auto" />'), o.controls.autoEl.delegate('.bx-start', 'click', A), o.controls.autoEl.delegate('.bx-stop', 'click', P), o.settings.autoControlsCombine ? o.controls.autoEl.append(o.controls.start) : o.controls.autoEl.append(o.controls.start).append(o.controls.stop), o.settings.autoControlsSelector ? t(o.settings.autoControlsSelector).html(o.controls.autoEl) : o.controls.el.addClass('bx-has-controls-auto').append(o.controls.autoEl), M(o.settings.autoStart ? 'stop' : 'start') }; var T = function () { o.children.each(function () { const e = t(this).find('img:first').attr('title'); void 0 != e && t(this).append('<div class="bx-caption"><span>' + e + '</span></div>') }) }; var C = function (t) { o.settings.auto && r.stopAuto(), r.goToNextSlide(), t.preventDefault() }; var E = function (t) { o.settings.auto && r.stopAuto(), r.goToPrevSlide(), t.preventDefault() }; var A = function (t) { r.startAuto(), t.preventDefault() }; var P = function (t) { r.stopAuto(), t.preventDefault() }; var k = function (e) { o.settings.auto && r.stopAuto(); const i = t(e.currentTarget); const n = parseInt(i.attr('data-slide-index')); n != o.active.index && r.goToSlide(n), e.preventDefault() }; var y = function (e) { return o.settings.pagerType == 'short' ? (o.pagerEl.html(e + 1 + o.settings.pagerShortSeparator + o.children.length), void 0) : (o.pagerEl.find('a').removeClass('active'), o.pagerEl.each(function (i, n) { t(n).find('a').eq(e).addClass('active') }), void 0) }; var z = function () { if (o.settings.infiniteLoop) { let t = ''; o.active.index == 0 ? t = o.children.eq(0).position() : o.active.index == v() - 1 && o.carousel ? t = o.children.eq((v() - 1) * p()).position() : o.active.index == o.children.length - 1 && (t = o.children.eq(o.children.length - 1).position()), o.settings.mode == 'horizontal' ? x(-t.left, 'reset', 0) : o.settings.mode == 'vertical' && x(-t.top, 'reset', 0) }o.working = !1, o.settings.onSlideAfter(o.children.eq(o.active.index), o.oldIndex, o.active.index) }; var M = function (t) { o.settings.autoControlsCombine ? o.controls.autoEl.html(o.controls[t]) : (o.controls.autoEl.find('a').removeClass('active'), o.controls.autoEl.find('a:not(.bx-' + t + ')').addClass('active')) }; var q = function () { !o.settings.infiniteLoop && o.settings.hideControlOnEnd && (o.active.index == 0 ? (o.controls.prev.addClass('disabled'), o.controls.next.removeClass('disabled')) : o.active.index == v() - 1 ? (o.controls.next.addClass('disabled'), o.controls.prev.removeClass('disabled')) : (o.controls.prev.removeClass('disabled'), o.controls.next.removeClass('disabled'))) }; var L = function () { o.settings.autoDelay > 0 ? setTimeout(r.startAuto, o.settings.autoDelay) : r.startAuto(), o.settings.autoHover && r.hover(function () { o.interval && (r.stopAuto(!0), o.autoPaused = !0) }, function () { o.autoPaused && (r.startAuto(!0), o.autoPaused = null) }) }; var D = function () { let e = 0; if (o.settings.autoDirection == 'next')r.append(o.children.clone().addClass('bx-clone')); else { r.prepend(o.children.clone().addClass('bx-clone')); const i = o.children.first().position(); e = o.settings.mode == 'horizontal' ? -i.left : -i.top }x(e, 'reset', 0), o.settings.pager = !1, o.settings.controls = !1, o.settings.autoControls = !1, o.settings.tickerHover && !o.usingCSS && o.viewport.hover(function () { r.stop() }, function () { let e = 0; o.children.each(function () { e += o.settings.mode == 'horizontal' ? t(this).outerWidth(!0) : t(this).outerHeight(!0) }); const i = o.settings.speed / e; const n = o.settings.mode == 'horizontal' ? 'left' : 'top'; const s = i * (e - Math.abs(parseInt(r.css(n)))); I(s) }), I() }; var I = function (t) { speed = t || o.settings.speed; let e = { left: 0, top: 0 }; let i = { left: 0, top: 0 }; o.settings.autoDirection == 'next' ? e = r.find('.bx-clone').first().position() : i = o.children.first().position(); const n = o.settings.mode == 'horizontal' ? -e.left : -e.top; const s = o.settings.mode == 'horizontal' ? -i.left : -i.top; const a = { resetValue: s }; x(n, 'ticker', speed, a) }; var H = function () { o.touch = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } }, o.viewport.bind('touchstart', W) }; var W = function (t) { if (o.working)t.preventDefault(); else { o.touch.originalPos = r.position(); const e = t.originalEvent; o.touch.start.x = e.changedTouches[0].pageX, o.touch.start.y = e.changedTouches[0].pageY, o.viewport.bind('touchmove', N), o.viewport.bind('touchend', B) } }; var N = function (t) { if (t.preventDefault(), o.settings.mode != 'fade') { const e = t.originalEvent; let i = 0; if (o.settings.mode == 'horizontal') { var n = e.changedTouches[0].pageX - o.touch.start.x; i = o.touch.originalPos.left + n } else { var n = e.changedTouches[0].pageY - o.touch.start.y; i = o.touch.originalPos.top + n }x(i, 'reset', 0) } }; var B = function (t) { o.viewport.unbind('touchmove', N); const e = t.originalEvent; let i = 0; if (o.touch.end.x = e.changedTouches[0].pageX, o.touch.end.y = e.changedTouches[0].pageY, o.settings.mode == 'fade') { var n = Math.abs(o.touch.start.x - o.touch.end.x); n >= o.settings.swipeThreshold && (o.touch.start.x > o.touch.end.x ? r.goToNextSlide() : r.goToPrevSlide(), r.stopAuto()) } else { var n = 0; o.settings.mode == 'horizontal' ? (n = o.touch.end.x - o.touch.start.x, i = o.touch.originalPos.left) : (n = o.touch.end.y - o.touch.start.y, i = o.touch.originalPos.top), !o.settings.infiniteLoop && (o.active.index == 0 && n > 0 || o.active.last && n < 0) ? x(i, 'reset', 200) : Math.abs(n) >= o.settings.swipeThreshold ? (n < 0 ? r.goToNextSlide() : r.goToPrevSlide(), r.stopAuto()) : x(i, 'reset', 200) }o.viewport.unbind('touchend', B) }; var O = function () { const e = t(window).width(); const i = t(window).height(); (a != e || l != i) && (a = e, l = i, o.children.add(r.find('.bx-clone')).width(h()), o.viewport.css('height', g()), o.active.last && (o.active.index = v() - 1), o.active.index >= v() && (o.active.last = !0), o.settings.pager && !o.settings.pagerCustom && (m(), y(o.active.index)), o.settings.ticker || f()) }; return r.goToSlide = function (e, i) { if (!o.working && o.active.index != e) if (o.working = !0, o.oldIndex = o.active.index, o.active.index = e < 0 ? v() - 1 : e >= v() ? 0 : e, o.settings.onSlideBefore(o.children.eq(o.active.index), o.oldIndex, o.active.index), i == 'next' ? o.settings.onSlideNext(o.children.eq(o.active.index), o.oldIndex, o.active.index) : i == 'prev' && o.settings.onSlidePrev(o.children.eq(o.active.index), o.oldIndex, o.active.index), o.active.last = o.active.index >= v() - 1, o.settings.pager && y(o.active.index), o.settings.controls && q(), o.settings.mode == 'fade')o.settings.adaptiveHeight && o.viewport.height() != g() && o.viewport.animate({ height: g() }, o.settings.adaptiveHeightSpeed), o.children.filter(':visible').fadeOut(o.settings.speed).css({ zIndex: 0 }), o.children.eq(o.active.index).css('zIndex', 51).fadeIn(o.settings.speed, function () { t(this).css('zIndex', 50), z() }); else { o.settings.adaptiveHeight && o.viewport.height() != g() && o.viewport.animate({ height: g() }, o.settings.adaptiveHeightSpeed); let n = 0; let s = { left: 0, top: 0 }; if (!o.settings.infiniteLoop && o.carousel && o.active.last) if (o.settings.mode == 'horizontal') { var a = o.children.eq(o.children.length - 1); s = a.position(), n = o.viewport.width() - a.width() } else { const l = o.children.length - o.settings.minSlides; s = o.children.eq(l).position() } else if (o.carousel && o.active.last && i == 'prev') { const d = o.settings.moveSlides == 1 ? o.settings.maxSlides - p() : (v() - 1) * p() - (o.children.length - o.settings.maxSlides); var a = r.children('.bx-clone').eq(d); s = a.position() } else if (i == 'next' && o.active.index == 0)s = r.find('.bx-clone').eq(o.settings.maxSlides).position(), o.active.last = !1; else if (e >= 0) { const c = e * p(); s = o.children.eq(c).position() } const h = o.settings.mode == 'horizontal' ? -(s.left - n) : -s.top; x(h, 'slide', o.settings.speed) } }, r.goToNextSlide = function () { if (o.settings.infiniteLoop || !o.active.last) { const t = o.active.index + 1; r.goToSlide(t, 'next') } }, r.goToPrevSlide = function () { if (o.settings.infiniteLoop || o.active.index != 0) { const t = o.active.index - 1; r.goToSlide(t, 'prev') } }, r.startAuto = function (t) { o.interval || (o.interval = setInterval(function () { o.settings.autoDirection == 'next' ? r.goToNextSlide() : r.goToPrevSlide() }, o.settings.pause), o.settings.autoControls && t != 1 && M('stop')) }, r.stopAuto = function (t) { o.interval && (clearInterval(o.interval), o.interval = null, o.settings.autoControls && t != 1 && M('start')) }, r.getCurrentSlide = function () { return o.active.index }, r.getSlideCount = function () { return o.children.length }, r.destroySlider = function () { o.initialized && (o.initialized = !1, t('.bx-clone', this).remove(), o.children.removeAttr('style'), this.removeAttr('style').unwrap().unwrap(), o.controls.el && o.controls.el.remove(), o.controls.next && o.controls.next.remove(), o.controls.prev && o.controls.prev.remove(), o.pagerEl && o.pagerEl.remove(), t('.bx-caption', this).remove(), o.controls.autoEl && o.controls.autoEl.remove(), clearInterval(o.interval), t(window).unbind('resize', O)) }, r.reloadSlider = function (t) { void 0 != t && (s = t), r.destroySlider(), d() }, d(), this } } })(jQuery), (function (t, e) { const i = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='; t.fn.imagesLoaded = function (n) { function s () { const e = t(g); const i = t(h); a && (h.length ? a.reject(d, e, i) : a.resolve(d)), t.isFunction(n) && n.call(r, d, e, i) } function o (e, n) { e.src === i || t.inArray(e, c) !== -1 || (c.push(e), n ? h.push(e) : g.push(e), t.data(e, 'imagesLoaded', { isBroken: n, src: e.src }), l && a.notifyWith(t(e), [n, d, t(g), t(h)]), d.length === c.length && (setTimeout(s), d.unbind('.imagesLoaded'))) } var r = this; var a = t.isFunction(t.Deferred) ? t.Deferred() : 0; var l = t.isFunction(a.notify); var d = r.find('img').add(r.filter('img')); var c = []; var g = []; var h = []; return t.isPlainObject(n) && t.each(n, function (t, e) { t === 'callback' ? n = e : a && a[t](e) }), d.length ? d.bind('load.imagesLoaded error.imagesLoaded', function (t) { o(t.target, t.type === 'error') }).each(function (n, s) { const r = s.src; const a = t.data(s, 'imagesLoaded'); a && a.src === r ? o(s, a.isBroken) : s.complete && s.naturalWidth !== e ? o(s, s.naturalWidth === 0 || s.naturalHeight === 0) : (s.readyState || s.complete) && (s.src = i, s.src = r) }) : s(), a ? a.promise(r) : r } }(jQuery))

/*
	Prettify JS
*/
const q = null; window.PR_SHOULD_USE_CONTINUATION = !0;
(function () {
  function L (a) {
    function m (a) { let f = a.charCodeAt(0); if (f !== 92) return f; const b = a.charAt(1); return (f = r[b]) ? f : b >= '0' && b <= '7' ? parseInt(a.substring(1), 8) : b === 'u' || b === 'x' ? parseInt(a.substring(2), 16) : a.charCodeAt(1) } function e (a) { if (a < 32) return (a < 16 ? '\\x0' : '\\x') + a.toString(16); a = String.fromCharCode(a); if (a === '\\' || a === '-' || a === '[' || a === ']')a = '\\' + a; return a } function h (a) {
      for (var f = a.substring(1, a.length - 1).match(/\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\S\s]|[^\\]/g), a =
[], b = [], o = f[0] === '^', c = o ? 1 : 0, i = f.length; c < i; ++c) { var j = f[c]; if (/\\[bdsw]/i.test(j))a.push(j); else { var j = m(j); var d; c + 2 < i && f[c + 1] === '-' ? (d = m(f[c + 2]), c += 2) : d = j; b.push([j, d]); d < 65 || j > 122 || (d < 65 || j > 90 || b.push([Math.max(65, j) | 32, Math.min(d, 90) | 32]), d < 97 || j > 122 || b.push([Math.max(97, j) & -33, Math.min(d, 122) & -33])) } }b.sort(function (a, f) { return a[0] - f[0] || f[1] - a[1] }); f = []; j = [NaN, NaN]; for (c = 0; c < b.length; ++c)i = b[c], i[0] <= j[1] + 1 ? j[1] = Math.max(j[1], i[1]) : f.push(j = i); b = ['[']; o && b.push('^'); b.push.apply(b, a); for (c = 0; c <
f.length; ++c)i = f[c], b.push(e(i[0])), i[1] > i[0] && (i[1] + 1 > i[0] && b.push('-'), b.push(e(i[1]))); b.push(']'); return b.join('')
    } function y (a) {
      for (var f = a.source.match(/\[(?:[^\\\]]|\\[\S\s])*]|\\u[\dA-Fa-f]{4}|\\x[\dA-Fa-f]{2}|\\\d+|\\[^\dux]|\(\?[!:=]|[()^]|[^()[\\^]+/g), b = f.length, d = [], c = 0, i = 0; c < b; ++c) { var j = f[c]; j === '(' ? ++i : j.charAt(0) === '\\' && (j = +j.substring(1)) && j <= i && (d[j] = -1) } for (c = 1; c < d.length; ++c)d[c] === -1 && (d[c] = ++t); for (i = c = 0; c < b; ++c) {
        j = f[c], j === '('
          ? (++i, d[i] === void 0 && (f[c] = '(?:'))
          : j.charAt(0) === '\\' &&
(j = +j.substring(1)) && j <= i && (f[c] = '\\' + d[i])
      } for (i = c = 0; c < b; ++c)f[c] === '^' && f[c + 1] !== '^' && (f[c] = ''); if (a.ignoreCase && s) for (c = 0; c < b; ++c)j = f[c], a = j.charAt(0), j.length >= 2 && a === '[' ? f[c] = h(j) : a !== '\\' && (f[c] = j.replace(/[A-Za-z]/g, function (a) { a = a.charCodeAt(0); return '[' + String.fromCharCode(a & -33, a | 32) + ']' })); return f.join('')
    } for (var t = 0, s = !1, l = !1, p = 0, d = a.length; p < d; ++p) { var g = a[p]; if (g.ignoreCase)l = !0; else if (/[a-z]/i.test(g.source.replace(/\\u[\da-f]{4}|\\x[\da-f]{2}|\\[^UXux]/gi, ''))) { s = !0; l = !1; break } } for (var r =
{ b: 8, t: 9, n: 10, v: 11, f: 12, r: 13 }, n = [], p = 0, d = a.length; p < d; ++p) { g = a[p]; if (g.global || g.multiline) throw Error('' + g); n.push('(?:' + y(g) + ')') } return RegExp(n.join('|'), l ? 'gi' : 'g')
  } function M (a) {
    function m (a) {
      switch (a.nodeType) {
        case 1:if (e.test(a.className)) break; for (var g = a.firstChild; g; g = g.nextSibling)m(g); g = a.nodeName; if (g === 'BR' || g === 'LI')h[s] = '\n', t[s << 1] = y++, t[s++ << 1 | 1] = a; break; case 3:case 4:g = a.nodeValue, g.length && (g = p ? g.replace(/\r\n?/g, '\n') : g.replace(/[\t\n\r ]+/g, ' '), h[s] = g, t[s << 1] = y, y += g.length,
        t[s++ << 1 | 1] = a)
      }
    } var e = /(?:^|\s)nocode(?:\s|$)/; var h = []; var y = 0; var t = []; var s = 0; let l; a.currentStyle ? l = a.currentStyle.whiteSpace : window.getComputedStyle && (l = document.defaultView.getComputedStyle(a, q).getPropertyValue('white-space')); var p = l && l.substring(0, 3) === 'pre'; m(a); return { a: h.join('').replace(/\n$/, ''), c: t }
  } function B (a, m, e, h) { m && (a = { a: m, d: a }, e(a), h.push.apply(h, a.e)) } function x (a, m) {
    function e (a) {
      for (var l = a.d, p = [l, 'pln'], d = 0, g = a.a.match(y) || [], r = {}, n = 0, z = g.length; n < z; ++n) {
        const f = g[n]; let b = r[f]; let o = void 0; var c; if (typeof b ===
'string')c = !1; else { var i = h[f.charAt(0)]; if (i)o = f.match(i[1]), b = i[0]; else { for (c = 0; c < t; ++c) if (i = m[c], o = f.match(i[1])) { b = i[0]; break }o || (b = 'pln') } if ((c = b.length >= 5 && b.substring(0, 5) === 'lang-') && !(o && typeof o[1] === 'string'))c = !1, b = 'src'; c || (r[f] = b) }i = d; d += f.length; if (c) { c = o[1]; let j = f.indexOf(c); let k = j + c.length; o[2] && (k = f.length - o[2].length, j = k - c.length); b = b.substring(5); B(l + i, f.substring(0, j), e, p); B(l + i + j, c, C(b, c), p); B(l + i + k, f.substring(k), e, p) } else p.push(l + i, b)
      }a.e = p
    } var h = {}; let y; (function () {
      for (var e = a.concat(m),
        l = [], p = {}, d = 0, g = e.length; d < g; ++d) { let r = e[d]; let n = r[3]; if (n) for (let k = n.length; --k >= 0;)h[n.charAt(k)] = r; r = r[1]; n = '' + r; p.hasOwnProperty(n) || (l.push(r), p[n] = q) }l.push(/[\S\s]/); y = L(l)
    })(); var t = m.length; return e
  } function u (a) {
    const m = []; const e = []; a.tripleQuotedStrings
      ? m.push(['str', /^(?:'''(?:[^'\\]|\\[\S\s]|''?(?=[^']))*(?:'''|$)|"""(?:[^"\\]|\\[\S\s]|""?(?=[^"]))*(?:"""|$)|'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$))/, q, "'\""])
      : a.multiLineStrings
        ? m.push(['str', /^(?:'(?:[^'\\]|\\[\S\s])*(?:'|$)|"(?:[^"\\]|\\[\S\s])*(?:"|$)|`(?:[^\\`]|\\[\S\s])*(?:`|$))/,
          q, "'\"`"])
        : m.push(['str', /^(?:'(?:[^\n\r'\\]|\\.)*(?:'|$)|"(?:[^\n\r"\\]|\\.)*(?:"|$))/, q, "\"'"]); a.verbatimStrings && e.push(['str', /^@"(?:[^"]|"")*(?:"|$)/, q]); let h = a.hashComments; h && (a.cStyleComments
      ? (h > 1 ? m.push(['com', /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, q, '#']) : m.push(['com', /^#(?:(?:define|elif|else|endif|error|ifdef|include|ifndef|line|pragma|undef|warning)\b|[^\n\r]*)/, q, '#']), e.push(['str', /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h|[a-z]\w*)>/, q]))
      : m.push(['com', /^#[^\n\r]*/,
        q, '#'])); a.cStyleComments && (e.push(['com', /^\/\/[^\n\r]*/, q]), e.push(['com', /^\/\*[\S\s]*?(?:\*\/|$)/, q])); a.regexLiterals && e.push(['lang-regex', /^(?:^^\.?|[!+-]|!=|!==|#|%|%=|&|&&|&&=|&=|\(|\*|\*=|\+=|,|-=|->|\/|\/=|:|::|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|[?@[^]|\^=|\^\^|\^\^=|{|\||\|=|\|\||\|\|=|~|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\s*(\/(?=[^*/])(?:[^/[\\]|\\[\S\s]|\[(?:[^\\\]]|\\[\S\s])*(?:]|$))+\/)/]); (h = a.types) && e.push(['typ', h]); a = ('' + a.keywords).replace(/^ | $/g,
      ''); a.length && e.push(['kwd', RegExp('^(?:' + a.replace(/[\s,]+/g, '|') + ')\\b'), q]); m.push(['pln', /^\s+/, q, ' \r\n\t\xa0']); e.push(['lit', /^@[$_a-z][\w$@]*/i, q], ['typ', /^(?:[@_]?[A-Z]+[a-z][\w$@]*|\w+_t\b)/, q], ['pln', /^[$_a-z][\w$@]*/i, q], ['lit', /^(?:0x[\da-f]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+-]?\d+)?)[a-z]*/i, q, '0123456789'], ['pln', /^\\[\S\s]?/, q], ['pun', /^.[^\s\w"-$'./@\\`]*/, q]); return x(m, e)
  } function D (a, m) {
    function e (a) {
      switch (a.nodeType) {
        case 1:if (k.test(a.className)) break; if (a.nodeName === 'BR') {
          h(a),
          a.parentNode && a.parentNode.removeChild(a)
        } else for (a = a.firstChild; a; a = a.nextSibling)e(a); break; case 3:case 4:if (p) { let b = a.nodeValue; const d = b.match(t); if (d) { const c = b.substring(0, d.index); a.nodeValue = c; (b = b.substring(d.index + d[0].length)) && a.parentNode.insertBefore(s.createTextNode(b), a.nextSibling); h(a); c || a.parentNode.removeChild(a) } }
      }
    } function h (a) {
      function b (a, d) { const e = d ? a.cloneNode(!1) : a; var f = a.parentNode; if (f) { var f = b(f, 1); let g = a.nextSibling; f.appendChild(e); for (let h = g; h; h = g)g = h.nextSibling, f.appendChild(h) } return e }
      for (;!a.nextSibling;) if (a = a.parentNode, !a) return; for (var a = b(a.nextSibling, 0), e; (e = a.parentNode) && e.nodeType === 1;)a = e; d.push(a)
    } var k = /(?:^|\s)nocode(?:\s|$)/; var t = /\r\n?|\n/; var s = a.ownerDocument; let l; a.currentStyle ? l = a.currentStyle.whiteSpace : window.getComputedStyle && (l = s.defaultView.getComputedStyle(a, q).getPropertyValue('white-space')); var p = l && l.substring(0, 3) === 'pre'; for (l = s.createElement('LI'); a.firstChild;)l.appendChild(a.firstChild); for (var d = [l], g = 0; g < d.length; ++g)e(d[g]); m === (m | 0) && d[0].setAttribute('value',
      m); const r = s.createElement('OL'); r.className = 'linenums'; for (var n = Math.max(0, m - 1 | 0) || 0, g = 0, z = d.length; g < z; ++g)l = d[g], l.className = 'L' + (g + n) % 10, l.firstChild || l.appendChild(s.createTextNode('\xa0')), r.appendChild(l); a.appendChild(r)
  } function k (a, m) { for (let e = m.length; --e >= 0;) { const h = m[e]; A.hasOwnProperty(h) ? window.console && console.warn('cannot override language handler %s', h) : A[h] = a } } function C (a, m) { if (!a || !A.hasOwnProperty(a))a = /^\s*</.test(m) ? 'default-markup' : 'default-code'; return A[a] } function E (a) {
    var m =
a.g; try {
      var e = M(a.h); var h = e.a; a.a = h; a.c = e.c; a.d = 0; C(m, h)(a); const k = /\bMSIE\b/.test(navigator.userAgent); var m = /\n/g; const t = a.a; const s = t.length; var e = 0; const l = a.c; const p = l.length; var h = 0; const d = a.e; let g = d.length; var a = 0; d[g] = s; let r, n; for (n = r = 0; n < g;)d[n] !== d[n + 2] ? (d[r++] = d[n++], d[r++] = d[n++]) : n += 2; g = r; for (n = r = 0; n < g;) { for (var z = d[n], f = d[n + 1], b = n + 2; b + 2 <= g && d[b + 1] === f;)b += 2; d[r++] = z; d[r++] = f; n = b } for (d.length = r; h < p;) {
        const o = l[h + 2] || s; const c = d[a + 2] || s; var b = Math.min(o, c); let i = l[h + 1]; var j; if (i.nodeType !== 1 && (j = t.substring(e, b))) {
          k && (j = j.replace(m, '\r')); i.nodeValue =
j; const u = i.ownerDocument; const v = u.createElement('SPAN'); v.className = d[a + 1]; const x = i.parentNode; x.replaceChild(v, i); v.appendChild(i); e < o && (l[h + 1] = i = u.createTextNode(t.substring(b, o)), x.insertBefore(i, v.nextSibling))
        }e = b; e >= o && (h += 2); e >= c && (a += 2)
      }
    } catch (w) { 'console' in window && console.log(w && w.stack ? w.stack : w) }
  } var v = ['break,continue,do,else,for,if,return,while']; var w = [[v, 'auto,case,char,const,default,double,enum,extern,float,goto,int,long,register,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile'],
    'catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof']; const F = [w, 'alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,dynamic_cast,explicit,export,friend,inline,late_check,mutable,namespace,nullptr,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where']; const G = [w, 'abstract,boolean,byte,extends,final,finally,implements,import,instanceof,null,native,package,strictfp,super,synchronized,throws,transient']
  const H = [G, 'as,base,by,checked,decimal,delegate,descending,dynamic,event,fixed,foreach,from,group,implicit,in,interface,internal,into,is,lock,object,out,override,orderby,params,partial,readonly,ref,sbyte,sealed,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,var']; var w = [w, 'debugger,eval,export,function,get,null,set,undefined,var,with,Infinity,NaN']; const I = [v, 'and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None']
  const J = [v, 'alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END']; var v = [v, 'case,done,elif,esac,eval,fi,function,in,local,set,then,until']; const K = /^(DIR|FILE|vector|(de|priority_)?queue|list|stack|(const_)?iterator|(multi)?(set|map)|bitset|u?(int|float)\d*)/; const N = /\S/; const O = u({
    keywords: [F, H, w, 'caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END' +
I, J, v],
    hashComments: !0,
    cStyleComments: !0,
    multiLineStrings: !0,
    regexLiterals: !0
  }); var A = {}; k(O, ['default-code']); k(x([], [['pln', /^[^<?]+/], ['dec', /^<!\w[^>]*(?:>|$)/], ['com', /^<\!--[\S\s]*?(?:--\>|$)/], ['lang-', /^<\?([\S\s]+?)(?:\?>|$)/], ['lang-', /^<%([\S\s]+?)(?:%>|$)/], ['pun', /^(?:<[%?]|[%?]>)/], ['lang-', /^<xmp\b[^>]*>([\S\s]+?)<\/xmp\b[^>]*>/i], ['lang-js', /^<script\b[^>]*>([\S\s]*?)(<\/script\b[^>]*>)/i], ['lang-css', /^<style\b[^>]*>([\S\s]*?)(<\/style\b[^>]*>)/i], ['lang-in.tag', /^(<\/?[a-z][^<>]*>)/i]]),
    ['default-markup', 'htm', 'html', 'mxml', 'xhtml', 'xml', 'xsl']); k(x([['pln', /^\s+/, q, ' \t\r\n'], ['atv', /^(?:"[^"]*"?|'[^']*'?)/, q, "\"'"]], [['tag', /^^<\/?[a-z](?:[\w-.:]*\w)?|\/?>$/i], ['atn', /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i], ['lang-uq.val', /^=\s*([^\s"'>]*(?:[^\s"'/>]|\/(?=\s)))/], ['pun', /^[/<->]+/], ['lang-js', /^on\w+\s*=\s*"([^"]+)"/i], ['lang-js', /^on\w+\s*=\s*'([^']+)'/i], ['lang-js', /^on\w+\s*=\s*([^\s"'>]+)/i], ['lang-css', /^style\s*=\s*"([^"]+)"/i], ['lang-css', /^style\s*=\s*'([^']+)'/i], ['lang-css',
    /^style\s*=\s*([^\s"'>]+)/i]]), ['in.tag']); k(x([], [['atv', /^[\S\s]+/]]), ['uq.val']); k(u({ keywords: F, hashComments: !0, cStyleComments: !0, types: K }), ['c', 'cc', 'cpp', 'cxx', 'cyc', 'm']); k(u({ keywords: 'null,true,false' }), ['json']); k(u({ keywords: H, hashComments: !0, cStyleComments: !0, verbatimStrings: !0, types: K }), ['cs']); k(u({ keywords: G, cStyleComments: !0 }), ['java']); k(u({ keywords: v, hashComments: !0, multiLineStrings: !0 }), ['bsh', 'csh', 'sh']); k(u({ keywords: I, hashComments: !0, multiLineStrings: !0, tripleQuotedStrings: !0 }),
    ['cv', 'py']); k(u({ keywords: 'caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END', hashComments: !0, multiLineStrings: !0, regexLiterals: !0 }), ['perl', 'pl', 'pm']); k(u({ keywords: J, hashComments: !0, multiLineStrings: !0, regexLiterals: !0 }), ['rb']); k(u({ keywords: w, cStyleComments: !0, regexLiterals: !0 }), ['js']); k(u({
    keywords: 'all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,true,try,unless,until,when,while,yes',
    hashComments: 3,
    cStyleComments: !0,
    multilineStrings: !0,
    tripleQuotedStrings: !0,
    regexLiterals: !0
  }), ['coffee']); k(x([], [['str', /^[\S\s]+/]]), ['regex']); window.prettyPrintOne = function (a, m, e) { const h = document.createElement('PRE'); h.innerHTML = a; e && D(h, e); E({ g: m, i: e, h }); return h.innerHTML }; window.prettyPrint = function (a) {
    function m () {
      for (let e = window.PR_SHOULD_USE_CONTINUATION ? l.now() + 250 : Infinity; p < h.length && l.now() < e; p++) {
        const n = h[p]; var k = n.className; if (k.indexOf('prettyprint') >= 0) {
          var k = k.match(g); var f; var b; if (b =
!k) { b = n; for (var o = void 0, c = b.firstChild; c; c = c.nextSibling) var i = c.nodeType, o = i === 1 ? o ? b : c : i === 3 ? N.test(c.nodeValue) ? b : o : o; b = (f = o === b ? void 0 : o) && f.tagName === 'CODE' }b && (k = f.className.match(g)); k && (k = k[1]); b = !1; for (o = n.parentNode; o; o = o.parentNode) if ((o.tagName === 'pre' || o.tagName === 'code' || o.tagName === 'xmp') && o.className && o.className.indexOf('prettyprint') >= 0) { b = !0; break }b || ((b = (b = n.className.match(/\blinenums\b(?::(\d+))?/)) ? b[1] && b[1].length ? +b[1] : !0 : !1) && D(n, b), d = { g: k, h: n, i: b }, E(d))
        }
      }p < h.length
        ? setTimeout(m,
          250)
        : a && a()
    } for (var e = [document.getElementsByTagName('pre'), document.getElementsByTagName('code'), document.getElementsByTagName('xmp')], h = [], k = 0; k < e.length; ++k) for (let t = 0, s = e[k].length; t < s; ++t)h.push(e[k][t]); var e = q; var l = Date; l.now || (l = { now: function () { return +new Date() } }); var p = 0; let d; var g = /\blang(?:uage)?-([\w.]+)(?!\S)/; m()
  }; window.PR = {
    createSimpleLexer: x,
    registerLangHandler: k,
    sourceDecorator: u,
    PR_ATTRIB_NAME: 'atn',
    PR_ATTRIB_VALUE: 'atv',
    PR_COMMENT: 'com',
    PR_DECLARATION: 'dec',
    PR_KEYWORD: 'kwd',
    PR_LITERAL: 'lit',
    PR_NOCODE: 'nocode',
    PR_PLAIN: 'pln',
    PR_PUNCTUATION: 'pun',
    PR_SOURCE: 'src',
    PR_STRING: 'str',
    PR_TAG: 'tag',
    PR_TYPE: 'typ'
  }
})();

/*
 HTML5 Shiv v3.6.2pre | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
 Uncompressed source: https://github.com/aFarkas/html5shiv
*/
(function (l, f) {
  function m () { const a = e.elements; return typeof a === 'string' ? a.split(' ') : a } function i (a) { let b = n[a[o]]; b || (b = {}, h++, a[o] = h, n[h] = b); return b } function p (a, b, c) { b || (b = f); if (g) return b.createElement(a); c || (c = i(b)); b = c.cache[a] ? c.cache[a].cloneNode() : r.test(a) ? (c.cache[a] = c.createElem(a)).cloneNode() : c.createElem(a); return b.canHaveChildren && !s.test(a) ? c.frag.appendChild(b) : b } function t (a, b) {
    if (!b.cache)b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()
    a.createElement = function (c) { return !e.shivMethods ? b.createElem(c) : p(c, a, b) }; a.createDocumentFragment = Function('h,f', 'return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(' + m().join().replace(/\w+/g, function (a) { b.createElem(a); b.frag.createElement(a); return 'c("' + a + '")' }) + ');return n}')(e, b.frag)
  } function q (a) {
    a || (a = f); const b = i(a); if (e.shivCSS && !j && !b.hasCSS) {
      let c; let d = a; c = d.createElement('p'); d = d.getElementsByTagName('head')[0] || d.documentElement; c.innerHTML = 'x<style>article,aside,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}</style>'
      c = d.insertBefore(c.lastChild, d.firstChild); b.hasCSS = !!c
    }g || t(a, b); return a
  } const k = l.html5 || {}; var s = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i; var r = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i; let j; var o = '_html5shiv'; var h = 0; var n = {}; let g; (function () {
    try {
      const a = f.createElement('a'); a.innerHTML = '<xyz></xyz>'; j = 'hidden' in a; let b; if (!(b = a.childNodes.length == 1)) {
        f.createElement('a'); const c = f.createDocumentFragment(); b = typeof c.cloneNode === 'undefined' ||
typeof c.createDocumentFragment === 'undefined' || typeof c.createElement === 'undefined'
      }g = b
    } catch (d) { g = j = !0 }
  })(); var e = {
    elements: k.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup main mark meter nav output progress section summary time video',
    version: '3.6.2pre',
    shivCSS: !1 !== k.shivCSS,
    supportsUnknownElements: g,
    shivMethods: !1 !== k.shivMethods,
    type: 'default',
    shivDocument: q,
    createElement: p,
    createDocumentFragment: function (a, b) {
      a || (a = f); if (g) return a.createDocumentFragment()
      for (var b = b || i(a), c = b.frag.cloneNode(), d = 0, e = m(), h = e.length; d < h; d++)c.createElement(e[d]); return c
    }
  }; l.html5 = e; q(f)
})(this, document)

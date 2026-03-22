(function(){
  'use strict';

  function parseDateValue(dateStr){
    if(!dateStr) return null;
    if(String(dateStr).indexOf('/') !== -1){
      var parts = String(dateStr).trim().split('/');
      if(parts.length >= 2){
        var day = parseInt(parts[0],10);
        var month = parseInt(parts[1],10) - 1;
        var year = parts[2] ? parts[2].trim() : '';
        if(year.length === 2) year = 2000 + parseInt(year,10);
        else if(year.length === 0) year = new Date().getFullYear();
        else year = parseInt(year,10);
        if(!isNaN(day) && !isNaN(month) && !isNaN(year)) return new Date(year, month, day);
      }
      return null;
    }
    var p = Date.parse(dateStr);
    return isNaN(p) ? null : new Date(p);
  }

  function daySuffix(day){
    if(day >= 11 && day <= 13) return 'th';
    var last = day % 10;
    if(last === 1) return 'st';
    if(last === 2) return 'nd';
    if(last === 3) return 'rd';
    return 'th';
  }

  function formatLongDate(dateObj){
    if(!dateObj) return '';
    var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return weekdays[dateObj.getDay()] + ' ' + dateObj.getDate() + daySuffix(dateObj.getDate()) + ' of ' + months[dateObj.getMonth()] + ', ' + dateObj.getFullYear();
  }

  function formatTime(timeStr){
    if(!timeStr) return '';
    var s = String(timeStr).trim();
    var m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*([APMapm]{2})?$/);
    if(!m) return s;
    var hh = parseInt(m[1], 10);
    var mm = m[2];
    var ampm = (m[3] || '').toUpperCase();
    if(ampm === 'AM' || ampm === 'PM'){
      if(hh === 0) hh = 12;
      if(hh > 12) hh = hh % 12;
      return hh + '.' + mm + ampm;
    }
    var suffix = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12;
    if(hh === 0) hh = 12;
    return hh + '.' + mm + suffix;
  }

  function parseEvDate(ev){
    var dateStr = ev['Date'] || ev['date'] || '';
    var timeStr = ev['Start Time'] || ev['StartTime'] || ev['Start'] || '';
    var dt = parseDateValue(dateStr);
    if(dt && timeStr){
      var m = String(timeStr).match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([APMapm\.]*)/);
      if(m){
        var hh = parseInt(m[1],10);
        var mm = parseInt(m[2],10) || 0;
        var ss = m[3] ? parseInt(m[3],10) : 0;
        var ap = (m[4] || '').toLowerCase();
        if(ap.indexOf('p') !== -1 && hh < 12) hh += 12;
        if(ap.indexOf('a') !== -1 && hh === 12) hh = 0;
        dt.setHours(hh, mm, ss, 0);
      }
    }
    return dt ? dt.getTime() : null;
  }

  function renderEvents(events, tpl, grid){
    if(!tpl || !grid || !Array.isArray(events)) return;
    events.forEach(function(ev){
      var node = tpl.content.cloneNode(true);
      var cardEl = node.querySelector('.event-card');

      var img = node.querySelector('.event-image img');
      var imgSrc = ev['Image'] || ev['image'] || ev.image || '';
      if(img) img.src = imgSrc;

      var badge = node.querySelector('.event-badge');
      var status = ev['Status'] || ev['status'] || '';
      if(badge){
        if(String(status).toLowerCase() === 'sold-out' || String(status).toLowerCase() === 'sold out'){
          badge.textContent = 'Sold Out';
          badge.style.display = '';
        } else {
          badge.textContent = '';
          badge.style.display = 'none';
        }
      }

      var speakerEl = node.querySelector('.event-speaker');
      var speakerName = ev['Speaker'] || ev['speaker'] || '';
      var speakerWebsite = ev['Speaker Website'] || ev['speakerWebsite'] || '';
      var title = node.querySelector('.event-title');
      var titleText = ev['Talk Title'] || ev['TalkTitle'] || ev['title'] || ev['Talk_Title'] || '';
      var isTbcTitle = String(titleText).trim().toUpperCase() === 'TBC';
      if(title) title.textContent = isTbcTitle ? speakerName : titleText;

      if(speakerEl){
        if(isTbcTitle){
          speakerEl.textContent = '';
          speakerEl.style.display = 'none';
        } else if(speakerWebsite){
          speakerEl.innerHTML = '<a href="' + (speakerWebsite.indexOf('http')===0?speakerWebsite:'https://'+speakerWebsite) + '" target="_blank" rel="noopener noreferrer">' + (speakerName || '') + '</a>';
        } else {
          speakerEl.textContent = speakerName;
        }
      }

      var dateEl = node.querySelector('.event-date');
      var dateText = ev['Date'] || ev['date'] || '';
      var startTime = ev['Start Time'] || ev['StartTime'] || ev['Start'] || '';
      if(dateEl){
        var parsedDate = parseDateValue(dateText);
        var prettyDate = formatLongDate(parsedDate);
        var prettyTime = formatTime(startTime);
        dateEl.textContent = prettyTime ? ((prettyDate || dateText) + ' — ' + prettyTime) : (prettyDate || dateText);
      }

      var loc = node.querySelector('.event-location');
      var venue = ev['Venue'] || ev['Venue Name'] || '';
      var address = ev['Address'] || '';
      var city = ev['City'] || '';
      var postcode = ev['Postcode'] || '';
      var locationText = '';
      if(venue) locationText += venue;
      if(address) locationText += (locationText ? ', ' : '') + address;
      if(city) locationText += (locationText ? ', ' : '') + city;
      if(postcode) locationText += (locationText ? ', ' : '') + postcode;
      if(loc) loc.textContent = locationText;

      var info = node.querySelector('.event-info');
      var infoToggle = node.querySelector('.event-info-toggle');
      var blurb = ev['Talk Blurb'] || ev['TalkBlurb'] || ev['blurb'] || '';
      if(info){
        var parts = String(blurb).split(/\r?\n+/).map(function(t){ return t.trim(); }).filter(Boolean);
        var fullText = parts.join('\n\n');
        info.innerHTML = '';
        var infoContent = document.createElement('div');
        infoContent.className = 'event-info-content is-clamped';
        infoContent.textContent = fullText;
        info.appendChild(infoContent);

        if(infoToggle && fullText){
          infoToggle.style.display = 'inline-block';
          infoToggle.addEventListener('click', function(){
            infoContent.classList.remove('is-clamped');
            infoToggle.style.display = 'none';
            if(cardEl) cardEl.classList.add('blurb-expanded');
          });
        }
      }

      var bookingWrap = node.querySelector('.event-booking');
      var inPersonBtn = node.querySelector('.event-button-inperson');
      var onlineBtn = node.querySelector('.event-button-online');
      var inPerson = ev['In Person Eventbrite Link'] || ev['In Person Eventbrite'] || '';
      var online = ev['Online Eventbrite Link'] || ev['Online Eventbrite'] || '';
      var hasBooking = false;
      if(inPersonBtn){
        if(inPerson){ inPersonBtn.href = inPerson; inPersonBtn.style.display = 'inline-block'; hasBooking = true; }
        else inPersonBtn.style.display = 'none';
      }
      if(onlineBtn){
        if(online){ onlineBtn.href = online; onlineBtn.style.display = 'inline-block'; hasBooking = true; }
        else onlineBtn.style.display = 'none';
      }
      if(bookingWrap && !hasBooking) bookingWrap.style.display = 'none';

      grid.appendChild(node);
    });
  }

  function fetchJson(url){
    return fetch(url, { cache: 'no-store' }).then(function(res){
      if(!res.ok){
        var err = new Error('HTTP ' + res.status);
        err.status = res.status;
        throw err;
      }
      return res.json();
    });
  }

  function initGrid(cfg){
    var grid = document.getElementById(cfg.gridId);
    var tpl = document.getElementById(cfg.templateId);
    if(!grid || !tpl) return;
    if(grid.children.length > 0 || grid.getAttribute('data-loaded') === '1' || grid.getAttribute('data-loading') === '1') return;

    grid.setAttribute('data-loading', '1');
    var attrUrl = grid.getAttribute('data-src');
    var url = window.NS_EVENT_DATA_URL || attrUrl || '/wp-content/uploads/data.json';
    var restUrl = '/wp-json/custom/v1/data';

    fetchJson(url)
      .catch(function(err){
        if(err && (err.status === 403 || err.name === 'TypeError' || (err.message && err.message.indexOf('HTTP 403') !== -1))){
          var cbUrl = url + (url.indexOf('?') === -1 ? '?_cb=' + Date.now() : '&_cb=' + Date.now());
          return fetchJson(cbUrl).catch(function(err2){
            if(err2 && (err2.status === 403 || (err2.message && err2.message.indexOf('HTTP 403') !== -1))) return fetchJson(restUrl);
            throw err2;
          });
        }
        throw err;
      })
      .then(function(data){
        if(Array.isArray(data)){
          var now = new Date();
          now.setHours(0, 0, 0, 0);
          var nowMs = now.getTime();

          data = data.filter(function(ev){
            var t = parseEvDate(ev);
            if(t === null) return false;
            return cfg.mode === 'past' ? (t < nowMs) : (t >= nowMs);
          });

          data.sort(function(a, b){
            var ta = parseEvDate(a);
            var tb = parseEvDate(b);
            if(ta === null && tb === null) return 0;
            if(ta === null) return 1;
            if(tb === null) return -1;
            return cfg.mode === 'past' ? (tb - ta) : (ta - tb);
          });
        }

        renderEvents(data, tpl, grid);
        grid.setAttribute('data-loaded', '1');
        grid.removeAttribute('data-loading');
      })
      .catch(function(err){
        grid.removeAttribute('data-loading');
        console.error('Failed to load event data from', url, err);
      });
  }

  function boot(){
    initGrid({ gridId: 'ns-event-grid', templateId: 'ns-event-template', mode: 'upcoming' });
    initGrid({ gridId: 'ns-past-event-grid', templateId: 'ns-past-event-template', mode: 'past' });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', boot);
})();

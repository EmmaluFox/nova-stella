(function(){
  'use strict';
  function renderEvents(events){
    var tpl = document.getElementById('ns-event-template');
    var grid = document.getElementById('ns-event-grid');
    if(!tpl || !grid || !Array.isArray(events)) return;
    events.forEach(function(ev){
      var node = tpl.content.cloneNode(true);
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

      var title = node.querySelector('.event-title');
      var titleText = ev['Talk Title'] || ev['TalkTitle'] || ev['title'] || ev['Talk_Title'] || '';
      if(title) title.textContent = titleText;

      var speakerEl = node.querySelector('.event-speaker');
      var speakerName = ev['Speaker'] || ev['speaker'] || '';
      var speakerWebsite = ev['Speaker Website'] || ev['Speaker Website'] || ev['Speaker Website'] || '';
      if(speakerEl){
        if(speakerWebsite){
          speakerEl.innerHTML = '<a href="' + (speakerWebsite.indexOf('http')===0?speakerWebsite:'https://'+speakerWebsite) + '" target="_blank" rel="noopener noreferrer">' + (speakerName || '') + '</a>';
        } else {
          speakerEl.textContent = speakerName;
        }
      }

      var dateEl = node.querySelector('.event-date');
      var dateText = ev['Date'] || ev['date'] || '';
      var startTime = ev['Start Time'] || ev['StartTime'] || ev['Start'] || '';
      if(dateEl) dateEl.textContent = startTime ? (dateText + ' — ' + startTime) : dateText;

      var loc = node.querySelector('.event-location');
      var venue = ev['Venue'] || ev['Venue Name'] || '';
      var address = ev['Address'] || '';
      var city = ev['City'] || '';
      var postcode = ev['Postcode'] || ev['Postcode'] || '';
      var locationText = '';
      if(venue) locationText += venue;
      if(address) locationText += (locationText? ', ' : '') + address;
      if(city) locationText += (locationText? ', ' : '') + city;
      if(postcode) locationText += (locationText? ', ' : '') + postcode;
      if(loc) loc.textContent = locationText;

      var info = node.querySelector('.event-info');
      var blurb = ev['Talk Blurb'] || ev['Talk Blurb'] || ev['TalkBlurb'] || ev['blurb'] || '';
      if(info) info.textContent = blurb;

      var a = node.querySelector('.event-button');
      var inPerson = ev['In Person Eventbrite Link'] || ev['In Person Eventbrite'] || '';
      var online = ev['Online Eventbrite Link'] || ev['Online Eventbrite'] || '';
      var fallback = ev['link'] || ev['Link'] || '#';
      var href = inPerson || online || fallback || '#';
      if(a) a.href = href;

      grid.appendChild(node);
    });
  }

  function loadData(){
    var grid = document.getElementById('ns-event-grid');
    var attrUrl = grid && grid.getAttribute('data-src');
    var url = window.NS_EVENT_DATA_URL || attrUrl || '/wp-content/uploads/data.json';
    var restUrl = '/wp-json/custom/v1/data';

    function fetchJson(u){
      return fetch(u, {cache: 'no-store'}).then(function(res){
        if(!res.ok) {
          var err = new Error('HTTP ' + res.status);
          err.status = res.status;
          throw err;
        }
        return res.json();
      });
    }

    fetchJson(url)
      .catch(function(err){
        if(err && (err.status === 403 || (err.message && err.message.indexOf('HTTP 403') !== -1) || err.name === 'TypeError')){
          var cbUrl = url + (url.indexOf('?') === -1 ? '?_cb=' + Date.now() : '&_cb=' + Date.now());
          return fetchJson(cbUrl).catch(function(err2){
            if(err2 && (err2.status === 403 || (err2.message && err2.message.indexOf('HTTP 403') !== -1))) {
              return fetchJson(restUrl);
            }
            throw err2;
          });
        }
        throw err;
      })
      .then(function(data){
        if(Array.isArray(data)){
          function parseEvDate(ev){
            var dateStr = ev['Date'] || ev['date'] || '';
            var timeStr = ev['Start Time'] || ev['StartTime'] || ev['Start'] || '';
            var dt = null;
            if(dateStr.indexOf('/') !== -1){
              var parts = dateStr.trim().split('/');
              if(parts.length >= 2){
                var day = parseInt(parts[0],10);
                var month = parseInt(parts[1],10) - 1;
                var year = parts[2] ? parts[2].trim() : '';
                if(year.length === 2) year = 2000 + parseInt(year,10);
                else if(year.length === 0) year = new Date().getFullYear();
                else year = parseInt(year,10);
                if(!isNaN(day) && !isNaN(month) && !isNaN(year)){
                  dt = new Date(year, month, day);
                }
              }
            } else if(dateStr){
              var p = Date.parse(dateStr);
              if(!isNaN(p)) dt = new Date(p);
            }
            if(dt && timeStr){
              var m = timeStr.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([APMapm\.]*)/);
              if(m){
                var hh = parseInt(m[1],10);
                var mm = parseInt(m[2],10) || 0;
                var ss = m[3] ? parseInt(m[3],10) : 0;
                var ampm = (m[4] || '').toLowerCase();
                if(ampm.indexOf('p') !== -1 && hh < 12) hh += 12;
                if(ampm.indexOf('a') !== -1 && hh === 12) hh = 0;
                dt.setHours(hh, mm, ss, 0);
              } else {
                var m2 = timeStr.match(/^(\d{1,2}):(\d{2})$/);
                if(m2) dt.setHours(parseInt(m2[1],10), parseInt(m2[2],10), 0, 0);
              }
            }
            return dt ? dt.getTime() : null;
          }

          data.sort(function(a,b){
            var ta = parseEvDate(a);
            var tb = parseEvDate(b);
            if(ta === null && tb === null) return 0;
            if(ta === null) return 1;
            if(tb === null) return -1;
            return tb - ta;
          });
        }
        renderEvents(data);
      })
      .catch(function(err){
        console.error('Failed to load event data from', url, err);
      });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', loadData); else loadData();
})();

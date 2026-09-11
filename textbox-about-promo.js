(function(){
  function findNearestFutureEvent(events){
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    var nowMs = now.getTime();
    var futureEvents = events.filter(function(ev){
      var dateStr = ev['Date'] || '';
      if(!dateStr) return false;
      var dt = new Date(Date.parse(dateStr));
      return dt.getTime() >= nowMs;
    });
    if(futureEvents.length === 0) return null;
    futureEvents.sort(function(a, b){
      return new Date(Date.parse(a['Date'])).getTime() - new Date(Date.parse(b['Date'])).getTime();
    });
    return futureEvents[0];
  }

  function loadPromoCard(){
    function monthDataUrl(d){
      var y = d.getFullYear();
      var m = String(d.getMonth() + 1).padStart(2, '0');
      return 'https://novastella.co.uk/wp-content/uploads/' + y + '/' + m + '/data.json';
    }
    var now = new Date();
    var dataUrls = [
      monthDataUrl(now),
      monthDataUrl(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    ];
    var fallbackPromoImg = 'https://novastella.co.uk/wp-content/uploads/2026/03/Logo-Black-Background.png';
    function fetchJson(u){
      return fetch(u, {cache: 'no-store'}).then(function(res){
        if(!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      });
    }
    fetchJson(dataUrls[0]).catch(function(){
      return fetchJson(dataUrls[1]);
    })
      .then(function(data){
        if(!Array.isArray(data)) return;
        var event = findNearestFutureEvent(data);
        if(!event) return;

        var inPersonUrl = event['In Person Eventbrite Link'] || '';
        var onlineUrl = event['Online Eventbrite Link'] || '';
        var fallbackUrl = '/upcoming-events/';
        var inPersonEventUrl = inPersonUrl || fallbackUrl;
        var onlineEventUrl = onlineUrl || inPersonUrl || fallbackUrl;

        var nextLiveLink = document.getElementById('ns-next-live-event-link');
        if(nextLiveLink) nextLiveLink.href = inPersonEventUrl;

        var liveStreamingLink = document.getElementById('ns-live-streaming-link');
        if(liveStreamingLink) liveStreamingLink.href = onlineEventUrl;

        var img = document.getElementById('ns-promo-img');
        if(img){
          img.src = event['Promo Card URL'] || fallbackPromoImg;
          img.style.display = 'block';
        }
        var link = document.getElementById('ns-promo-link');
        if(link) link.href = inPersonEventUrl;
      })
      .catch(function(err){
        console.error('NS promo card load failed:', err);
      });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', loadPromoCard);
  } else {
    loadPromoCard();
  }
})();

const puppeteer = require('puppeteer');
(async()=>{
  const url = 'https://novastella.co.uk/upcoming-events/';
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push({type: 'console', text: msg.text()}));
  page.on('pageerror', err => logs.push({type: 'pageerror', text: err.message}));
  page.on('requestfailed', r => logs.push({type: 'requestfailed', url: r.url(), reason: r.failure().errorText}));
  page.on('response', resp => {
    const status = resp.status();
    if(status >= 400) logs.push({type: 'response-error', url: resp.url(), status});
  });
  await page.setViewport({width:1200, height:900});
  try{
    await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000});
    await new Promise(function(r){setTimeout(r,1500);});
    const html = await page.content();
    await page.screenshot({path: 'puppeteer_upcoming.png', fullPage: true});
    console.log('PAGE_HTML_SNIPPET_START');
    console.log(html.slice(0, 8000));
    console.log('PAGE_HTML_SNIPPET_END');
  } catch(e){
    logs.push({type:'goto-error', text: e.message});
  }
  console.log('CONSOLE_LOGS_START');
  console.log(JSON.stringify(logs, null, 2));
  console.log('CONSOLE_LOGS_END');
  await browser.close();
})();
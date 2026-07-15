const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML_PATH = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
const SCREENSHOT_DIR = path.resolve('screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let errors = [];
let testResults = [];

async function answerAllQuestions(page, universalCount, sceneCount) {
  for (let i = 0; i < universalCount; i++) {
    const opts = await page.$$('.opt');
    if (opts.length === 0) break;
    await opts[0].click();
    await page.waitForTimeout(200);
  }
  for (let i = 0; i < sceneCount; i++) {
    const opts = await page.$$('.opt');
    if (opts.length === 0) {
      const textareas = await page.$$('.fill-input');
      if (textareas.length > 0) {
        await textareas[0].fill('测试输入');
        await page.waitForTimeout(200);
        const nextBtn = await page.$('.btn-next');
        if (nextBtn) await nextBtn.click();
        await page.waitForTimeout(500);
        continue;
      }
      break;
    }
    await opts[0].click();
    await page.waitForTimeout(200);
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  // Test 1: Professional mode - writing
  console.log('\n=== Test 1: Professional Mode writing ===');
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', err => errors.push('T1: ' + err.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push('T1 console: ' + msg.text()); });

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't1-initial.png') });

    // Select Professional Mode
    const modeCards = await page.$$('.mode-card');
    if (modeCards.length >= 1) await modeCards[0].click();
    await page.waitForTimeout(500);

    // Select writing
    const scenarios = await page.$$('.opt');
    if (scenarios.length >= 1) await scenarios[0].click();
    await page.waitForTimeout(500);

    // Answer all
    await answerAllQuestions(page, 5, 4);

    const promptBox = await page.$('#promptBox');
    const promptText = promptBox ? await promptBox.textContent() : '';

    const badTerms = ['出生信息', 'MBTI', '紫微', '命盘', 'Astrology'];
    const foundBad = badTerms.filter(t => promptText.includes(t));
    const resultVisible = await page.$('.result.visible');

    const passed = !!resultVisible && promptText.length > 50 && foundBad.length === 0;
    testResults.push({ name: 'T1: Pro-writing', passed, details: `chars:${promptText.length} bad:${foundBad.join(',')||'none'}` });
    console.log('  ' + (passed ? 'PASS' : 'FAIL') + ': ' + testResults[testResults.length-1].details);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't1-pro-writing.png'), fullPage: true });
    await page.close();
  }

  // Test 2: Professional mode - custom
  console.log('\n=== Test 2: Professional Mode custom ===');
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', err => errors.push('T2: ' + err.message));

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });
    const modeCards = await page.$$('.mode-card');
    await modeCards[0].click();
    await page.waitForTimeout(500);

    const scenarios = await page.$$('.opt');
    await scenarios[scenarios.length - 1].click(); // custom is last
    await page.waitForTimeout(500);

    await answerAllQuestions(page, 5, 3); // custom has 3 questions

    const resultVisible = await page.$('.result.visible');
    const passed = !!resultVisible;
    testResults.push({ name: 'T2: Pro-custom', passed });
    console.log('  ' + (passed ? 'PASS' : 'FAIL'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't2-pro-custom.png'), fullPage: true });
    await page.close();
  }

  // Test 3: Experimental skip birth
  console.log('\n=== Test 3: Experimental skip birth ===');
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', err => errors.push('T3: ' + err.message));

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });
    const modeCards = await page.$$('.mode-card');
    await modeCards[1].click(); // Experimental
    await page.waitForTimeout(500);

    const skipBtn = await page.$('.btn-skip');
    if (skipBtn) await skipBtn.click();
    await page.waitForTimeout(500);

    const scenarios = await page.$$('.opt');
    await scenarios[0].click();
    await page.waitForTimeout(500);

    await answerAllQuestions(page, 5, 4);

    const resultVisible = await page.$('.result.visible');
    const passed = !!resultVisible;
    testResults.push({ name: 'T3: Exp-skip-birth', passed });
    console.log('  ' + (passed ? 'PASS' : 'FAIL'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't3-exp-skip-birth.png'), fullPage: true });
    await page.close();
  }

  // Test 4: Experimental fill birth
  console.log('\n=== Test 4: Experimental fill birth ===');
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', err => errors.push('T4: ' + err.message));

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });
    const modeCards = await page.$$('.mode-card');
    await modeCards[1].click();
    await page.waitForTimeout(500);

    // Fill birth
    const inputs = await page.$$('input[type="number"]');
    if (inputs.length >= 2) {
      await inputs[0].fill('1995');
      await inputs[1].fill('15');
    }
    const selects = await page.$$('select');
    if (selects.length >= 1) {
      await selects[0].selectOption('6');
    }

    const nextBtn = await page.$('.btn-next');
    if (nextBtn) await nextBtn.click();
    await page.waitForTimeout(500);

    const scenarios = await page.$$('.opt');
    await scenarios[0].click();
    await page.waitForTimeout(500);

    await answerAllQuestions(page, 5, 4);

    const promptBox = await page.$('#promptBox');
    const promptText = promptBox ? await promptBox.textContent() : '';
    const hasDisclaimer = promptText.includes('仅供娱乐') || promptText.includes('Entertainment');
    const resultVisible = await page.$('.result.visible');

    const passed = !!resultVisible && promptText.length > 100 && hasDisclaimer;
    testResults.push({ name: 'T4: Exp-fill-birth', passed, details: 'disclaimer:' + hasDisclaimer });
    console.log('  ' + (passed ? 'PASS' : 'FAIL') + ': ' + testResults[testResults.length-1].details);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't4-exp-fill-birth.png'), fullPage: true });
    await page.close();
  }

  // Test 6: Copy button
  console.log('\n=== Test 6: Copy button ===');
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', err => errors.push('T6: ' + err.message));

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });
    const modeCards = await page.$$('.mode-card');
    await modeCards[0].click();
    await page.waitForTimeout(500);
    const scenarios = await page.$$('.opt');
    await scenarios[0].click();
    await page.waitForTimeout(500);
    await answerAllQuestions(page, 5, 4);

    const copyBtn = await page.$('.btn-copy');
    if (copyBtn) {
      await copyBtn.click();
      await page.waitForTimeout(500);
    }
    const toast = await page.$('.toast.show');
    const passed = !!toast;
    testResults.push({ name: 'T6: Copy', passed, details: 'toast:' + !!toast });
    console.log('  ' + (passed ? 'PASS' : 'FAIL') + ': ' + testResults[testResults.length-1].details);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't6-copy.png'), fullPage: true });
    await page.close();
  }

  // Test 7: Error count
  const realErrors = errors.filter(e => !e.includes('libpng') && !e.includes('iCCP'));
  const t7passed = realErrors.length === 0;
  testResults.push({ name: 'T7: Console errors', passed: t7passed, details: realErrors.length + ' errors: ' + realErrors.join('; ') });
  console.log('\n=== Test 7: Console errors ===');
  console.log('  ' + (t7passed ? 'PASS' : 'FAIL') + ': ' + realErrors.length + ' errors');

  await browser.close();

  // Summary
  console.log('\n=== SUMMARY ===');
  const allPassed = testResults.every(t => t.passed);
  testResults.forEach(t => console.log('  ' + (t.passed ? '✓' : '✗') + ' ' + t.name + (t.details ? ': ' + t.details : '')));
  console.log('\nOverall: ' + (allPassed ? 'ALL PASSED' : 'SOME FAILED'));
  console.log('Console errors: ' + realErrors.length);

  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'test-results.json'), JSON.stringify({ results: testResults, errors: realErrors, passed: allPassed }, null, 2));
  process.exit(allPassed ? 0 : 1);
}

run().catch(e => { console.error('CRASH:', e.message); process.exit(1); });

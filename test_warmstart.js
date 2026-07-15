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

  // ========================
  // Test 1: Professional Mode writing
  // ========================
  console.log('\n=== Test 1: Professional Mode writing ===');
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', err => errors.push('T1: ' + err.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push('T1 console: ' + msg.text()); });

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });

    const modeCards = await page.$$('.mode-card');
    await modeCards[0].click();
    await page.waitForTimeout(500);

    const scenarios = await page.$$('.opt');
    await scenarios[0].click();
    await page.waitForTimeout(500);

    await answerAllQuestions(page, 5, 4);

    const promptText = (await page.locator('#promptBox').textContent()) || '';
    const badTerms = ['出生', 'MBTI', '紫微', '命盘', 'Astrology'];
    const foundBad = badTerms.filter(t => promptText.includes(t));
    const resultVisible = await page.locator('.result.visible').count();

    const passed = resultVisible === 1 && promptText.length > 50 && foundBad.length === 0;
    testResults.push({ name: 'T1: Pro-writing', passed, details: `chars:${promptText.length} bad:${foundBad.join(',')||'none'}` });
    console.log('  ' + (passed ? 'PASS' : 'FAIL') + ': ' + testResults[testResults.length-1].details);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't1-pro-writing.png'), fullPage: true });
    await page.close();
  }

  // ========================
  // Test 2: Professional Mode custom
  // ========================
  console.log('\n=== Test 2: Professional Mode custom ===');
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', err => errors.push('T2: ' + err.message));

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });
    const modeCards = await page.$$('.mode-card');
    await modeCards[0].click();
    await page.waitForTimeout(500);

    const scenarios = await page.$$('.opt');
    await scenarios[scenarios.length - 1].click();
    await page.waitForTimeout(500);

    await answerAllQuestions(page, 5, 3);

    const resultVisible = await page.locator('.result.visible').count();
    const passed = resultVisible === 1;
    testResults.push({ name: 'T2: Pro-custom', passed });
    console.log('  ' + (passed ? 'PASS' : 'FAIL'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't2-pro-custom.png'), fullPage: true });
    await page.close();
  }

  // ========================
  // Test 3: Experimental skip birth
  // ========================
  console.log('\n=== Test 3: Experimental Mode skip birth ===');
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', err => errors.push('T3: ' + err.message));

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });
    const modeCards = await page.$$('.mode-card');
    await modeCards[1].click();
    await page.waitForTimeout(500);

    const skipBtn = await page.$('.btn-skip');
    if (skipBtn) await skipBtn.click();
    await page.waitForTimeout(500);

    const scenarios = await page.$$('.opt');
    await scenarios[0].click();
    await page.waitForTimeout(500);

    await answerAllQuestions(page, 5, 4);

    const resultVisible = await page.locator('.result.visible').count();
    const passed = resultVisible === 1;
    testResults.push({ name: 'T3: Exp-skip-birth', passed });
    console.log('  ' + (passed ? 'PASS' : 'FAIL'));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't3-exp-skip-birth.png'), fullPage: true });
    await page.close();
  }

  // ========================
  // Test 4: Experimental Mode complete birth info
  // ========================
  console.log('\n=== Test 4: Experimental Mode complete birth info ===');
  {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const localErrors = [];
    page.on('pageerror', err => {
      localErrors.push('pageerror: ' + err.message);
      errors.push('T4: ' + err.message);
    });
    page.on('console', msg => {
      if (msg.type() === 'error') {
        localErrors.push('console: ' + msg.text());
        errors.push('T4 console: ' + msg.text());
      }
    });

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });

    const modeCards = await page.$$('.mode-card');
    if (modeCards.length < 2) throw new Error('Experimental mode card not found');
    await modeCards[1].click();
    await page.waitForTimeout(200);

    const numberInputs = await page.$$('input[type="number"]');
    if (numberInputs.length < 2) throw new Error('Birth number inputs not found');
    await numberInputs[0].fill('1995');
    await numberInputs[1].fill('15');

    const selects = await page.$$('select');
    if (selects.length < 4) throw new Error('Birth select inputs not found');
    await selects[0].selectOption('6');
    await selects[1].selectOption('6');
    await selects[2].selectOption({ label: '女' });
    await selects[3].selectOption('ISTJ');

    await page.locator('.btn-next').click();
    await page.waitForTimeout(200);

    const scenarios = await page.$$('.opt');
    if (scenarios.length < 1) throw new Error('Scenario options not found');
    await scenarios[0].click();
    await page.waitForTimeout(200);

    await answerAllQuestions(page, 5, 4);

    const promptText = (await page.locator('#promptBox').textContent()) || '';
    const resultVisible = await page.locator('.result.visible').count();

    const requiredTerms = ['仅供娱乐', '出生信息', '命盘快照', '农历', '命宫', 'MBTI', 'ISTJ'];
    const missingTerms = requiredTerms.filter(term => !promptText.includes(term));

    const passed = resultVisible === 1 && promptText.length > 300 && missingTerms.length === 0 && localErrors.length === 0;

    testResults.push({
      name: 'T4: Exp-complete-birth',
      passed,
      details: `chars:${promptText.length} missing:${missingTerms.join(',')||'none'} errors:${localErrors.length}`,
    });
    console.log('  ' + (passed ? 'PASS' : 'FAIL') + ': ' + testResults[testResults.length-1].details);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't4-exp-complete-birth.png'), fullPage: true });
    await page.close();
  }

  // ========================
  // Test 5: Copy button
  // ========================
  console.log('\n=== Test 5: Copy button ===');
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      permissions: ['clipboard-read', 'clipboard-write'],
    });
    const page = await context.newPage();

    page.on('pageerror', err => { errors.push('T5: ' + err.message); });
    page.on('console', msg => { if (msg.type() === 'error') errors.push('T5 console: ' + msg.text()); });

    await page.goto(HTML_PATH, { waitUntil: 'networkidle' });

    const modeCards = await page.$$('.mode-card');
    if (modeCards.length < 1) throw new Error('Professional mode card not found');
    await modeCards[0].click();
    await page.waitForTimeout(200);

    const scenarios = await page.$$('.opt');
    if (scenarios.length < 1) throw new Error('Scenario options not found');
    await scenarios[0].click();
    await page.waitForTimeout(200);

    await answerAllQuestions(page, 5, 4);

    const promptText = (await page.locator('#promptBox').textContent()) || '';
    await page.locator('.btn-copy').click();
    await page.waitForTimeout(300);

    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });
    const toastText = (await page.locator('#toast').textContent()) || '';

    const clipboardNormalized = clipboardText.replace(/\r\n/g, '\n');
    const promptNormalized = promptText.replace(/\r\n/g, '\n');

    const passed = promptText.length > 0 && clipboardNormalized === promptNormalized && toastText.includes('已复制');

    testResults.push({
      name: 'T5: Copy',
      passed,
      details: `promptChars:${promptText.length} clipboardChars:${clipboardText.length} matched:${clipboardNormalized === promptNormalized}`,
    });
    console.log('  ' + (passed ? 'PASS' : 'FAIL') + ': ' + testResults[testResults.length-1].details);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 't5-copy.png'), fullPage: true });
    await context.close();
  }

  // ========================
  // Test 6: Console errors
  // ========================
  const realErrors = errors.filter(e => !e.includes('libpng') && !e.includes('iCCP'));
  const t6passed = realErrors.length === 0;
  testResults.push({ name: 'T6: Console errors', passed: t6passed, details: realErrors.length + ' errors' + (realErrors.length ? ': ' + realErrors.join('; ') : '') });
  console.log('\n=== Test 6: Console errors ===');
  console.log('  ' + (t6passed ? 'PASS' : 'FAIL') + ': ' + realErrors.length + ' errors');

  await browser.close();

  console.log('\n=== SUMMARY ===');
  const allPassed = testResults.every(t => t.passed);
  testResults.forEach(t => console.log('  ' + (t.passed ? '\u2713' : '\u2717') + ' ' + t.name + (t.details ? ': ' + t.details : '')));
  console.log('\nOverall: ' + (allPassed ? 'ALL PASSED' : 'SOME FAILED'));
  console.log('Console errors: ' + realErrors.length);

  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'test-results.json'), JSON.stringify({ results: testResults, errors: realErrors, passed: allPassed }, null, 2));
  process.exit(allPassed ? 0 : 1);
}

run().catch(e => { console.error('CRASH:', e.message); process.exit(1); });

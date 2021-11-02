export default (page) => ({
  async open(url) {
    await page.goto(url);
    return page.waitForSelector('.njs-viz[data-render-count="1"]', { visible: true, timeout: 2000 });
  },
  async screenshot(element) {
    return page.screenshot({ clip: await element.boundingBox() });
  },
});

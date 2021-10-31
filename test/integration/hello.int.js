describe('sn', () => {
  const content = '.MuiTablePagination-selectLabel';

  before(async () => {
    const app = encodeURIComponent(process.env.APP_ID || '/apps/ctrl00.qvf');
    await page.goto(`${process.env.BASE_URL}/render/?app=${app}&cols=Dim1,Alpha`);

    await page.waitForSelector(content, { visible: true });
  });

  it('should render a div', async () => {
    const text = await page.$eval('.MuiTablePagination-selectLabel', (el) => el.textContent);
    expect(text).to.equal('Rows per page');
  });
});

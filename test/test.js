app.post('/fetch', async (req, res) => {
    const { url } = req.body;
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.goto(url, { waitUntil: 'networkidle2' });
        const content = await page.content();

        // cheerio로 HTML 파싱
        const $ = cheerio.load(content);

        // 모든 <script> 태그 제거
        $('script').remove();

        // 링크 추출
        const links = [];
        $('a').each((index, element) => {
            const href = $(element).attr('href');
            const title = $(element).text().trim();
            if (href) {
                // 상대 URL 처리
                const fullUrl = href.startsWith('http') ? href : new URL(href, url).href;
                links.push({ url: fullUrl, title: title || fullUrl });
            }
        });

        await browser.close();
        
        // 중복 제거
        const uniqueLinks = [...new Set(links.map(link => link.url))];

        // 링크 목록을 HTML로 만들어서 클라이언트에 전송
        const responseHtml = `
            <h1>Extracted Links</h1>
            <ul>
                ${uniqueLinks.map(link => `<li><a href="${link.url}" target="_blank">${link.title}</a></li>`).join('')}
            </ul>
        `;
        res.send(responseHtml);
    } catch (error) {
        res.send('Error fetching the page: ' + error.message);
    }
});

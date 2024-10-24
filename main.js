const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

// 정적 파일 제공을 위한 미들웨어
app.use(express.static('public'));

// URL 입력을 처리하는 POST 요청
app.use(express.urlencoded({ extended: true }));

app.post('/fetch', async (req, res) => {
    const { url } = req.body; // 입력받은 URL
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // 입력받은 URL로 페이지 열기
        await page.goto(url, { waitUntil: 'networkidle2' });

        // 페이지의 HTML을 가져오기
        const content = await page.content();

        // cheerio를 사용하여 HTML을 파싱
        const $ = cheerio.load(content);

        // 모든 <script> 태그 제거
        $('script').remove();

        // 모든 링크를 추출
        const linksWithTitles = [];
        const linksWithoutTitles = [];

        $('a').each((index, element) => {
            const href = $(element).attr('href');
            const title = $(element).text().trim() || $(element).parent().text().trim(); // 제목 추출

            // 상대 경로 감지 및 변환
            const absoluteUrl = href && !/^https?:\/\//i.test(href) ? new URL(href, url).href : href;

            // 필터링 조건 : 표시될 필요가 없는 태그가 포함된 경우
            const shouldFilter = (href && (href.includes('WEB-INF') || href.includes('META-INF') || href.includes('admin'))) ||
                (title && (title.includes('WEB-INF') || title.includes('META-INF') || title.includes('admin')));

            if (!shouldFilter) {
                if (title) {
                    linksWithTitles.push({ title, href: absoluteUrl });
                } else {
                    linksWithoutTitles.push(absoluteUrl); // 링크 제목이 없을 경우
                }
            }
        });

        await browser.close();

        // 중복 제거
        const uniqueLinksWithTitles = [...new Set(linksWithTitles.map(link => JSON.stringify(link)))].map(link => JSON.parse(link));
        const uniqueLinksWithoutTitles = [...new Set(linksWithoutTitles)];

        // 검색 기능을 위한 HTML 추가
        const searchHtml = `
            <h2>Search Links</h2>
            <input type="text" id="searchInput" placeholder="Search titles...">
            <button onclick="searchLinks()">Search</button>
            <div id="searchResults"></div>
            <script>
                function searchLinks() {
                    const input = document.getElementById('searchInput').value.toLowerCase();
                    const titles = Array.from(document.querySelectorAll('.link-title'));
                    const results = titles.filter(title => title.innerText.toLowerCase().includes(input));
                    
                    const resultsContainer = document.getElementById('searchResults');
                    resultsContainer.innerHTML = ''; // 기존 검색 결과 초기화

                    if (results.length === 0) {
                        // 검색된 내용이 없으면 기본 페이지로 돌아가기
                        window.location.href = '/'; 
                    } else {
                        resultsContainer.innerHTML = '<h3>Search Results:</h3><ul>' + results.map(title => {
                            const link = title.getAttribute('data-href');
                            return '<li><a href="' + link + '" target="_blank">' + title.innerText + '</a></li>';
                        }).join('') + '</ul>';
                    }
                }
            </script>
        `;

        // 링크 목록을 HTML로 만들어서 클라이언트에 전송
        const responseHtml = `
            <h2>Fetch Another URL</h2>
            <form action="/fetch" method="POST">
                <input type="text" name="url" placeholder="Enter another URL" required>
                <button type="submit">Fetch</button>
            </form>
            ${searchHtml}
            <h1>Extracted Links</h1>
            <h2>Links with Titles</h2>
            <ul>
                ${uniqueLinksWithTitles.map(link => `<li class="link-title" data-href="${link.href}">${link.title}: <a href="${link.href}" target="_blank">${link.href}</a></li>`).join('')}
            </ul>
            <h2>Links without Titles</h2>
            <ul>
                ${uniqueLinksWithoutTitles.map(link => `<li><a href="${link}" target="_blank">${link}</a></li>`).join('')}
            </ul>
        `;
        res.send(responseHtml); // 링크 목록을 전송
    } catch (error) {
        res.send('Error fetching the page: ' + error.message);
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

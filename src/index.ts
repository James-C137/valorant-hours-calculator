import puppeteer, { Browser } from 'puppeteer';

const USERNAMES: string[] = [
  'YCS Jamesasdf#YCS',
  'YCS Jameswa#YCS',
  'LOOOOOOOOOOOOOOL#YCS',
  'Xeroxight#YCS',
]
const USERNAME: string = USERNAMES[1];
const PLAYLISTS: string[] = [
  'competitive',
  'unrated',
  'deathmatch',
  'spikerush',
  'escalation',
  'replication',
  'snowball',
];

const getHoursfromPage = async (browser: Browser, username: string, playlist: string): Promise<number> => {
  const page = await browser.newPage();
  const usernameURI = encodeURIComponent(username);

  await page.goto(`https://tracker.gg/valorant/profile/riot/${usernameURI}/overview?playlist=${playlist}&season=all`);

  const elements = await page.$$('.playtime');
  const element = elements[0];
  const textContent = await element.evaluate(el => el.textContent) || '';
  const cleanedTextContent = textContent.replace(',', '');

  const hourMatch = cleanedTextContent?.match('[0-9]+h');
  const minuteMatch = cleanedTextContent?.match('[0-9]+m');
  const secondMatch = cleanedTextContent?.match('[0-9]+s');

  let hours = 0;

  if (hourMatch && hourMatch.length === 1) {
    const hourString = hourMatch[0];
    hours += parseInt(hourString);
  }

  if (minuteMatch && minuteMatch.length === 1) {
    const minuteString = minuteMatch[0];
    hours += parseInt(minuteString) / 60;
  }

  if (secondMatch && secondMatch.length === 1) {
    const secondString = secondMatch[0];
    hours += parseInt(secondString) / 3600;
  }

  await page.close();

  return hours;
}

const browser = await puppeteer.launch({headless: false});

let totalHours = 0;
for (const i in PLAYLISTS) {
  const hours = await getHoursfromPage(browser, USERNAME, PLAYLISTS[i]);
  totalHours += hours;
  console.log(`${PLAYLISTS[i]} hours: ${hours},\tnew total hours: ${totalHours}`);
}

await browser.close();

console.log(`Grand total: ${totalHours}`);

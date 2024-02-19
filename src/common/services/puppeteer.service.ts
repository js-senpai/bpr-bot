import puppeteer from 'puppeteer-extra';
import { Injectable } from '@nestjs/common';
import { Browser, DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } from 'puppeteer';
import { API_URL } from '../constants/api.constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const UserAgent = require('user-agents');
@Injectable()
export class PuppeteerService {
  constructor() {
    puppeteer.use(StealthPlugin());
    puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')());
    puppeteer.use(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('puppeteer-extra-plugin-block-resources')({
        blockedTypes: new Set(['image']),
        // Optionally enable Cooperative Mode for several request interceptors
        // interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
      }),
    );
  }

  async getAvailableUsers({
    fullName,
    year,
  }: {
    fullName: string;
    year: number;
  }): Promise<string[]> {
    const userAgent = new UserAgent();
    const linkText = `Бали БПР ${year} року`;
    const linkItem = '.sppb-column-addons .sppb-addon-title a';
    const tableColumns = '.waffle  tbody tr';
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      ignoreHTTPSErrors: true,
      defaultViewport: null,
      // userDataDir: './parser/cache',
      args: [
        '--lang=en-GB,en',
        `--ignore-certificate-errors`,
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
      ],
    });
    const page = await browser.newPage();
    try {
      await page.goto(API_URL);
      await page.setUserAgent(userAgent.toString());
      await page.setJavaScriptEnabled(false);
      const link = await page.$$eval(
        linkItem,
        (item, linkText) => {
          const foundAnchor = item.find(
            (anchor) => anchor.textContent.trim() === linkText,
          );
          if (foundAnchor) {
            return foundAnchor.href;
          }
          return null;
        },
        linkText,
      );
      await page.goto(link);
      await page.setUserAgent(userAgent.toString());
      await page.setJavaScriptEnabled(false);
      const fullNameList = await page.$$eval(
        tableColumns,
        (rows, [fullName, year]: [string, number]) => {
          const [lastName, firstName] = fullName.toLowerCase().split(' ');
          return rows.reduce((a, b) => {
            const cells = b.querySelectorAll('td');
            const fioCell = cells[+year === 2024 ? 3 : 5];
            if (fioCell?.textContent) {
              const fioParts = fioCell.textContent
                .toLowerCase()
                .trim()
                .split(' ');
              if (fioParts[0] === lastName && fioParts[1] === firstName) {
                a.push(fioCell.textContent.trim());
              }
            }

            return a;
          }, []);
        },
        [fullName, year],
      );

      return [...new Set(fullNameList)] as string[];
    } catch (e) {
      throw e;
    } finally {
      await page.close();
      await browser.close();
    }
  }

  async getScores({
    fullName,
    year,
  }: {
    fullName: string;
    year: number;
  }): Promise<string> {
    const userAgent = new UserAgent();
    const linkText = `Бали БПР ${year} року`;
    const linkItem = '.sppb-column-addons .sppb-addon-title a';
    const tableColumns = '.waffle  tbody tr';
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium',
      ignoreHTTPSErrors: true,
      defaultViewport: null,
      // userDataDir: './parser/cache',
      args: [
        '--lang=en-GB,en',
        `--ignore-certificate-errors`,
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
      ],
    });
    const page = await browser.newPage();
    try {
      await page.goto(API_URL, {
        waitUntil: 'networkidle0',
      });
      await page.setUserAgent(userAgent.toString());
      await page.setJavaScriptEnabled(false);
      const link = await page.$$eval(
        linkItem,
        (item, linkText) => {
          const foundAnchor = item.find(
            (anchor) => anchor.textContent.trim() === linkText,
          );
          if (foundAnchor) {
            return foundAnchor.href;
          }
          return null;
        },
        linkText,
      );
      await page.goto(link);
      await page.setUserAgent(userAgent.toString());
      await page.setJavaScriptEnabled(false);
      return await page.$$eval(
        tableColumns,
        (rows, [fullName, year]: [string, number]) => {
          return rows.reduce((a, b) => {
            const cells = b.querySelectorAll('td');
            const fioCell = cells[+year === 2024 ? 3 : 5];
            if (fioCell?.textContent) {
              const currenFullName = fioCell.textContent.toLowerCase().trim();
              const scoreCell = cells[+year === 2024 ? 4 : 6];
              if (scoreCell?.textContent) {
                if (currenFullName === fullName) {
                  a = scoreCell.textContent.trim();
                }
              }
            }
            return a;
          }, '');
        },
        [fullName.toLowerCase(), year],
      );
    } catch (e) {
      throw e;
    } finally {
      await page.close();
      await browser.close();
    }
  }
}

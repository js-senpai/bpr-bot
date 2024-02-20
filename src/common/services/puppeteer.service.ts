import { addExtra } from 'puppeteer-extra';
import { Injectable } from '@nestjs/common';
import { Browser, DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } from 'puppeteer';
import { API_URL } from '../constants/api.constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const UserAgent = require('user-agents');
import vanillaPuppeteer from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import { PUPPETEER_CONFIG } from '../constants/puppeteer.constants';
const puppeteer = addExtra(vanillaPuppeteer);
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
// eslint-disable-next-line @typescript-eslint/no-var-requires
puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')());
puppeteer.use(
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('puppeteer-extra-plugin-block-resources')({
    blockedTypes: new Set(['image']),
  }),
);
@Injectable()
export class PuppeteerService {
  private static cluster: Cluster;

  constructor() {
    this.initCluster();
  }
  private async initCluster() {
    if (!PuppeteerService.cluster) {
      PuppeteerService.cluster = await Cluster.launch({
        puppeteer,
        maxConcurrency: 2,
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        timeout: 1000 * 60 * 10,
        puppeteerOptions: PUPPETEER_CONFIG,
      });
    }
  }

  async onModuleDestroy() {
    if (PuppeteerService.cluster) {
      await PuppeteerService.cluster.idle();
      await PuppeteerService.cluster.close();
      PuppeteerService.cluster = null;
    }
  }
  async getAvailableUsers({
    fullName,
    year,
  }: {
    fullName: string;
    year: number;
  }): Promise<{ name: string; scores: string }[]> {
    if (!PuppeteerService.cluster) {
      await this.initCluster();
    }
    const cluster = PuppeteerService.cluster;
    await cluster.task(async ({ page, data: { url, choosenYear } }) => {
      const userAgent = new UserAgent();
      const linkText = `Бали БПР ${choosenYear} року`;
      const linkItem = '.sppb-column-addons .sppb-addon-title a';
      const tableColumns = '.waffle  tbody tr';
      await page.setUserAgent(userAgent.toString());
      await page.setJavaScriptEnabled(false);
      await page.goto(url);
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
      // await page.setUserAgent(userAgent.toString());
      await page.goto(link);
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
                const scoreCell = cells[+year === 2024 ? 4 : 6];
                a.push({
                  name: fioCell.textContent.trim(),
                  scores: scoreCell?.textContent?.trim() || 'Балли не знайдені',
                });
              }
            }

            return a;
          }, []);
        },
        [fullName, choosenYear],
      );

      return [
        ...new Map(fullNameList.map((item) => [item['name'], item])).values(),
      ];
    });
    try {
      return await cluster.execute({ url: API_URL, choosenYear: year });
    } catch (e) {
      throw e;
    }
  }
}

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TelegramContext } from '../contexts/telegram.context';
import * as stream from 'stream';

@Injectable()
export class TelegramFileService {
  async get({
    ctx,
    fileId,
    mimeType,
  }: {
    ctx: TelegramContext;
    fileId: string;
    mimeType: string;
  }): Promise<{
    headers: { [key: string]: string };
    file: stream.Readable;
  }> {
    const { href } = await ctx.telegram.getFileLink(fileId);
    const getFile = await axios.get(href, {
      responseType: 'stream',
    });
    const commonHeaders = [
      'content-length',
      'etag',
      'last-modified',
      'cache-control',
    ];
    let getHeaders = {
      'content-type': mimeType,
    };
    commonHeaders.forEach((header) => {
      if (getFile.headers[header]) {
        getHeaders = {
          ...getHeaders,
          [header]: getFile.headers[header],
        };
      }
    });
    return {
      headers: getHeaders,
      file: await getFile.data,
    };
  }
}

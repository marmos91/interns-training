const fs = require('fs');
const request = require('request');

import {Webpage} from '../src/Webpage';

type RequestGetCallback = (error?: Error | null, response?: Object, body?: String) => void;

describe('Level 2 - Webpage', () =>
{
  // This is sadly necessary due to private methods in classes
  // @see https://stackoverflow.com/a/36078002
  let webpage;

  beforeEach(() => webpage = new Webpage());

  describe('getWebPage', () =>
  {
    it('should return a Promise', () =>
    {
      const body = 'pippo';
      request.get = jest.fn((url: String, cb: RequestGetCallback) => cb(null, { statusCode: 200 }, body));

      expect(typeof webpage.getWebpage('url').then).toEqual('function');
      expect(typeof webpage.getWebpage('url').catch).toEqual('function');
    });

    it('should reject if `error`', async () =>
    {
      const errorMsg = 'Dummy error';
      request.get = jest.fn((url: String, cb: RequestGetCallback) => cb(new Error(errorMsg)));

      try
      {
        await webpage.getWebpage('url');
      }
      catch(error)
      {
        expect(error).toEqual(new Error(errorMsg));
      }
    });

    it('should reject if `response.statusCode` is not 200', async () =>
    {
      request.get = jest.fn((url: String, cb: RequestGetCallback) => cb(null, { statusCode: 404 }));

      try
      {
        await webpage.getWebpage('url');
      }
      catch(error)
      {
        expect(error).toBeTruthy();
      }
    });

    it('should resolve with body', async () =>
    {
      const body = '42';
      request.get = jest.fn((url: String, cb: RequestGetCallback) => cb(null, { statusCode: 200 }, body));

      expect(await webpage.getWebpage('url')).toEqual(body);
    });
  });

  describe('saveWebPage', () =>
  {

    beforeEach(() => fs.writeFile = jest.fn((_path, _content, cb) => cb()));
    it('should return a Promise', () =>
    {
      webpage.getWebpage = jest.fn(() => Promise.resolve('42'));

      expect(typeof webpage.saveWebpage('url', 'path').then).toEqual('function');
      expect(typeof webpage.saveWebpage('url', 'path').catch).toEqual('function');
    });

    it('should reject if `error`', async () =>
    {
      const errorMsg = 'Dummy error';
      webpage.getWebpage = jest.fn(() => Promise.reject(errorMsg));

      try
      {
        await webpage.saveWebpage('url', 'path');
      }
      catch(error)
      {
        expect(error).toEqual(new Error(errorMsg));
      }
    });

    it('should resolve with `path` if page is saved', async () =>
    {
      const body = '42';
      const path = '/path/to/file';
      webpage.getWebpage = jest.fn(() => Promise.resolve(body));

      expect(await webpage.saveWebpage('url', path)).toEqual(path);
    });
  });

  describe('_writeFile', () =>
  {
    it('should return a Promise', () =>
    {
      fs.writeFile = jest.fn((path, content, cb) => cb());

      expect(typeof webpage._writeFile('path', 'content').then).toEqual('function');
      expect(typeof webpage._writeFile('path', 'content').catch).toEqual('function');
    });

    it('should reject if `error`', async () =>
    {
      const errorMsg = 'Dummy error';
      fs.writeFile = jest.fn((path, content, cb) => cb(new Error(errorMsg)));

      try
      {
        await webpage._writeFile('path', 'content');
      }
      catch(error)
      {
        expect(error).toEqual(new Error(errorMsg));
      }
    });

    it('should resolve with `path`', async () =>
    {
      const path = '/path/to/file';
      fs.writeFile = jest.fn((_path, _content, cb) => cb());

      const output = await webpage._writeFile(path, 'content');
      expect(output).toEqual(path);
    });
  });
});

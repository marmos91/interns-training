import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import * as sinon from "sinon";

import * as ServerMock from "mock-http-server";

import { join } from "path";

import { promisify } from "util";
import { readFile } from "fs";
const readFilePromise = promisify(readFile);

import { Webpage } from "../src/Webpage";

describe('Webpage', () => {

    let webpage: Webpage;
    let server: typeof ServerMock;

    beforeEach(done => {
        webpage = new Webpage();
        server = new ServerMock({ host: 'localhost', port: 9000 });
        server.start(done);
    });

    afterEach(done => {
        server.stop(done);
    });

    it('should perform a GET HTTP request to a server', async () => {

        const body = JSON.stringify({ status: 'OK' });

        server.on({
            method: 'GET',
            path: '/',
            reply: {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body
            }
        });

        const content = await webpage.getWebpage('http://localhost:9000/');
        expect(content).to.eq(body);
    });

    it('should throw error if the server is not reachable', async () => {
        expect(webpage.getWebpage('http://localhost:9001/')).to.be.rejected;
    });

    it('should throw error if the server responds with status <> 200', async () => {
        server.on({
            method: 'GET',
            path: '/',
            reply: {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Internal server error' })
            }
        });

        await expect(webpage.getWebpage('http://localhost:9000/')).to.be.rejected;
    });

    it('should save webpage content after its retrieval', async () => {

        const writeFile: sinon.SinonStub<[url: string, path: string], Promise<string>> =
            sinon.stub(webpage, <keyof typeof webpage>'_writeFile');

        const body = JSON.stringify({ status: 'OK', nonce: Math.random() });
        server.on({
            method: 'GET',
            path: '/',
            reply: {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body
            }
        });

        const contentFilePath = '.not-persisted-content';
        await webpage.saveWebpage('http://localhost:9000/', contentFilePath);
        
        writeFile.restore();
        sinon.assert.calledWith(writeFile, contentFilePath, body);
    });

    it('should save webpage content on filesystem after its retrieval', async () => {
        const body = JSON.stringify({ status: 'OK', nonce: Math.random() });
        server.on({
            method: 'GET',
            path: '/',
            reply: {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body
            }
        });

        const contentFilePath = join(__dirname, '.content');
        await webpage.saveWebpage('http://localhost:9000/', contentFilePath);
        const content = await readFilePromise(contentFilePath, 'utf8');

        expect(content).to.eq(body);
    });
});
import {Webpage} from "../src/Webpage";
import * as Server from "mock-http-server"; 
import { doesNotThrow } from "assert";

var web: Webpage = new Webpage;
var server: Server = new Server(
{
  host: "localhost",
  port: 9000
});
var url: string = "http://localhost:9000/resource";

describe("Webpage", () =>
{
  beforeEach((done) => server.start(done));
  afterEach((done) => server.stop(done));

  test("Reciving a page", async () =>
  {
    server.on(
    {
      path: '/resource',
      reply:
      {
        body: "Hello World!"
      }
    });
    let page = await web.getWebpage(url);

    expect(page).toBe("Hello World!");
  });
});
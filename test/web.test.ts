import {Webpage} from "../src/Webpage";
import * as Server from "mock-http-server"; 
import * as fs from "fs";

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
			path: "/resource",
			reply:
			{
				body: "Hello World!"
			}
		});
		let page = await web.getWebpage(url);

		expect(page).toBe("Hello World!");
	});

	test("Saveing a page", async () =>
	{
		server.on(
		{
			path: "/resource",
			reply:
			{
				body: "Another Hello World!"
			}
		});
		await web.saveWebpage(url, "./mypage");

		let page: string = fs.readFileSync("./mypage", "utf8");

		expect(page).toBe("Another Hello World!");
	});
});
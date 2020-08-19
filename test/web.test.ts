import {Webpage} from "../src/Webpage";
import * as Server from "mock-http-server"; 
import * as fs from "fs";

const web: Webpage = new Webpage;
const server: Server = new Server({host: "localhost", port: 9000});
const url: string = "http://localhost:9000/resource";

describe("Webpage", () =>
{
	beforeEach((done) => server.start(done));
	afterEach((done) => server.stop(done));

	test("Reciving a page", async () =>
	{
		server.on({path: "/resource", reply: {body: "Hello World!"}});

		const received_page = await web.getWebpage(url);

		expect(received_page).toBe("Hello World!");
	});

	test("Saving a page", async () =>
	{
		server.on({path: "/resource", reply: {body: "Another Hello World!"}});

		await web.saveWebpage(url, "./mypage");
		const saved_page: string = fs.readFileSync("./mypage", "utf8");

		expect(saved_page).toBe("Another Hello World!");
	});
});
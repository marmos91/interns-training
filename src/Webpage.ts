import * as fs from 'fs';
import * as request from 'request';

export class Webpage
{
    /**
     * Retrieve a webpage and save the content to a file.
     * @param url The webpage to get.
     * @param path The path to save the retrieved page.
     * @throws <i>Error</i> if something went wrong getting teh webpage.
     
     */
    public saveWebpage(url, path): Promise<string>
    {
        return this.getWebpage(url).then((content) => this._writeFile(path, content)).catch((error) =>
        {
            throw new Error(error);
        });
    }

    /**
     * Get the given url and return the body.
     * It rejects if an error occurred or the response code is not 200.
     * @param url The webpage to get.
     */
    public getWebpage(url): Promise<any>
    {
        return new Promise(function (resolve, reject)
        {
            request.get(url, function (error, response, body)
            {
                if (error)
                    return reject(error)

                if (response.statusCode !== 200)
                    return reject(response)

                resolve(body)
            })
        })
    }

    /**
     * Create a file in the given path and write the given content into it.
     * It rejects if an error occurred.
     * @param path The path to be written.
     * @param content The file content.
     */
    private _writeFile(path, content): Promise<string>
    {
        return new Promise<string>((resolve, reject) =>
        {
            fs.writeFile(path, content, (error) =>
            {
                if (error)
                    return reject(error)

                resolve(path)
            })
        })
    }
}

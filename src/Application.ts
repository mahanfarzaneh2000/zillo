import http from 'http';
import { Routes, Method } from './routing.js';

class Application {
  app: Application;
  port: number;
  server: any;
  routes: any;

  constructor() {
    this.app = this;
    this.port = 8000;
  }

  public readRequestBody(request: any) {
    return new Promise((resolve, reject) => {
      let body = '';
      request.on('data', (chunk: any) => {
        body += '' + chunk;
      });
      request.on('end', () => {
        resolve(body);
      });
      request.on('error', (err: any) => {
        reject(err);
      });
    });
  }

  public setRoutes(routes: any): void {
    this.routes = routes;
  }

  public start(port: number, host = '127.0.0.1') {
    this.server = http.createServer(async (request: any, response: any) => {
      request.body = await this.readRequestBody(request);

      if (request.url in this.routes.routes) {
        this.routes.routes[request.url].view()
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write('<h1>hello World</h1>');
        response.end();
      } else {
        response.writeHead(404, { 'Content-Type': 'text/plane' });
        response.write('404 not found');
        response.end();
      }
      console.log(
        `${request.method} from ${request.url} ${response.statusCode}`,
      );
    });
    this.server.listen(port, host);
    console.log(`Server running at http://127.0.0.1:${port}/`);
  }

  public stop() {
    this.server.close();
  }
}

export { Application };

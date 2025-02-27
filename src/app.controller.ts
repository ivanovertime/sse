import { Controller, Get, MessageEvent, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller()
export class AppController {
  @Get()
  /**
   * This method is marked with the `@Get` decorator, which indicates that
   * this method should be used to handle HTTP GET requests.
   *
   * The method takes a single parameter, `@Res() response: Response`, which
   * is an instance of the Express `Response` class. This allows us to directly
   * manipulate the response, such as setting the content type and sending
   * the response body.
   *
   * The method returns a promise that resolves to a string, which is the
   * HTML content of the file at `./index.html`.
   */
  index(@Res() response: Response) {
    // Set the content type of the response to text/event-stream. This
    // tells the browser that we're sending a Server-Sent Events (SSE)
    // response.
    response.type('text/event-stream');

    // Read the contents of the file at `./index.html` and send it as the
    // response body. The `toString()` method is called on the result of
    // `readFileSync`, which returns a Buffer, to convert it to a string.
    response.send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Sse('sse')
  /**
   * This method is marked with the `@Sse` decorator. This indicates that
   * this method should be used to handle Server-Sent Events (SSE) requests.
   * This means that the method will be called when a user makes a request
   * to the route `/sse`.
   */
  sse(): Observable<MessageEvent> {
    /**
     * The `interval` function returns an observable that emits a sequence
     * of numbers. The first argument to `interval` is the time, in
     * milliseconds, between each emission. In this case, we're emitting
     * a number every 1,000 milliseconds (or 1 second).
     */
    return interval(1000).pipe(
      /**
       * The `map` function transforms each emission from the observable
       * into a different value. In this case, we're taking each number
       * emitted by the `interval` observable and transforming it into
       * an object with a property called `data` and a value of an object
       * with a property called `hello` and a value of the string
       * `"world"`.
       *
       * The `as MessageEvent` cast is necessary because the `map` function
       * doesn't know that the type of the value we're returning is a
       * `MessageEvent`.
       */
      map(
        (counter) => ({ data: { hello: `world ${counter}` } }) as MessageEvent,
      ),
    );
  }
}

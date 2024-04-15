# Currency trend chart

A little app that that shows the historical trend of a currency pair using [Airbnb's visx library](https://airbnb.io/visx).

## Development

This app is built using [Remix][remix] and [Vite][vite]. To get started, you'll need to install dependencies:

```sh
pnpm i
```

Run the Vite dev server:

```sh
pnpm run dev
```

This app is intended to be deployed to Cloudflare Pages, and includes [Wrangler][wrangler] to facilitate local development inside a Cloudflare Pages-like environment.

To run Wrangler:

```sh
pnpm run build
pnpm run start
```

## Deployment

First, build the app for production:

```sh
pnpm run build
```

Then, deploy the app to Cloudflare Pages:

```sh
pnpm run deploy
```

## API

This application makes use of the API provided by [Frankfurter][api]. This API does not seem to have rate limiting, however I have implemented a (very!) basic in-memory cache to avoid repeatedly hitting the endpoint. Given more time, I would recommend using Cloudflare KV for caching the responses, as it is relatively trivial to set up once deployed to Cloudflare Pages.


[bindings]: https://developers.cloudflare.com/pages/functions/bindings/
[remix]: https://remix.run/docs/en/main
[vite]: https://vitejs.dev/
[wrangler]: https://developers.cloudflare.com/workers/wrangler/
[api]: https://www.frankfurter.app/

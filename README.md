# Currency trend chart

A little app that that shows the historical trend of a currency pair using [Airbnb's visx library](https://airbnb.io/visx).

| Wide viewport | Narrow viewport |
| ------------- | -------------- |
| <img width="1221" alt="image" src="https://github.com/Jayphen/currencies/assets/329184/53d5555a-71bb-4dfe-a009-4be8ef91d02a"> | <img width="565" alt="image" src="https://github.com/Jayphen/currencies/assets/329184/a9573d73-c063-4d82-a652-a9c764ad5755"> |

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

## Notes and future improvements

* I spent quite a lot of time trying to find a suitable form library, but it proved to be quite difficult. I decided to go for native date inputs instead. This does work quite well, but more work would be needed to match the design, perhaps by showing dual inputs in a popover, instead of showing both inputs at all times. I did manage to sync the inputs with the range presets though, and the UX of this is not too bad!
* I did not manage to add full test coverage in the time I had to work on this, but I tried to test the most critical parts of the application.
* ~~The deployment to Cloudflare Pages has not been tested. I will hopefully do this soon, as I would like to put this little tool online.~~ Deployed to https://currencies.jayphen.dev. Check out the [Github Action that handles deployment](https://github.com/Jayphen/currencies/blob/main/.github/workflows/deploy.yml).
* Given more time, I would like to further factor out the data fetching from the `loader`. I am not happy with the level of abstraction here, though I did try to make some effort to pull out the Frankfurter API to implement a generic interface that is easy to test.
* This was a lot of fun!



[bindings]: https://developers.cloudflare.com/pages/functions/bindings/
[remix]: https://remix.run/docs/en/main
[vite]: https://vitejs.dev/
[wrangler]: https://developers.cloudflare.com/workers/wrangler/
[api]: https://www.frankfurter.app/

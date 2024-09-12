# Provider Registry Preview

This example demonstrates how to use the [Vercel AI SDK](https://sdk.vercel.ai/docs) with [Next.js](https://nextjs.org/) and the `experimental_createProviderRegistry` function to handle multiple providers and models and switch between them easily in your application.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https%3A%2F%2Fvercel.com%2Fnew%2Fclone%3Frepository-url%3Dhttps%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-provider-registry%26env%3DOPENAI_API_KEY%2CANTHROPIC_API_KEY%2CGOOGLE_GENERATIVE_AI_API_KEY%26envDescription%3DAPI%20keys%20needed%20for%20application)

## How to use

Run [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel-labs/ai-sdk-preview-provider-registry ai-sdk-preview-provider-registry-example
```

```bash
yarn create next-app --example https://github.com/vercel-labs/ai-sdk-preview-provider-registry ai-sdk-preview-provider-registry-example
```

```bash
pnpm create next-app --example https://github.com/vercel-labs/ai-sdk-preview-provider-registry ai-sdk-preview-provider-registry-example
```

To run the example locally you need to:

1. Sign up for accounts with the AI providers you want to use (e.g., OpenAI, Anthropic).
2. Obtain API keys for each provider.
3. Set the required environment variables as shown in the `.env.example` file, but in a new file called `.env`.
4. `npm install` to install the required dependencies.
5. `npm run dev` to launch the development server.


## Learn More

To learn more about Vercel AI SDK or Next.js take a look at the following resources:

- [Vercel AI SDK docs](https://sdk.vercel.ai/docs)
- [Vercel AI Playground](https://play.vercel.ai)
- [Next.js Documentation](https://nextjs.org/docs)

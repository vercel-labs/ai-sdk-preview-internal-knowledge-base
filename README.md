# Internal Knowledge Base Preview

This template demonstrates the usage of the [Language Model Middleware](https://sdk.vercel.ai/docs/ai-sdk-core/middleware#language-model-middleware) to perform retrieval augmented generation and enforce guardrails using the [AI SDK](https://sdk.vercel.ai/docs) and [Next.js](https://nextjs.org/).

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https%3A%2F%2Fvercel.com%2Fnew%2Fclone%3Frepository-url%3Dhttps%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-internal-knowledge-base%26env%3DOPENAI_API_KEY&envDescription%3DAPI%20keys%20needed%20for%20application)

## How to use

Run [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel-labs/ai-sdk-preview-internal-knowledge-base ai-sdk-preview-internal-knowledge-base-example
```

```bash
yarn create next-app --example https://github.com/vercel-labs/ai-sdk-preview-internal-knowledge-base ai-sdk-preview-internal-knowledge-base-example
```

```bash
pnpm create next-app --example https://github.com/vercel-labs/ai-sdk-preview-internal-knowledge-base ai-sdk-preview-internal-knowledge-base-example
```

To run the example locally you need to:

1. Sign up for accounts with the AI providers you want to use (e.g., OpenAI, Anthropic).
2. Obtain API keys for each provider.
3. Set the required environment variables as shown in the `.env.example` file, but in a new file called `.env`.
4. `npm install` to install the required dependencies.
5. `npm run dev` to launch the development server.


## Learn More

To learn more about the AI SDK or Next.js by Vercel, take a look at the following resources:

- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)

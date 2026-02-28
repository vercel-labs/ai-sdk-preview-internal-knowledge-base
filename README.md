# Internal Knowledge Base Preview

This template demonstrates the usage of the [Language Model Middleware](https://sdk.vercel.ai/docs/ai-sdk-core/middleware#language-model-middleware) to perform retrieval augmented generation and enforce guardrails using the [AI SDK](https://sdk.vercel.ai/docs), [Vercel AI Gateway](https://vercel.com/docs/ai/vercel-ai-gateway), and [Next.js](https://nextjs.org/).

Models are accessed through the [Vercel AI Gateway](https://vercel.com/docs/ai/vercel-ai-gateway) using the `provider/model` string format (e.g. `"openai/gpt-4o"`). No individual provider API keys are required — when deployed to Vercel, the gateway authenticates automatically via OIDC.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-internal-knowledge-base&env=AUTH_SECRET&envDescription=API%20keys%20needed%20for%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-internal-knowledge-base%2Fblob%2Fmain%2F.env.example&stores=%5B%7B%22type%22%3A%22blob%22%7D%2C%7B%22type%22%3A%22postgres%22%7D%5D)

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

1. Set up a [Vercel AI Gateway](https://vercel.com/docs/ai/vercel-ai-gateway) API key and add it to your `.env` as `AI_GATEWAY_API_KEY` (when deployed to Vercel this is handled automatically).
2. Set the remaining environment variables as shown in the `.env.example` file, but in a new file called `.env`.
3. `npm install` to install the required dependencies.
4. `npm run dev` to launch the development server.


## Learn More

To learn more about the AI SDK or Next.js by Vercel, take a look at the following resources:

- [AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Vercel AI Gateway Documentation](https://vercel.com/docs/ai/vercel-ai-gateway)
- [Next.js Documentation](https://nextjs.org/docs)

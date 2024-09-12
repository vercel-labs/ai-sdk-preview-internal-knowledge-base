export function Form({
  action,
  children,
}: {
  action: any;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div>
        <label
          htmlFor="email"
          className="block text-sm text-zinc-600 dark:text-zinc-400"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          className="mt-1 block w-full appearance-none rounded-md bg-zinc-100 px-3 py-2 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-black sm:text-sm dark:bg-zinc-700 dark:text-zinc-300"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm text-zinc-600 dark:text-zinc-400"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 block w-full appearance-none rounded-md bg-zinc-100 px-3 py-2 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-black sm:text-sm dark:bg-zinc-700 dark:text-zinc-300"
        />
      </div>
      {children}
    </form>
  );
}

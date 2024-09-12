import Link from "next/link";
import { Form } from "@/app/form";
import { signIn } from "@/app/auth";
import { SubmitButton } from "@/components/submit-button";

export default function Login() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-zinc-900">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Use your email and password to sign in
          </p>
        </div>
        <Form
          action={async (formData: FormData) => {
            "use server";

            await signIn("credentials", {
              redirectTo: "/",
              email: formData.get("email") as string,
              password: formData.get("password") as string,
            });
          }}
        >
          <SubmitButton>Sign in</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign up
            </Link>
            {" for free."}
          </p>
        </Form>
      </div>
    </div>
  );
}

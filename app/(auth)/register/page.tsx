import Link from "next/link";
import { Form } from "@/app/form";
import { redirect } from "next/navigation";
import { createUser, getUser } from "@/app/db";
import { SubmitButton } from "@/components/submit-button";

export default function Login() {
  async function register(formData: FormData) {
    "use server";
    let email = formData.get("email") as string;
    let password = formData.get("password") as string;
    let user = await getUser(email);

    if (user.length > 0) {
      return "User already exists"; // TODO: Handle errors with useFormStatus
    } else {
      await createUser(email, password);
      redirect("/login");
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white dark:bg-zinc-900">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Sign Up</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            Create an account with your email and password
          </p>
        </div>
        <Form action={register}>
          <SubmitButton>Sign Up</SubmitButton>
          <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
            {"Already have an account? "}
            <Link
              href="/login"
              className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
            >
              Sign in
            </Link>
            {" instead."}
          </p>
        </Form>
      </div>
    </div>
  );
}

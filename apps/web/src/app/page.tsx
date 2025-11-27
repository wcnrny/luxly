import { auth, signIn } from "@/auth";

export default async function Home() {
  const session = await auth();
  console.log(session?.user);
  if (!session) {
    return (
      <form
        action={async (formData) => {
          "use server";
          try {
            await signIn("credentials", formData);
          } catch (error) {
            console.log(error);
            return;
          }
        }}
      >
        <label>
          Email
          <input name="email" type="email" />
        </label>
        <label>
          Password
          <input name="password" type="password" />
        </label>
        <button>Sign In</button>
      </form>
    );
  }
  return (
    <>
      <pre>{session.user?.id}</pre>
    </>
  );
}

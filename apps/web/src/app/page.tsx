import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (!session) {
    return (
      <form
        action={async (formData) => {
          "use server";
          try {
            await signIn("credentials", formData);
          } catch (error) {
            debugger;
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
      <pre>{session.user.name}</pre>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button>Sign Out</button>
      </form>
    </>
  );
}

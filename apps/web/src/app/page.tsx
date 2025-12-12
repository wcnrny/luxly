import { auth, signIn } from "@/auth";
import { CollaborativeEditor } from "@/components/CollaborativeEditor";

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
      <CollaborativeEditor documentId="cmir1fqvy0001nijvjvzxarx3" />
    </>
  );
}

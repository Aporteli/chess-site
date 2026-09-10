import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="w-full rounded-lg border border-accent-garnet/40 bg-accent-garnet-dim px-4 py-2.5 text-[13px] font-medium text-accent-garnet-bright transition-colors hover:border-accent-garnet/70 hover:bg-accent-garnet/15 sm:w-auto"
      >
        სისტემიდან გამოსვლა
      </button>
    </form>
  );
}
import { redirect } from "next/navigation";

// The platform launches with the Opening Trainer as its only real feature.
// Root "/" simply hands off to "/trainer" so future features (Puzzles,
// Analysis, Courses) can each own their own top-level route without
// fighting over "/".
export default function RootPage() {
  redirect("/trainer");
}

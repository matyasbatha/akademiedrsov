import { redirect } from "next/navigation";

// Dashboard byl zrušen – vše řeší stránka Kurzy.
export default function DashboardPage() {
  redirect("/kurzy");
}

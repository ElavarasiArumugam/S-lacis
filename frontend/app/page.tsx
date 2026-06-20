import { redirect } from "next/navigation";

export default function Home() {
  // Automatically send anyone visiting the root URL to the login page
  redirect("/login");
}
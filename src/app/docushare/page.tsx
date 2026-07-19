import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function DocuShareRedirect() {
  redirect(process.env.DOCUSHARE_URL || "https://fileshare-six-phi.vercel.app/");
}

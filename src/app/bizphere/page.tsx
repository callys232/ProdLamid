import { redirect } from "next/navigation";

// /bizphere → canonical biz section
export default function BizpherePage() {
  redirect("/biz");
}

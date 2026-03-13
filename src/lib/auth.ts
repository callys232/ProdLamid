// lib/auth.ts
export type Role = "client" | "freelancer" | "admin" | string;

export async function signOut(options?: {
    role?: Role;
    redirectTo?: string;
    ssoLogoutUrl?: string;
    sessionId?: string;
}) {
    const role = options?.role ?? "client";
    // unified sign-in page as default
    const redirectTo = options?.redirectTo ?? "/signin";

    // 1. Call server logout endpoint (best-effort)
    let serverResponse: { success?: boolean; ssoLogoutUrl?: string } = {};
    try {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, sessionId: options?.sessionId, ssoLogoutUrl: options?.ssoLogoutUrl }),
        });
        serverResponse = await res.json().catch(() => ({}));
    } catch (err) {
        console.warn("Server logout request failed", err);
    }

    // 2. Clear client-side state
    try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        sessionStorage.removeItem("session");
        if (role === "freelancer") {
            localStorage.removeItem("freelancer_profile");
            sessionStorage.removeItem("freelancer_state");
        } else {
            localStorage.removeItem("client_profile");
            sessionStorage.removeItem("client_state");
        }
    } catch (e) {
        console.warn("Client cleanup failed", e);
    }

    // 3. SSO redirect if provided by options or server
    const ssoUrl = options?.ssoLogoutUrl ?? serverResponse?.ssoLogoutUrl;
    if (ssoUrl) {
        window.location.href = ssoUrl;
        return;
    }

    // 4. Final redirect to unified sign-in page
    window.location.href = redirectTo;
}

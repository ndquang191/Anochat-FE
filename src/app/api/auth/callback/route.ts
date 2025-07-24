import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	try {
		const requestUrl = new URL(request.url);
		const code = requestUrl.searchParams.get("code");
		const next = requestUrl.searchParams.get("next") || "/";

		if (code) {
			const supabase = await createClient();
			const { error } = await supabase.auth.exchangeCodeForSession(code);
			if (error) {
				throw error;
			}
			return NextResponse.redirect(new URL(next, requestUrl.origin));
		}
		throw new Error("No code found in request");
	} catch (error) {
		// Redirect to error page with error message
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
		return NextResponse.redirect(
			new URL(`/auth/error?error=${encodeURIComponent(errorMessage)}`, request.url)
		);
	}
}

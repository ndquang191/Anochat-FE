"use client";

import { LoginForm } from "@/components/login-form";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/client";

export default function Page() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const code = searchParams.get("code");

	useEffect(() => {
		const handleCode = async () => {
			if (!code) return;

			const supabase = createClient();

			try {
				// Get the session from the code
				const { data, error } = await supabase.auth.getSession();

				if (error) throw error;

				if (!data.session) {
					throw new Error("No session found");
				}

				router.replace("/");
			} catch (error) {
				router.replace(
					"/auth/error?error=" +
						encodeURIComponent(
							error instanceof Error ? error.message : "Failed to complete login"
						)
				);
			}
		};

		handleCode();
	}, [code, router]);

	// If we have a code, show loading state
	if (code) {
		return (
			<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
				<div className="text-center">
					<h2 className="text-xl font-semibold mb-2">Completing Login</h2>
					<p className="text-sm text-muted-foreground">Please wait...</p>
				</div>
			</div>
		);
	}

	// Otherwise show login form
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
}

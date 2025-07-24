"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSocialLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/login`,
					queryParams: {
						access_type: "offline",
						prompt: "consent",
					},
				},
			});

			if (error) throw error;

			// If we have a provider URL, redirect to it
			if (data?.url) {
				window.location.href = data.url;
			} else {
				throw new Error("No provider URL returned");
			}
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : "An error occurred during login");
			setIsLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Welcome!</CardTitle>
					<CardDescription>Sign in to your account to continue</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSocialLogin}>
						<div className="flex flex-col gap-6">
							{error && (
								<p className="text-sm text-destructive-500 bg-destructive-50 p-2 rounded">
									{error}
								</p>
							)}
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Logging in..." : "Continue with Google"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

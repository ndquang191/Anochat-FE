import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/server";
import { RealtimeChat } from "@/components/realtime-chat";

export default async function ProtectedPage() {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getClaims();
	if (error || !data?.claims) {
		redirect("/auth/login");
	}
	const email = data.claims.email;

	return (
		<div className="flex flex-col h-svh w-full items-center justify-center gap-2">
			<div className="w-full max-w-2xl flex-1 flex flex-col">
				<RealtimeChat roomName="main" username={email} />
			</div>
			<div className="mt-4">
				<LogoutButton />
			</div>
		</div>
	);
}

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/client";

export default function OAuthCallbackPage() {
	const router = useRouter();
	const supabase = createClient();
	const searchParams = useSearchParams();

	useEffect(() => {
		const finishLogin = async () => {
			// Lấy user hiện tại
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			if (error || !user) {
				console.error("Get user failed", error);
				return;
			}

			const nickname = user?.user_metadata?.full_name ?? "Người lạ";

			// Gọi function tạo bản ghi phụ trong public.users
			await supabase.rpc("handle_new_user", {
				user_id: user.id,
				nickname: nickname,
				age: null, // hoặc cho nhập sau
			});
			// Điều hướng tiếp theo
			const next = searchParams.get("next") || "/chat";
			router.replace(next);
		};

		finishLogin();
	}, [supabase, router, searchParams]);

	return <p className="p-4 text-center">Đang đăng nhập...</p>;
}

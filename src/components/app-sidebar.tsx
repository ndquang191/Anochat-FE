"use client";

import * as React from "react";
import { LogOut, Settings } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Bỏ import Avatar
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UserSettingsDialog } from "@/components/user-settings-dialog";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

export function AppSidebar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	const { state } = useSidebar();
	const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
	const [user, setUser] = React.useState<User | null>(null);
	const router = useRouter();

	React.useEffect(() => {
		const fetchUser = async () => {
			const supabase = createClient();
			const { data } = await supabase.auth.getUser();
			if (data?.user) {
				setUser(data.user);
			} else {
				setUser(null);
			}
		};
		fetchUser();
	}, []);

	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/login");
	};

	// You can extend this to fetch more profile info if you store it in user_metadata
	const name = user?.user_metadata?.name || user?.email || "---";
	const age = user?.user_metadata?.age || "---";
	const city = user?.user_metadata?.city || "---";
	const isPublic = user?.user_metadata?.isPublic ?? true;

	// For settings dialog, keep the same structure as before, fallback to --- or default values
	const [userData, setUserData] = React.useState({
		name: name,
		age: age === "---" ? 0 : age,
		city: city === "---" ? "" : city,
		isPublic: isPublic,
		chatType: "text",
	});

	React.useEffect(() => {
		setUserData({
			name: name,
			age: age === "---" ? 0 : age,
			city: city === "---" ? "" : city,
			isPublic: isPublic,
			chatType: "text",
		});
	}, [name, age, city, isPublic]);

	const handleSaveSettings = (newSettings: typeof userData) => {
		setUserData(newSettings);
		setIsSettingsOpen(false);
		// Optionally, update user_metadata in Supabase here
	};

	return (
		<>
			<Sidebar className={cn(className)} {...props}>
				<SidebarHeader>
					<SidebarGroup>
						<SidebarGroupContent className="flex flex-col items-start gap-2 p-4">
							<div className="flex flex-col items-start">
								<span className="text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
									{name}
								</span>
								{state === "expanded" && (
									<>
										<span className="text-sm text-muted-foreground">
											{age !== "---" ? `${age} tuổi, ${city}` : "---"}
										</span>
										<div className="flex items-center gap-2 mt-2">
											<Switch
												id="public-status"
												checked={userData.isPublic}
												onCheckedChange={(checked) =>
													setUserData((prev) => ({ ...prev, isPublic: checked }))
												}
											/>
											<Label htmlFor="public-status" className="text-sm">
												{userData.isPublic ? "Công khai thông tin" : "Riêng tư"}
											</Label>
										</div>
									</>
								)}
							</div>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarHeader>
				<SidebarContent>{/* You can add more navigation items here if needed */}</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={() => setIsSettingsOpen(true)}>
								<Settings />
								<span>Cài đặt</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={handleLogout}>
								<LogOut />
								<span>Đăng xuất</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>

			<UserSettingsDialog
				open={isSettingsOpen}
				onOpenChange={setIsSettingsOpen}
				initialData={userData}
				onSave={handleSaveSettings}
			/>
		</>
	);
}

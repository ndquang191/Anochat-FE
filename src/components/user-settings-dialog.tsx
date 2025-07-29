"use client";

import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

interface UserSettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialData: {
		name: string;
		nickname: string;
		gender: string;
		address: string;
		isVisible: boolean;
	};
	onSave: (data: UserSettingsDialogProps["initialData"]) => void;
}

export function UserSettingsDialog({ open, onOpenChange, initialData, onSave }: UserSettingsDialogProps) {
	const [name, setName] = React.useState(initialData.name);
	const [nickname, setNickname] = React.useState(initialData.nickname);
	// Ensure gender always has a valid value
	const [gender, setGender] = React.useState(() => {
		const validGenders = ['male', 'female', 'other'];
		return validGenders.includes(initialData.gender) ? initialData.gender : 'other';
	});
	const [address, setAddress] = React.useState(initialData.address);
	const [isVisible, setIsVisible] = React.useState(initialData.isVisible);
	const [isLoading, setIsLoading] = React.useState(false);

	console.log('Dialog initialData:', initialData);
	console.log('Current gender state:', gender);

	React.useEffect(() => {
		if (open) {
			setName(initialData.name);
			setNickname(initialData.nickname);
			// Ensure gender is always valid
			const validGenders = ['male', 'female', 'other'];
			const validGender = validGenders.includes(initialData.gender) ? initialData.gender : 'other';
			setGender(validGender);
			setAddress(initialData.address);
			setIsVisible(initialData.isVisible);
			console.log('Dialog opened with gender:', validGender);
		}
	}, [open, initialData]);

	const handleSave = async () => {
		const supabase = createClient();
		setIsLoading(true);
		
		try {
			// Get current user
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			
			if (userError) {
				console.error('Auth error:', userError);
				throw new Error('Không thể xác thực người dùng');
			}
			
			if (!user) {
				throw new Error('Người dùng chưa đăng nhập');
			}

			console.log('Saving user data:', {
				id: user.id,
				name,
				nickname,
				gender,
				address,
				is_visible: isVisible
			});

			// Prepare data for upsert, handling special cases
			const userData = {
				id: user.id,
				name: name && name !== '---' ? name : null,
				nickname: nickname && nickname !== '---' ? nickname : null,
				gender: gender && ['male', 'female', 'other'].includes(gender) ? gender : 'other', // Default to 'other' if not valid
				address: address && address !== '---' ? address : null,
				is_visible: isVisible
			};

			console.log('Processed user data for save:', userData);

			// Try to update/insert user data in the 'users' table
			const { data, error: updateError } = await supabase
				.from('users')
				.upsert(userData, {
					onConflict: 'id'
				});

			if (updateError) {
				console.error('Database error:', updateError);
				throw new Error(`Lỗi cơ sở dữ liệu: ${updateError.message}`);
			}

			console.log('Save successful:', data);
			toast.success("Thông tin đã được lưu thành công!");
			onOpenChange(false);
			
			// Update local state
			onSave({
				name,
				nickname,
				gender,
				address,
				isVisible
			});
		} catch (error) {
			console.error('Error saving user settings:', error);
			const errorMessage = error instanceof Error ? error.message : "Không thể lưu thông tin. Vui lòng thử lại.";
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="h-fit sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Cài đặt tài khoản</DialogTitle>
					<DialogDescription>
						Thay đổi thông tin cá nhân và cài đặt ứng dụng của bạn tại đây.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Tên
						</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="nickname" className="text-right">
							Bí danh
						</Label>
						<Input
							id="nickname"
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="gender" className="text-right">
							Giới tính
						</Label>
						<Select 
							value={gender} 
							onValueChange={(value) => {
								console.log('Gender changed to:', value);
								setGender(value);
							}}
						>
							<SelectTrigger className="col-span-3">
								<SelectValue placeholder="Chọn giới tính" />
							</SelectTrigger>
							<SelectContent className="z-[9999]" position="popper">
								<SelectItem value="male">Nam</SelectItem>
								<SelectItem value="female">Nữ</SelectItem>
								<SelectItem value="other">Khác</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="address" className="text-right">
							Địa chỉ
						</Label>
						<Input
							id="address"
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="visible-info" className="text-right">
							Hiển thị
						</Label>
						<Switch
							id="visible-info"
							checked={isVisible}
							onCheckedChange={setIsVisible}
							className="col-span-3"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
						Hủy
					</Button>
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "Đang lưu..." : "Lưu thay đổi"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

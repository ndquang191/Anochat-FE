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

interface UserSettingsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialData: {
		name: string;
		age: number;
		city: string;
		isPublic: boolean;
		chatType: string;
	};
	onSave: (data: UserSettingsDialogProps["initialData"]) => void;
}

export function UserSettingsDialog({ open, onOpenChange, initialData, onSave }: UserSettingsDialogProps) {
	const [name, setName] = React.useState(initialData.name);
	const [age, setAge] = React.useState(String(initialData.age));
	const [city, setCity] = React.useState(initialData.city);
	const [isPublic, setIsPublic] = React.useState(initialData.isPublic);
	const [chatType, setChatType] = React.useState(initialData.chatType);

	React.useEffect(() => {
		if (open) {
			setName(initialData.name);
			setAge(String(initialData.age));
			setCity(initialData.city);
			setIsPublic(initialData.isPublic);
			setChatType(initialData.chatType);
		}
	}, [open, initialData]);

	const handleSave = () => {
		onSave({
			name,
			age: Number.parseInt(age) || 0,
			city,
			isPublic,
			chatType,
		});
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
						<Label htmlFor="age" className="text-right">
							Tuổi
						</Label>
						<Input
							id="age"
							type="number"
							value={age}
							onChange={(e) => setAge(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="city" className="text-right">
							Thành phố
						</Label>
						<Input
							id="city"
							value={city}
							onChange={(e) => setCity(e.target.value)}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="public-info" className="text-right">
							Công khai
						</Label>
						<Switch
							id="public-info"
							checked={isPublic}
							onCheckedChange={setIsPublic}
							className="col-span-3"
						/>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="chat-type" className="text-right">
							Loại chat
						</Label>
						<Select value={chatType} onValueChange={setChatType}>
							<SelectTrigger id="chat-type" className="col-span-3">
								<SelectValue placeholder="Chọn loại chat" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="text">Văn bản</SelectItem>
								<SelectItem value="voice">Thoại</SelectItem>
								<SelectItem value="video">Video</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Hủy
					</Button>
					<Button onClick={handleSave}>Lưu thay đổi</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

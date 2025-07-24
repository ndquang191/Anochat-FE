"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConnection } from "@/hooks/use-connection";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
	id: number;
	text: string;
	sender: "user" | "other";
}

interface Tip {
	id: number;
	content: string;
}

export function Chatbox() {
	const { isConnected, isConnecting } = useConnection();
	const [messages, setMessages] = React.useState<Message[]>([
		{ id: 1, text: "Chào bạn! Tôi có thể giúp gì cho bạn?", sender: "other" },
		{ id: 2, text: "Chào bạn! Tôi muốn hỏi về sản phẩm X.", sender: "user" },
		{
			id: 3,
			text: "Sản phẩm X có các tính năng A, B, C. Bạn muốn tìm hiểu thêm về tính năng nào?",
			sender: "other",
		},
	]);
	const [tips, setTips] = React.useState<Tip[]>([]);
	const [inputMessage, setInputMessage] = React.useState("");
	const messagesEndRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		// Load tips when component mounts
		fetch("/tips.json")
			.then((res) => res.json())
			.then((data) => setTips(data.tips))
			.catch((err) => console.error("Failed to load tips:", err));
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	React.useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (inputMessage.trim() === "") return;

		const newMessage: Message = {
			id: messages.length + 1,
			text: inputMessage,
			sender: "user",
		};
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setInputMessage("");

		// Simulate a response from "other" after a short delay
		setTimeout(() => {
			const botResponse: Message = {
				id: messages.length + 2,
				text: `Bạn vừa nói: "${inputMessage}". Tôi đã nhận được.`,
				sender: "other",
			};
			setMessages((prevMessages) => [...prevMessages, botResponse]);
		}, 1000);
	};

	if (isConnecting) {
		return (
			<div className="flex flex-col bg-card text-card-foreground shadow-sm h-full p-4 gap-4">
				<div className="text-lg font-semibold">Đang kết nối...</div>
				<div className="space-y-4">
					{tips.map((tip) => (
						<div key={tip.id} className="flex items-start gap-2">
							<div className="w-1 h-1 rounded-full bg-primary mt-2" />
							<p>{tip.content}</p>
						</div>
					))}
					{tips.length === 0 && (
						<>
							<Skeleton className="h-4 w-3/4" />
							<Skeleton className="h-4 w-2/3" />
							<Skeleton className="h-4 w-1/2" />
						</>
					)}
				</div>
			</div>
		);
	}

	if (!isConnected) {
		return (
			<div className="flex items-center justify-center h-full bg-card text-card-foreground">
				<div className="text-center">
					<p className="text-muted-foreground">Chưa kết nối với người trò chuyện</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col bg-card text-card-foreground shadow-sm h-full relative">
			<ScrollArea className="flex-1 p-2 h-[calc(100vh-128px)]">
				<div className="flex flex-col gap-3">
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`max-w-[70%] rounded-lg p-3 ${
									message.sender === "user"
										? "bg-[#516b91] text-white"
										: "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-200"
								}`}
							>
								{message.text}
							</div>
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>
			<form
				onSubmit={handleSendMessage}
				className="absolute bottom-0 left-0 right-0 flex items-center gap-2 border-t p-4 bg-background"
			>
				<Input
					placeholder="Nhập tin nhắn của bạn..."
					value={inputMessage}
					onChange={(e) => setInputMessage(e.target.value)}
					className="flex-1"
				/>
				<Button type="submit" className="shrink-0">
					Gửi
				</Button>
			</form>
		</div>
	);
}

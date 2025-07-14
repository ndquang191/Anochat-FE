"use client";

import { ChatBox } from "@/components/chat-box";
import { useSocketChat } from "@/hooks/use-socket-chat";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { LogoutButton } from "@/components/logout-button";

function ChatPageClient({ email }: { email: string }) {
	const { messages, sendMessage, isConnected, findPartner } = useSocketChat({
		username: email,
	});

	const { containerRef, scrollToBottom } = useChatScroll();
	const [newMessage, setNewMessage] = useState("");

	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newMessage.trim() || !isConnected) return;
		sendMessage(newMessage.trim());
		setNewMessage("");
	};

	return (
		<div className="flex flex-col h-svh w-full items-center justify-center gap-2">
			<div className="w-full max-w-2xl flex-1 flex flex-col">
				<div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-1">
					{messages.length === 0 && (
						<div className="text-center text-sm text-muted-foreground">
							No messages yet. Start the conversation!
						</div>
					)}
					{messages.map((message, idx) => {
						// Bỏ qua message nếu undefined hoặc thiếu createdAt
						if (!message || !message.createdAt) return null;

						const prev = idx > 0 ? messages[idx - 1] : null;
						const showHeader = !prev || prev.user?.name !== message.user?.name;

						return (
							<ChatBox
								key={message.id}
								message={message}
								isOwnMessage={message.user?.name === email}
								showHeader={showHeader}
							/>
						);
					})}
				</div>

				<form onSubmit={handleSend} className="flex w-full gap-2 border-t border-border p-4">
					<Input
						className="rounded-full bg-background text-sm transition-all duration-300"
						type="text"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Type a message..."
						disabled={!isConnected}
					/>
					<button
						className="aspect-square rounded-full bg-primary text-primary-foreground px-4"
						type="submit"
						disabled={!isConnected || !newMessage.trim()}
					>
						Send
					</button>
				</form>
			</div>

			<button
				onClick={() => findPartner("male", "polite")}
				disabled={!isConnected}
				className="bg-primary text-white px-4 py-2 rounded"
			>
				Tìm bạn
			</button>

			<div className="mt-4">
				<LogoutButton />
			</div>
		</div>
	);
}

export default ChatPageClient;

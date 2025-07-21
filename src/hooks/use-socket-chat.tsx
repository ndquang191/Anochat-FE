"use client";

import { useEffect, useState, useCallback } from "react";
import socket from "@/lib/socket";

interface UseSocketChatProps {
	username: string;
}

export interface ChatMessage {
	id: string;
	content: string;
	user: {
		name: string;
	};
	createdAt: string;
}

export function useSocketChat({ username }: UseSocketChatProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [roomId, setRoomId] = useState<string | null>(null);

	useEffect(() => {
		socket.connect();

		// Lắng nghe sự kiện partner_found
		socket.on("partner_found", ({ roomId }) => {
			setRoomId(roomId);
		});

		// Confirm connection
		socket.on("connect", () => {
			setIsConnected(true);
		});

		// Handle incoming message
		socket.on("message", (message: ChatMessage) => {
			setMessages((prev) => [...prev, message]);
		});

		return () => {
			socket.off("partner_found");
			socket.off("connect");
			socket.off("message");
			socket.disconnect();
		};
	}, [username]);

	const sendMessage = useCallback(
		(content: string) => {
			if (!roomId) return;
			const message: ChatMessage = {
				id: crypto.randomUUID(),
				content,
				user: { name: username },
				createdAt: new Date().toISOString(),
			};
			// Emit message to server
			socket.emit("message", { room: roomId, message });
			// Add to local state
			setMessages((prev) => [...prev, message]);
		},
		[roomId, username]
	);

	return { messages, sendMessage, isConnected, roomId };
}

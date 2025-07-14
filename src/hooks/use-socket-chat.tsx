// hooks/use-socket-chat.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatMessage {
	id: string;
	content: string;
	user: {
		name: string;
	};
	createdAt: string;
}

interface UseSocketChatProps {
	username: string;
}

export function useSocketChat({ username }: UseSocketChatProps) {
	const socketRef = useRef<Socket | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [roomId, setRoomId] = useState<string | null>(null);

	// Kết nối socket
	useEffect(() => {
		const socket = io(process.env.NEXT_PUBLIC_API_URL!); // đổi lại địa chỉ BE nếu cần
		socketRef.current = socket;

		socket.on("connect", () => {
			setIsConnected(true);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
		});

		socket.on("message", (message: ChatMessage) => {
			setMessages((prev) => [...prev, message]);
		});

		// Nhận roomId sau khi ghép đôi
		socket.on("partner_found", ({ roomId }) => {
			setRoomId(roomId);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	// Gửi yêu cầu tìm bạn
	const findPartner = useCallback((gender: string, category: string) => {
		socketRef.current?.emit("find_partner", { gender, category });
	}, []);

	// Gửi tin nhắn
	const sendMessage = useCallback(
		(content: string) => {
			if (!roomId) return;
			const message: ChatMessage = {
				id: crypto.randomUUID(),
				content,
				user: {
					name: username,
				},
				createdAt: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, message]);

			socketRef.current?.emit("send_message", { roomId, ...message });
		},
		[roomId, username]
	);

	return {
		isConnected,
		messages,
		sendMessage,
		findPartner,
		roomId,
	};
}

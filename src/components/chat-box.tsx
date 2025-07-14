import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/hooks/use-socket-chat";

interface ChatMessageItemProps {
	message: ChatMessage;
	isOwnMessage: boolean;
	showHeader: boolean;
}

export const ChatBox = ({ message, isOwnMessage, showHeader }: ChatMessageItemProps) => {
	const time = new Date(message.createdAt).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	return (
		<div className={cn("flex mt-2", isOwnMessage ? "justify-end" : "justify-start")}>
			<div className={cn("max-w-[75%] w-fit flex flex-col gap-1", isOwnMessage && "items-end")}>
				{showHeader && (
					<div
						className={cn(
							"flex items-center gap-2 text-xs px-3",
							isOwnMessage ? "justify-end flex-row-reverse" : ""
						)}
					>
						<span className="font-medium">{message.user.name}</span>
						<span className="text-foreground/50">{time}</span>
					</div>
				)}

				<div
					className={cn(
						"py-2 px-3 rounded-xl text-sm w-fit break-words",
						isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
					)}
				>
					{message.content}
				</div>
			</div>
		</div>
	);
};

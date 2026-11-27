import { useEffect, useState } from "react";
import { BUBBLE_MS } from "../config";

interface BubbleProps {
  message?: string;
  messageId: number;
}

export function Bubble({ message, messageId }: BubbleProps) {
  const [expiredMessageId, setExpiredMessageId] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setExpiredMessageId(messageId),
      BUBBLE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [messageId]);

  const visible = message !== undefined && expiredMessageId !== messageId;

  return (
    <div className="pagi-bubble" aria-live="polite">
      {visible && (
        <p key={messageId} className="pagi-bubble-text">
          {message}
        </p>
      )}
    </div>
  );
}

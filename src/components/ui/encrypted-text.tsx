"use client";

import React, { useState, useEffect } from "react";

interface EncryptedTextProps {
  text: string;
  encryptedClassName?: string;
  revealedClassName?: string;
  revealDelayMs?: number;
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  encryptedClassName = "text-neutral-500",
  revealedClassName = "text-black dark:text-white",
  revealDelayMs = 50,
}) => {
  const getEncryptedText = () => {
    return text.split("").map(() => characters[Math.floor(Math.random() * characters.length)]).join("");
  };

  const [displayText, setDisplayText] = useState<string>(getEncryptedText());
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    setIsRevealed(false);
    setDisplayText(getEncryptedText());

    // Calculate delay to make animation exactly 1.2 seconds (1200ms) regardless of text length
    const totalDuration = 1200; // 1.2 seconds
    const delay = text.length > 0 ? totalDuration / text.length : revealDelayMs;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText((prev) => {
          const newText = text.slice(0, currentIndex + 1) + prev.slice(currentIndex + 1);
          return newText;
        });
        currentIndex++;
      } else {
        setIsRevealed(true);
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [text, revealDelayMs]);

  return (
    <span className={isRevealed ? revealedClassName : encryptedClassName}>
      {displayText}
    </span>
  );
};


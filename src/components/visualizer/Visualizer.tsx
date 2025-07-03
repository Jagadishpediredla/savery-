'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

export function Visualizer() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! How can I help you analyze your finances today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        // Mock AI response
        setTimeout(() => {
            const aiResponse: Message = { id: Date.now() + 1, text: `I received your message: "${input}". I'm still learning, but soon I'll be able to generate charts and insights for you.`, sender: 'ai' };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);

        setInput('');
    };

    return (
        <Card className="h-full flex flex-col">
            <CardContent className="flex-grow p-0 flex flex-col">
                <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        <AnimatePresence>
                        {messages.map(message => (
                            <motion.div
                                key={message.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}
                            >
                                {message.sender === 'ai' && (
                                    <Avatar>
                                        <AvatarFallback className="bg-primary/20 text-primary">
                                            <Bot />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-sm p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <p className="text-sm">{message.text}</p>
                                </div>
                                {message.sender === 'user' && (
                                     <Avatar>
                                        <AvatarFallback>
                                            <User />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </motion.div>
                        ))}
                        </AnimatePresence>
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-transparent">
                    <form onSubmit={handleSubmit} className="relative">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your spending, goals, or request a chart..."
                            className="pr-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border-white/10 focus-visible:ring-2 focus-visible:ring-primary"
                        />
                        <Button type="submit" size="icon" className="absolute top-1.5 right-1.5 h-9 w-9 rounded-full">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}

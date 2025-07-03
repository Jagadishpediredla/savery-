'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageWrapper } from "@/components/PageWrapper";


interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

const WelcomeCard = ({ onPromptClick }: { onPromptClick: (prompt: string) => void }) => {
    const examplePrompts = [
        "Show me a pie chart of my spending last month.",
        "How much did I spend on 'Dining Out' in July?",
        "Compare my income vs expenses for the last 3 months."
    ];

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/20 rounded-full text-primary">
                        <Sparkles className="w-8 h-8" />
                    </div>
                </div>
                <CardTitle className="text-center text-2xl">Hello There! I'm your Visualizer AI.</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">I can help you understand your finances. Ask me anything or try one of these prompts to get started:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {examplePrompts.map(prompt => (
                        <Button key={prompt} variant="outline" onClick={() => onPromptClick(prompt)}>
                            {prompt}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function VisualizerPage() {
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

    const handlePromptClick = (prompt: string) => {
        setInput(prompt);
    }
    
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
        <PageWrapper>
             <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Visualizer AI</h1>
                    <p className="text-muted-foreground">
                        Your personal finance assistant. Ask anything about your data.
                    </p>
                </header>
                <div className="h-[65vh] flex flex-col">
                    {messages.length <= 1 ? (
                        <div className="flex-grow flex items-center justify-center">
                            <WelcomeCard onPromptClick={handlePromptClick} />
                        </div>
                    ) : (
                        <Card className="h-full flex flex-col flex-grow">
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
                                                <div className={`max-w-sm p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card/80'}`}>
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
                            </CardContent>
                        </Card>
                    )}
                     <div className="p-4 border-t-0 bg-transparent mt-4">
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
                </div>
            </div>
        </PageWrapper>
    );
}

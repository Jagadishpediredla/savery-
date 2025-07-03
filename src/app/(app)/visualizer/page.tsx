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
import { financialAssistant } from '@/ai/flows/financial-assistant-flow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: number;
    role: 'user' | 'model'; // 'model' is the term Genkit uses for AI
    content: string;
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
        { id: 1, role: 'model', content: "Hello! I'm FinanceFlow, your personal finance assistant. How can I help you understand your finances today?" }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handlePromptClick = (prompt: string) => {
        setInput(prompt);
    }
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;

        const userMessage: Message = { id: Date.now(), role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsThinking(true);

        try {
            const historyForApi = newMessages.slice(0, -1).map(msg => ({
                role: msg.role,
                content: [{ text: msg.content }]
            }));

            const responseText = await financialAssistant({ prompt: input, history: historyForApi });

            const aiResponse: Message = { id: Date.now() + 1, role: 'model', content: responseText };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Error calling financial assistant:", error);
            const errorMessage: Message = { id: Date.now() + 1, role: 'model', content: "Sorry, I ran into a problem while thinking. Please check the server logs or try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsThinking(false);
        }
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
                    {messages.length <= 1 && !isThinking ? (
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
                                                className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                                            >
                                                {message.role === 'model' && (
                                                    <Avatar>
                                                        <AvatarFallback className="bg-primary/20 text-primary">
                                                            <Bot />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={`max-w-prose p-3 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card/80'}`}>
                                                     <ReactMarkdown
                                                        className="prose prose-sm dark:prose-invert prose-p:my-0 prose-headings:my-1 prose-table:my-2 prose-td:p-2 prose-th:p-2"
                                                        remarkPlugins={[remarkGfm]}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                                {message.role === 'user' && (
                                                     <Avatar>
                                                        <AvatarFallback>
                                                            <User />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </motion.div>
                                        ))}
                                        </AnimatePresence>
                                        {isThinking && (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-start gap-3"
                                            >
                                                <Avatar>
                                                    <AvatarFallback className="bg-primary/20 text-primary"><Bot /></AvatarFallback>
                                                </Avatar>
                                                <div className="p-3 rounded-lg bg-card/80 flex items-center gap-2">
                                                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></div>
                                                </div>
                                            </motion.div>
                                        )}
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
                                placeholder="e.g., How much did I spend on groceries last month?"
                                className="pr-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border-white/10 focus-visible:ring-2 focus-visible:ring-primary"
                                disabled={isThinking}
                            />
                            <Button type="submit" size="icon" className="absolute top-1.5 right-1.5 h-9 w-9 rounded-full" disabled={isThinking}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}

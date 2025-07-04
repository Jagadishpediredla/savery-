
'use client';

import { useState, useRef, useEffect } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Trash2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '../ui/skeleton';

export function ChatInterface() {
    const { aiHistory, sendChatMessage, clearAiHistory, loading } = useFirebase();
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [aiHistory]);

    const handleSend = async () => {
        if (!input.trim() || isSending) return;
        
        const currentInput = input;
        setInput('');
        setIsSending(true);

        try {
            await sendChatMessage(currentInput);
        } catch (error) {
            console.error('Failed to send message:', error);
            setInput(currentInput); // Restore input on error
        } finally {
            setIsSending(false);
        }
    };
    
    const handleClearHistory = async () => {
        await clearAiHistory();
    };

    if (loading) {
        return (
            <Card className="h-[calc(100vh-220px)] w-full flex flex-col bg-card/60 backdrop-blur-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48 mt-2" />
                    </div>
                     <Skeleton className="h-10 w-10 rounded-full" />
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end gap-4">
                    <div className="space-y-4">
                         <Skeleton className="h-16 w-3/4" />
                         <Skeleton className="h-12 w-1/2 ml-auto" />
                         <Skeleton className="h-20 w-4/5" />
                    </div>
                     <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-[calc(100vh-220px)] w-full flex flex-col bg-card/60 backdrop-blur-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Conversation</CardTitle>
                    <CardDescription>Chat with your financial assistant.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClearHistory} disabled={aiHistory.length === 0}>
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Clear history</span>
                </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                <ScrollArea className="flex-1 pr-4" viewportRef={viewportRef}>
                    <div className="space-y-6">
                        {aiHistory.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : '')}>
                                {message.role === 'model' && (
                                    <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                                       <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-xl rounded-2xl p-4",
                                    message.role === 'user' 
                                        ? 'bg-primary/90 text-primary-foreground rounded-br-none' 
                                        : 'bg-muted/80 rounded-bl-none'
                                )}>
                                    <ReactMarkdown 
                                        className="prose dark:prose-invert prose-p:leading-relaxed prose-p:m-0 prose-headings:my-2 prose-table:my-2"
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            table: ({node, ...props}) => <table className="table-auto w-full text-sm" {...props} />,
                                            thead: ({node, ...props}) => <thead className="font-semibold border-b" {...props} />,
                                            tbody: ({node, ...props}) => <tbody className="divide-y divide-border" {...props} />,
                                            tr: ({node, ...props}) => <tr className="[&>td]:p-2" {...props} />,
                                            td: ({node, ...props}) => <td className="p-2 align-top" {...props} />,
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                                {message.role === 'user' && (
                                     <Avatar className="h-8 w-8 bg-secondary">
                                       <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                                     </Avatar>
                                )}
                            </div>
                        ))}
                         {isSending && (
                            <div className="flex items-start gap-4">
                                <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                                    <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                                </Avatar>
                                <div className="max-w-xl rounded-2xl p-4 bg-muted/80 rounded-bl-none">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="relative">
                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your finances..."
                            className="pr-12"
                            disabled={isSending}
                            autoComplete="off"
                        />
                        <Button 
                            type="submit" 
                            size="icon" 
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                            disabled={isSending || !input.trim()}
                        >
                            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}

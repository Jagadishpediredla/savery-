
'use client';

import { Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useState } from "react";
import { ManageCategoriesDialog } from "../settings/ManageCategoriesDialog";
import { BucketType } from "@/lib/types";

interface TransactionFiltersProps {
    filters: {
        searchTerm: string;
        category: string;
        transactionType: 'All' | 'Credit' | 'Debit';
    };
    onFilterChange: (key: keyof TransactionFiltersProps['filters'], value: any) => void;
    categories: string[];
    clearFilters: () => void;
    bucketType: BucketType;
}

export function TransactionFilters({ filters, onFilterChange, categories, clearFilters, bucketType }: TransactionFiltersProps) {
    const hasActiveFilters = filters.searchTerm || filters.category !== 'All' || filters.transactionType !== 'All';
    const [isManageOpen, setIsManageOpen] = useState(false);
    
    return (
        <>
            <Collapsible className="space-y-4">
                <div className="flex items-center justify-between">
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </CollapsibleTrigger>
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    )}
                </div>
                <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border rounded-lg bg-card/50">
                        <Select
                            value={filters.category}
                            onValueChange={(value) => onFilterChange('category', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Search notes..."
                            value={filters.searchTerm}
                            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                        />

                        <ToggleGroup
                            type="single"
                            variant="outline"
                            value={filters.transactionType}
                            onValueChange={(value) => onFilterChange('transactionType', value || 'All')}
                            className="gap-2 col-span-1 md:col-span-2 lg:col-span-1"
                        >
                            <ToggleGroupItem value="All" className="w-full">All</ToggleGroupItem>
                            <ToggleGroupItem value="Debit" className="w-full">Debit</ToggleGroupItem>
                            <ToggleGroupItem value="Credit" className="w-full">Credit</ToggleGroupItem>
                        </ToggleGroup>
                         <Button type="button" variant="outline" size="sm" onClick={() => setIsManageOpen(true)} className="md:col-start-2 lg:col-start-auto">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Manage Categories
                        </Button>
                    </div>
                </CollapsibleContent>
            </Collapsible>
            <ManageCategoriesDialog isOpen={isManageOpen} onOpenChange={setIsManageOpen} bucketType={bucketType} />
        </>
    );
}


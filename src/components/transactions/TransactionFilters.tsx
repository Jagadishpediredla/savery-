
'use client';

import { Filter, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DateRangePicker } from "../ui/date-range-picker";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type { Transaction } from "@/lib/types";

interface TransactionFiltersProps {
    filters: {
        dateRange: DateRange | undefined;
        searchTerm: string;
        category: string;
        transactionType: 'All' | 'Credit' | 'Debit';
    };
    onFilterChange: (key: keyof TransactionFiltersProps['filters'], value: any) => void;
    categories: string[];
    clearFilters: () => void;
}

export function TransactionFilters({ filters, onFilterChange, categories, clearFilters }: TransactionFiltersProps) {
    const hasActiveFilters = filters.dateRange || filters.searchTerm || filters.category !== 'All' || filters.transactionType !== 'All';
    return (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border rounded-lg">
                    <DateRangePicker
                        date={filters.dateRange}
                        onDateChange={(value) => onFilterChange('dateRange', value)}
                    />
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
                        className="gap-2"
                    >
                        <ToggleGroupItem value="All" className="w-full">All</ToggleGroupItem>
                        <ToggleGroupItem value="Debit" className="w-full">Debit</ToggleGroupItem>
                        <ToggleGroupItem value="Credit" className="w-full">Credit</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

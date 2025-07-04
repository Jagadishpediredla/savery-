
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
import type { DateRange } from "react-day-picker";
import { DateRangePicker } from "../ui/date-range-picker";

interface TransactionFiltersProps {
    filters: {
        searchTerm: string;
        category: string;
        transactionType: 'All' | 'Credit' | 'Debit';
        bucketType?: BucketType | 'All';
        dateRange?: DateRange;
    };
    onFilterChange: (key: keyof TransactionFiltersProps['filters'], value: any) => void;
    categories: string[];
    clearFilters: () => void;
    bucketType?: BucketType; // from individual pages
    bucketTypes?: (BucketType | 'All')[]; // from dashboard
}

export function TransactionFilters({ filters, onFilterChange, categories, clearFilters, bucketType, bucketTypes }: TransactionFiltersProps) {
    const hasActiveFilters = filters.searchTerm || filters.category !== 'All' || filters.transactionType !== 'All' || (bucketTypes && filters.bucketType !== 'All') || filters.dateRange;
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-card/50">
                        
                        <div className="md:col-span-2">
                            <DateRangePicker 
                                date={filters.dateRange}
                                onDateChange={(date) => onFilterChange('dateRange', date)}
                            />
                        </div>
                       
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
                            className="w-full grid grid-cols-3"
                        >
                            <ToggleGroupItem value="All" className="w-full">All</ToggleGroupItem>
                            <ToggleGroupItem value="Debit" className="w-full">Debit</ToggleGroupItem>
                            <ToggleGroupItem value="Credit" className="w-full">Credit</ToggleGroupItem>
                        </ToggleGroup>
                        
                        {bucketTypes && (
                            <Select
                                value={filters.bucketType}
                                onValueChange={(value) => onFilterChange('bucketType', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Account Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bucketTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        
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

                         {bucketType && (
                             <Button type="button" variant="outline" size="sm" onClick={() => setIsManageOpen(true)} className="lg:col-span-1">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Manage Categories
                            </Button>
                         )}
                    </div>
                </CollapsibleContent>
            </Collapsible>
            {bucketType && <ManageCategoriesDialog isOpen={isManageOpen} onOpenChange={setIsManageOpen} bucketType={bucketType} />}
        </>
    );
}

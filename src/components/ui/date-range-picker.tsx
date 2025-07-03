
"use client"

import * as React from "react"
import { format, addDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Calendar as CalendarIcon, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface DateRangePickerProps extends React.ComponentProps<"div"> {
    date: DateRange | undefined;
    onDateChange: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  date,
  onDateChange
}: DateRangePickerProps) {

  const handlePresetChange = (value: string) => {
    const now = new Date();
    switch (value) {
        case "today":
            onDateChange({ from: now, to: now });
            break;
        case "yesterday":
            onDateChange({ from: addDays(now, -1), to: addDays(now, -1) });
            break;
        case "this_month":
            onDateChange({ from: new Date(now.getFullYear(), now.getMonth(), 1), to: new Date(now.getFullYear(), now.getMonth() + 1, 0) });
            break;
        case "last_month":
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            onDateChange({ from: lastMonth, to: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0) });
            break;
        default:
             onDateChange(undefined);
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <div className="flex items-center gap-2">
            <PopoverTrigger asChild>
            <Button
                id="date"
                variant={"outline"}
                className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
                )}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                date.to ? (
                    <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                    </>
                ) : (
                    format(date.from, "LLL dd, y")
                )
                ) : (
                <span>Pick a date</span>
                )}
            </Button>
            </PopoverTrigger>
            {date && <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => onDateChange(undefined)}><X className="h-4 w-4" /></Button>}
        </div>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="p-2 border-r">
                <Select onValueChange={handlePresetChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Presets" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="this_month">This Month</SelectItem>
                        <SelectItem value="last_month">Last Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={onDateChange}
                numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

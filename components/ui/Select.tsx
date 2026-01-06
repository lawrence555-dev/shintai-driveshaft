"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

// Custom Select Trigger
const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={`
            flex w-full items-center justify-between
            p-4 rounded-xl border-2 border-gray-100
            bg-white font-bold text-brand-gray
            outline-none transition-all
            focus:border-brand-orange
            hover:border-gray-200
            disabled:cursor-not-allowed disabled:opacity-50
            data-[placeholder]:text-gray-400
            ${className || ""}
        `}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-5 w-5 text-brand-orange transition-transform duration-200" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Custom Select Content with animation
const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={`
                relative z-50 max-h-[300px] min-w-[8rem] overflow-hidden
                rounded-2xl border-2 border-gray-100 bg-white shadow-2xl
                data-[state=open]:animate-in data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
                data-[side=bottom]:slide-in-from-top-2
                data-[side=left]:slide-in-from-right-2
                data-[side=right]:slide-in-from-left-2
                data-[side=top]:slide-in-from-bottom-2
                ${position === "popper" ? "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1" : ""}
                ${className || ""}
            `}
            position={position}
            {...props}
        >
            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1 bg-white">
                <ChevronUp className="h-4 w-4 text-gray-400" />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport
                className={`p-2 ${position === "popper" ? "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]" : ""}`}
            >
                {children}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1 bg-white">
                <ChevronDown className="h-4 w-4 text-gray-400" />
            </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

// Custom Select Item with orange hover
const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={`
            relative flex w-full cursor-pointer select-none items-center
            rounded-xl py-3 px-4 pr-10
            text-brand-gray font-bold outline-none
            transition-all duration-150
            hover:bg-brand-orange hover:text-white
            focus:bg-brand-orange focus:text-white
            data-[highlighted]:bg-brand-orange data-[highlighted]:text-white
            data-[disabled]:pointer-events-none data-[disabled]:opacity-50
            ${className || ""}
        `}
        {...props}
    >
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// Export components
export {
    SelectPrimitive as Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
};

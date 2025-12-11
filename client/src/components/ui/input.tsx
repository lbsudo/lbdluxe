import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
    showSearchIcon?: boolean;
}

function Input({ className, type, showSearchIcon = false, ...props }: InputProps) {
    if (showSearchIcon) {
        return (
            <div className="relative flex flex-row
      items-center w-full py-2 px-2">
                <Search className=" h-6 w-6 text-muted-foreground pointer-events-none translate-y-0.5" />
                <input
                    type={type}
                    data-slot="input"
                    className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-8 w-full min-w-0 bg-transparent pl-2 pr-3 text-base outline-none border-0 ring-0 shadow-none transition-colors file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ",
                        "focus:outline-none focus:ring-0 focus:border-0 ",
                        "focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0",
                        "placeholder:leading-none placeholder:translate-y-1 placeholder:text-xl",
                        className
                    )}
                    {...props}
                />
            </div>
        )
    }

    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    )
}

export { Input }

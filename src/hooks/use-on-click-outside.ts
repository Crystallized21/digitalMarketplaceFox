import { RefObject, useEffect } from "react";

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: (event: Event) => void
) => {
    useEffect(() => {
        // Listener to detect click or touch events
        const listener = (event: Event) => {
            const el = ref?.current;
            if (!el || el.contains((event?.target as Node) || null)) {
                return;
            }

            handler(event); // Call the handler only if the click is outside the element passed.
        };

        // Add event listeners for mousedown and touchstart events
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        // Cleanup function to remove event listeners
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]); // Reload only if ref or handler changes
};
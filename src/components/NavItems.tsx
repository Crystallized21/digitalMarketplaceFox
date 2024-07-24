"use client"

import React, {useEffect, useRef, useState} from "react";
import {PRODUCT_CATEGORIES} from "@/config";
import NavItem from "@/components/NavItem";
import {useOnClickOutside} from "@/hooks/use-on-click-outside";

const NavItems = () => {
    // State to track the currently active (opened) navigation item by index, null when none are active
    const [activeIndex, setActiveIndex] = useState<
        null | number
    >(null)

    // Close the navigation item when pressing the escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveIndex(null)
            }
        }
        document.addEventListener("keydown", handler)

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener("keydown", handler)
        }
    }, []);

    // Determine if any navigation item is open
    const isAnyOpen = activeIndex !== null;

    const navRef = useRef<HTMLDivElement | null>(null)

    // Close the navigation item when clicking outside of navigation
    useOnClickOutside(navRef, () => setActiveIndex(null))

    return (
        <div className='flex gap-4 h-full' ref={navRef}>
            {PRODUCT_CATEGORIES.map((category, i) => {
                // Function to handle opening/closing of navigation items
                const handleOpen = () => {
                    if (activeIndex === i) {
                        setActiveIndex(null)
                    } else {
                        setActiveIndex(i)
                    }
                }

                // Determine if the current item is open based on activeIndex
                const isOpen = i === activeIndex

                // Render the NavItem component for each category
                return (
                    <NavItem
                        category={category}
                        handleOpen={handleOpen}
                        isOpen={isOpen}
                        key={category.value}
                        isAnyOpen={isAnyOpen}
                    />
                )
            })}
        </div>
    )
};

export default NavItems;
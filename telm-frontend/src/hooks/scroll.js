import {useEffect, useState} from "react";

function useScrollBehavior(scrollingElementRef, isMobile, isLoading) {
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        const scrollingElement = scrollingElementRef.current;
        if (scrollingElement && isMobile) {
            const handleScroll = () => {
                if (scrollingElement.scrollTop > 20 && !hasScrolled) {
                    setHasScrolled(true);
                } else if (scrollingElement.scrollTop <= 20 && hasScrolled) {
                    setHasScrolled(false);
                }
            };

            scrollingElement.addEventListener("scroll", handleScroll);

            return () => {
                // Cleanup: Remove the event listener when the component unmounts
                scrollingElement.removeEventListener("scroll", handleScroll);
            };
        }
    }, [hasScrolled, scrollingElementRef, isLoading]);

    return hasScrolled;
}

export default useScrollBehavior;
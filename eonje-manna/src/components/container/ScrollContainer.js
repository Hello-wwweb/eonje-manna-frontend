import React, { useEffect, useRef, useState } from 'react';
import './ScrollContainer.css';
import ArrowButton from '../button/ArrowButton';


function ScrollContainer({ children, className }) {
    const scrollContainerRef = useRef(null);
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        const container = scrollContainerRef.current;
        // 컨테이너의 스크롤 너비와 클라이언트 너비 비교
        setShowButtons(container.scrollWidth > container.clientWidth);
    }, [children]);

    const scrollContent = (direction) => {
        const container = scrollContainerRef.current;
        const scrollAmount = 300; // 한 번에 스크롤할 거리
        if (direction === 'left') container.scrollLeft -= scrollAmount;
        if (direction === 'right') container.scrollLeft += scrollAmount;
    };

    return (
        <div className={`scroll-container ${className}`}>
        {showButtons && (
            <ArrowButton direction="left" onClick={() => scrollContent('left')} />
        )}
        <div className="scroll-content" ref={scrollContainerRef}>
            {children}
        </div>
        {showButtons && (
            <ArrowButton direction="right" onClick={() => scrollContent('right')} />
        )}
        </div>
    );
}

export default ScrollContainer;
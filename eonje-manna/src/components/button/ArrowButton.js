import React from 'react';
import './ArrowButton.css';
import { BsCaretLeftFill, BsCaretRightFill } from 'react-icons/bs';
import './ArrowButton.css'

function ArrowButton({ direction, onClick }) {
    return (
        <button
        className={`arrow-button ${direction}`}
        onClick={onClick}
        aria-label={`Scroll ${direction}`}
        >
        {direction === 'left' ? <BsCaretLeftFill /> : <BsCaretRightFill />}
        </button>
    );
}

export default ArrowButton;

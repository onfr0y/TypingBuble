import { useState, useEffect, useRef } from 'react';
import './TypingArea.css';
import PenCursor from './PenCursor';

interface TypingAreaProps {
    onType: (x: number, y: number, char: string) => void;
}

const WORDS = [
    "essence", "focus", "breathe", "bubble", "float", "drift", "light",
    "coding", "react", "design", "glass", "prism", "vibrant", "nebula",
    "galaxy", "orbit", "spark", "dream", "create", "inspire", "flow",
    "motion", "pixel", "render", "shader", "bloom", "canvas", "style",
    "ink", "quill", "parchment", "silence", "echo", "wisdom", "path"
];

export default function TypingArea({ onType }: TypingAreaProps) {
    const [text, setText] = useState('');
    const [userInput, setUserInput] = useState('');
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

    // Cursor Tracking
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const totalStrokes = useRef(0);
    const correctStrokes = useRef(0);

    // Initialize text
    useEffect(() => {
        // Generate 30 words
        const newText = Array.from({ length: 30 }, () => WORDS[Math.floor(Math.random() * WORDS.length)]).join(' ');
        setText(newText);
        charRefs.current = new Array(newText.length).fill(null);
    }, []);

    // Update cursor position and handle typing
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore modifier keys
            if (e.metaKey || e.ctrlKey || e.altKey) return;

            const currentIdx = userInput.length;

            if (!startTime) {
                setStartTime(Date.now());
            }

            totalStrokes.current += 1;

            if (e.key === 'Backspace') {
                setUserInput(prev => prev.slice(0, -1));
                return;
            }

            if (e.key.length === 1) {
                // Typing a character
                if (currentIdx < text.length) {
                    const charElement = charRefs.current[currentIdx];
                    const isCorrect = e.key === text[currentIdx];

                    if (isCorrect) correctStrokes.current += 1;

                    if (charElement) {
                        const rect = charElement.getBoundingClientRect();
                        const x = rect.left + rect.width / 2;
                        const y = rect.top + rect.height / 2;
                        onType(x, y, e.key);
                    }

                    setUserInput(prev => prev + e.key);
                    if (e.key === ' ') e.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [userInput, text, onType, startTime]);

    // Track active cursor position
    useEffect(() => {
        const currentIdx = userInput.length;
        if (currentIdx < text.length && charRefs.current[currentIdx]) {
            const el = charRefs.current[currentIdx];
            if (el) {
                const rect = el.getBoundingClientRect();
                // Position pen tip slightly to the right/bottom of center
                setCursorPos({
                    x: rect.left,
                    y: rect.bottom - 5
                });
            }
        }
    }, [userInput, text]);


    // Update Stats Effect
    useEffect(() => {
        if (!startTime) return;
        const interval = setInterval(() => {
            const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
            const currentWpm = Math.round((userInput.length / 5) / timeElapsed) || 0;
            // Accuracy: correct strokes / total strokes (simple approximation)
            const currentAcc = Math.round((correctStrokes.current / totalStrokes.current) * 100) || 100;

            setWpm(currentWpm);
            setAccuracy(currentAcc);
        }, 500);
        return () => clearInterval(interval);
    }, [startTime, userInput.length]);

    return (
        <div className="typing-container">
            <PenCursor x={cursorPos.x} y={cursorPos.y} />

            <div className="stats-bar">
                <div className="stat-item">WPM: <span>{wpm}</span></div>
                <div className="stat-item">ACC: <span>{accuracy}%</span></div>
            </div>
            <div className="typing-box glass-panel">
                {text.split('').map((char, index) => {
                    let className = 'char';
                    if (index < userInput.length) {
                        className += userInput[index] === char ? ' correct' : ' incorrect';
                    } else if (index === userInput.length) {
                        className += ' active';
                    }

                    return (
                        <span
                            key={index}
                            ref={el => { charRefs.current[index] = el; }}
                            className={className}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>
            <div className="instruction">Start typing to see ink...</div>
        </div>
    );
}


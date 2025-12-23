import { useRef } from 'react';
import TypingArea from './components/TypingArea';
import BubbleEffect, { type BubbleHandle } from './components/BubbleEffect';
import './App.css';

function App() {
  const bubbleRef = useRef<BubbleHandle>(null);

  const handleType = (x: number, y: number, char: string) => {
    bubbleRef.current?.spawn(x, y, char);
  };

  return (
    <div className="app-layout">
      <BubbleEffect ref={bubbleRef} />

      <header>
        <div className="logo">TypeBubble</div>
      </header>

      <main>
        <TypingArea onType={handleType} />
      </main>

      <footer>
        <p>Type to float.</p>
      </footer>
    </div>
  );
}

export default App;

import { useState, useRef, useEffect, useCallback } from 'react';

// VS Code-like icons
const FileIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 9h5.5L13 3.5V9M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.11.89-2 2-2m9 16v-2H6v2h9m3-4v-2H6v2h12z"/>
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const StopIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z"/>
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

// Token types for syntax highlighting
type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'function' | 'boolean' | 'operator' | 'plain' | 'tag' | 'attribute' | 'decorator';

interface Token {
  type: TokenType;
  value: string;
}

// Autocomplete suggestion icons
const SUGGESTION_ICONS: Record<string, { icon: string; color: string }> = {
  keyword: { icon: '⬜', color: 'text-[#569cd6]' },
  function: { icon: '🟪', color: 'text-[#dcdcaa]' },
  variable: { icon: '🟦', color: 'text-[#9cdcfe]' },
  method: { icon: '🟣', color: 'text-[#dcdcaa]' },
  property: { icon: '⬛', color: 'text-[#9cdcfe]' },
  snippet: { icon: '🔲', color: 'text-[#ce9178]' },
  class: { icon: '🟧', color: 'text-[#4ec9b0]' },
  interface: { icon: '🟡', color: 'text-[#4ec9b0]' },
  module: { icon: '📦', color: 'text-[#d4d4d4]' },
  constant: { icon: '🔵', color: 'text-[#4fc1ff]' },
};

// Common code suggestions database
const SUGGESTION_DB: { word: string; kind: string; detail: string }[] = [
  // Keywords
  { word: 'const', kind: 'keyword', detail: 'keyword' },
  { word: 'let', kind: 'keyword', detail: 'keyword' },
  { word: 'var', kind: 'keyword', detail: 'keyword' },
  { word: 'function', kind: 'keyword', detail: 'keyword' },
  { word: 'return', kind: 'keyword', detail: 'keyword' },
  { word: 'if', kind: 'keyword', detail: 'keyword' },
  { word: 'else', kind: 'keyword', detail: 'keyword' },
  { word: 'for', kind: 'keyword', detail: 'keyword' },
  { word: 'while', kind: 'keyword', detail: 'keyword' },
  { word: 'class', kind: 'keyword', detail: 'keyword' },
  { word: 'import', kind: 'keyword', detail: 'keyword' },
  { word: 'export', kind: 'keyword', detail: 'keyword' },
  { word: 'default', kind: 'keyword', detail: 'keyword' },
  { word: 'from', kind: 'keyword', detail: 'keyword' },
  { word: 'async', kind: 'keyword', detail: 'keyword' },
  { word: 'await', kind: 'keyword', detail: 'keyword' },
  { word: 'try', kind: 'keyword', detail: 'keyword' },
  { word: 'catch', kind: 'keyword', detail: 'keyword' },
  { word: 'finally', kind: 'keyword', detail: 'keyword' },
  { word: 'throw', kind: 'keyword', detail: 'keyword' },
  { word: 'new', kind: 'keyword', detail: 'keyword' },
  { word: 'this', kind: 'keyword', detail: 'keyword' },
  { word: 'typeof', kind: 'keyword', detail: 'keyword' },
  { word: 'instanceof', kind: 'keyword', detail: 'keyword' },
  { word: 'interface', kind: 'keyword', detail: 'keyword' },
  { word: 'type', kind: 'keyword', detail: 'keyword' },
  { word: 'extends', kind: 'keyword', detail: 'keyword' },
  { word: 'implements', kind: 'keyword', detail: 'keyword' },
  { word: 'switch', kind: 'keyword', detail: 'keyword' },
  { word: 'case', kind: 'keyword', detail: 'keyword' },
  { word: 'break', kind: 'keyword', detail: 'keyword' },
  { word: 'continue', kind: 'keyword', detail: 'keyword' },
  { word: 'void', kind: 'keyword', detail: 'keyword' },
  { word: 'delete', kind: 'keyword', detail: 'keyword' },
  { word: 'enum', kind: 'keyword', detail: 'keyword' },
  { word: 'static', kind: 'keyword', detail: 'keyword' },
  { word: 'readonly', kind: 'keyword', detail: 'keyword' },
  { word: 'abstract', kind: 'keyword', detail: 'keyword' },
  { word: 'public', kind: 'keyword', detail: 'keyword' },
  { word: 'private', kind: 'keyword', detail: 'keyword' },
  { word: 'protected', kind: 'keyword', detail: 'keyword' },
  // Functions / Methods
  { word: 'console', kind: 'variable', detail: 'var console: Console' },
  { word: 'console.log', kind: 'method', detail: '(method) Console.log(...data: any[]): void' },
  { word: 'console.error', kind: 'method', detail: '(method) Console.error(...data: any[]): void' },
  { word: 'console.warn', kind: 'method', detail: '(method) Console.warn(...data: any[]): void' },
  { word: 'document', kind: 'variable', detail: 'var document: Document' },
  { word: 'document.getElementById', kind: 'method', detail: '(method) Document.getElementById(elementId: string): HTMLElement | null' },
  { word: 'document.querySelector', kind: 'method', detail: '(method) Document.querySelector(selectors: string): Element | null' },
  { word: 'document.createElement', kind: 'method', detail: '(method) Document.createElement(tagName: string): HTMLElement' },
  { word: 'window', kind: 'variable', detail: 'var window: Window & typeof globalThis' },
  { word: 'setTimeout', kind: 'function', detail: '(function) setTimeout(handler: Function, timeout?: number): number' },
  { word: 'setInterval', kind: 'function', detail: '(function) setInterval(handler: Function, timeout?: number): number' },
  { word: 'clearTimeout', kind: 'function', detail: '(function) clearTimeout(id: number): void' },
  { word: 'clearInterval', kind: 'function', detail: '(function) clearInterval(id: number): void' },
  { word: 'addEventListener', kind: 'method', detail: '(method) addEventListener(type: string, listener: Function): void' },
  { word: 'removeEventListener', kind: 'method', detail: '(method) removeEventListener(type: string, listener: Function): void' },
  { word: 'fetch', kind: 'function', detail: '(function) fetch(input: RequestInfo, init?: RequestInit): Promise<Response>' },
  { word: 'Promise', kind: 'class', detail: 'class Promise<T>' },
  { word: 'Array', kind: 'class', detail: 'class Array<T>' },
  { word: 'Object', kind: 'class', detail: 'class Object' },
  { word: 'String', kind: 'class', detail: 'class String' },
  { word: 'Number', kind: 'class', detail: 'class Number' },
  { word: 'Boolean', kind: 'class', detail: 'class Boolean' },
  { word: 'Map', kind: 'class', detail: 'class Map<K, V>' },
  { word: 'Set', kind: 'class', detail: 'class Set<T>' },
  { word: 'JSON', kind: 'variable', detail: 'var JSON: JSON' },
  { word: 'JSON.parse', kind: 'method', detail: '(method) JSON.parse(text: string): any' },
  { word: 'JSON.stringify', kind: 'method', detail: '(method) JSON.stringify(value: any): string' },
  { word: 'Math', kind: 'variable', detail: 'var Math: Math' },
  { word: 'Math.random', kind: 'method', detail: '(method) Math.random(): number' },
  { word: 'Math.floor', kind: 'method', detail: '(method) Math.floor(x: number): number' },
  { word: 'Math.ceil', kind: 'method', detail: '(method) Math.ceil(x: number): number' },
  { word: 'Math.round', kind: 'method', detail: '(method) Math.round(x: number): number' },
  // React specific
  { word: 'useState', kind: 'function', detail: '(function) useState<S>(initialState: S): [S, Dispatch<SetStateAction<S>>]' },
  { word: 'useEffect', kind: 'function', detail: '(function) useEffect(effect: EffectCallback, deps?: DependencyList): void' },
  { word: 'useCallback', kind: 'function', detail: '(function) useCallback<T>(callback: T, deps: DependencyList): T' },
  { word: 'useMemo', kind: 'function', detail: '(function) useMemo<T>(factory: () => T, deps: DependencyList): T' },
  { word: 'useRef', kind: 'function', detail: '(function) useRef<T>(initialValue: T): MutableRefObject<T>' },
  { word: 'useContext', kind: 'function', detail: '(function) useContext<T>(context: Context<T>): T' },
  { word: 'useReducer', kind: 'function', detail: '(function) useReducer<R>(reducer: R, initialArg: any): [any, Dispatch<any>]' },
  { word: 'React', kind: 'module', detail: 'module "react"' },
  { word: 'ReactDOM', kind: 'module', detail: 'module "react-dom"' },
  { word: 'Component', kind: 'class', detail: 'class React.Component<P, S>' },
  // Array methods
  { word: 'map', kind: 'method', detail: '(method) Array<T>.map(callbackfn: Function): U[]' },
  { word: 'filter', kind: 'method', detail: '(method) Array<T>.filter(predicate: Function): T[]' },
  { word: 'reduce', kind: 'method', detail: '(method) Array<T>.reduce(callbackfn: Function): T' },
  { word: 'forEach', kind: 'method', detail: '(method) Array<T>.forEach(callbackfn: Function): void' },
  { word: 'find', kind: 'method', detail: '(method) Array<T>.find(predicate: Function): T | undefined' },
  { word: 'findIndex', kind: 'method', detail: '(method) Array<T>.findIndex(predicate: Function): number' },
  { word: 'includes', kind: 'method', detail: '(method) Array<T>.includes(searchElement: T): boolean' },
  { word: 'push', kind: 'method', detail: '(method) Array<T>.push(...items: T[]): number' },
  { word: 'pop', kind: 'method', detail: '(method) Array<T>.pop(): T | undefined' },
  { word: 'slice', kind: 'method', detail: '(method) Array<T>.slice(start?: number, end?: number): T[]' },
  { word: 'splice', kind: 'method', detail: '(method) Array<T>.splice(start: number, deleteCount?: number): T[]' },
  { word: 'length', kind: 'property', detail: '(property) Array<T>.length: number' },
  { word: 'toString', kind: 'method', detail: '(method) toString(): string' },
  { word: 'valueOf', kind: 'method', detail: '(method) valueOf(): Object' },
  // Common variables
  { word: 'true', kind: 'constant', detail: 'boolean' },
  { word: 'false', kind: 'constant', detail: 'boolean' },
  { word: 'null', kind: 'constant', detail: 'null' },
  { word: 'undefined', kind: 'constant', detail: 'undefined' },
  { word: 'NaN', kind: 'constant', detail: 'number' },
  { word: 'Infinity', kind: 'constant', detail: 'number' },
  // String methods
  { word: 'split', kind: 'method', detail: '(method) String.split(separator: string): string[]' },
  { word: 'join', kind: 'method', detail: '(method) Array<string>.join(separator?: string): string' },
  { word: 'trim', kind: 'method', detail: '(method) String.trim(): string' },
  { word: 'replace', kind: 'method', detail: '(method) String.replace(searchValue: string, replaceValue: string): string' },
  { word: 'substring', kind: 'method', detail: '(method) String.substring(start: number, end?: number): string' },
  { word: 'toLowerCase', kind: 'method', detail: '(method) String.toLowerCase(): string' },
  { word: 'toUpperCase', kind: 'method', detail: '(method) String.toUpperCase(): string' },
  { word: 'charAt', kind: 'method', detail: '(method) String.charAt(pos: number): string' },
  { word: 'charCodeAt', kind: 'method', detail: '(method) String.charCodeAt(index: number): number' },
  { word: 'startsWith', kind: 'method', detail: '(method) String.startsWith(searchString: string): boolean' },
  { word: 'endsWith', kind: 'method', detail: '(method) String.endsWith(searchString: string): boolean' },
  { word: 'padStart', kind: 'method', detail: '(method) String.padStart(maxLength: number, fillString?: string): string' },
  { word: 'padEnd', kind: 'method', detail: '(method) String.padEnd(maxLength: number, fillString?: string): string' },
  { word: 'repeat', kind: 'method', detail: '(method) String.repeat(count: number): string' },
  { word: 'match', kind: 'method', detail: '(method) String.match(regexp: RegExp): RegExpMatchArray | null' },
  { word: 'search', kind: 'method', detail: '(method) String.search(regexp: RegExp): number' },
];

// Tokenize a single line for syntax highlighting
const tokenizeLine = (line: string): Token[] => {
  const tokens: Token[] = [];
  let i = 0;

  const keywords = new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'class', 'import', 'export', 'from', 'default', 'async', 'await', 'try',
    'catch', 'new', 'this', 'typeof', 'interface', 'type', 'extends',
    'implements', 'public', 'private', 'protected', 'static', 'readonly',
    'enum', 'namespace', 'module', 'declare', 'as', 'is', 'in', 'of',
    'switch', 'case', 'break', 'continue', 'throw', 'finally', 'void',
    'never', 'any', 'string', 'number', 'boolean', 'object', 'symbol',
    'unknown', 'do', 'instanceof', 'delete', 'with', 'yield', 'super',
  ]);

  const booleans = new Set(['true', 'false', 'null', 'undefined']);

  while (i < line.length) {
    // Single-line comment
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ type: 'comment', value: line.slice(i) });
      break;
    }

    // Decorator (e.g., @Component)
    if (line[i] === '@' && i + 1 < line.length && /[a-zA-Z]/.test(line[i + 1])) {
      let j = i + 1;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      tokens.push({ type: 'decorator', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Strings (single, double, backtick)
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === '\\') j++;
        j++;
      }
      j++;
      tokens.push({ type: 'string', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Numbers
    if (/\d/.test(line[i]) && (i === 0 || !/\w/.test(line[i - 1]))) {
      let j = i;
      while (j < line.length && /[\d.xXa-fA-F]/.test(line[j])) j++;
      tokens.push({ type: 'number', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // JSX/HTML tags
    if (line[i] === '<' && i + 1 < line.length && /[a-zA-Z/]/.test(line[i + 1])) {
      let j = i + 1;
      if (line[j] === '/') j++;
      while (j < line.length && /[a-zA-Z0-9._-]/.test(line[j])) j++;
      tokens.push({ type: 'tag', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Identifiers / keywords
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);

      let k = j;
      while (k < line.length && line[k] === ' ') k++;
      const isFunction = line[k] === '(';

      if (keywords.has(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (booleans.has(word)) {
        tokens.push({ type: 'boolean', value: word });
      } else if (isFunction) {
        tokens.push({ type: 'function', value: word });
      } else {
        tokens.push({ type: 'plain', value: word });
      }
      i = j;
      continue;
    }

    // Operators
    if (/[=+\-*/<>!&|?:^%~]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[=+\-*/<>!&|?:^%~]/.test(line[j])) j++;
      tokens.push({ type: 'operator', value: line.slice(i, j) });
      i = j;
      continue;
    }

    // Plain character
    tokens.push({ type: 'plain', value: line[i] });
    i++;
  }

  return tokens;
};

const tokenColorMap: Record<TokenType, string> = {
  keyword: 'text-[#569cd6]',
  string: 'text-[#ce9178]',
  comment: 'text-[#6a9955]',
  number: 'text-[#b5cea8]',
  function: 'text-[#dcdcaa]',
  boolean: 'text-[#569cd6]',
  operator: 'text-[#d4d4d4]',
  plain: 'text-[#d4d4d4]',
  tag: 'text-[#569cd6]',
  attribute: 'text-[#92c5f7]',
  decorator: 'text-[#dcdcaa]',
};

// Render a highlighted line using tokens
const HighlightedLine = ({ line }: { line: string }) => {
  const tokens = tokenizeLine(line);
  return (
    <>
      {tokens.map((token, idx) => (
        <span key={idx} className={tokenColorMap[token.type]}>
          {token.value}
        </span>
      ))}
    </>
  );
};

// Autocomplete popup component
interface AutocompleteProps {
  suggestions: { word: string; kind: string; detail: string }[];
  selectedIndex: number;
  visible: boolean;
  position: { top: number; left: number };
}

const AutocompletePopup = ({ suggestions, selectedIndex, visible, position }: AutocompleteProps) => {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div
      className="absolute z-50 animate-fadeIn"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {/* Main suggestions list */}
      <div className="bg-[#252526] border border-[#454545] rounded shadow-2xl min-w-[320px] max-w-[450px] max-h-[220px] overflow-hidden">
        <div className="overflow-y-auto max-h-[200px] py-0.5">
          {suggestions.map((item, idx) => {
            const iconInfo = SUGGESTION_ICONS[item.kind] || SUGGESTION_ICONS['variable'];
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={idx}
                className={`flex items-center px-2 py-[2px] text-xs cursor-default ${
                  isSelected 
                    ? 'bg-[#04395e] text-white' 
                    : 'text-[#cccccc] hover:bg-[#2a2d2e]'
                }`}
              >
                <span className="w-5 h-5 flex items-center justify-center mr-1.5 text-[10px] shrink-0">
                  {iconInfo.icon}
                </span>
                <span className={`truncate ${isSelected ? 'text-white font-medium' : iconInfo.color}`}>
                  {item.word}
                </span>
                <span className="ml-auto pl-4 text-[10px] text-[#808080] truncate">
                  {item.detail}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel for selected item */}
      {suggestions[selectedIndex] && (
        <div className="bg-[#252526] border border-[#454545] border-t-0 rounded-b px-3 py-2 min-w-[320px] max-w-[450px]">
          <div className="text-[11px] text-[#cccccc] font-mono">
            {suggestions[selectedIndex].detail}
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [inputCode, setInputCode] = useState<string>(`// Paste your code here and click "Start Typing"
function helloWorld() {
  console.log("Hello, World!");
  return true;
}

const greeting = "Welcome to Auto Code Typer!";
console.log(greeting);`);

  const [displayedCode, setDisplayedCode] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(50);
  const [typoFrequency, setTypoFrequency] = useState(5);
  const [fileName, setFileName] = useState('script.tsx');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showAutocomplete, setShowAutocomplete] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Autocomplete state
  const [acVisible, setAcVisible] = useState(false);
  const [acSuggestions, setAcSuggestions] = useState<{ word: string; kind: string; detail: string }[]>([]);
  const [acSelectedIndex, setAcSelectedIndex] = useState(0);
  const [acPosition, setAcPosition] = useState({ top: 0, left: 0 });

  const typingRef = useRef<boolean>(false);
  const pausedRef = useRef<boolean>(false);
  const codeDisplayRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef<number>(0);
  const displayedCodeRef = useRef<string>('');
  const typingSpeedRef = useRef(typingSpeed);
  const typoFrequencyRef = useRef(typoFrequency);
  const inputCodeRef = useRef(inputCode);
  const stopFlagRef = useRef(0);
  const showAutocompleteRef = useRef(showAutocomplete);

  useEffect(() => { typingSpeedRef.current = typingSpeed; }, [typingSpeed]);
  useEffect(() => { typoFrequencyRef.current = typoFrequency; }, [typoFrequency]);
  useEffect(() => { inputCodeRef.current = inputCode; }, [inputCode]);
  useEffect(() => { showAutocompleteRef.current = showAutocomplete; }, [showAutocomplete]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (codeDisplayRef.current) {
      codeDisplayRef.current.scrollTop = codeDisplayRef.current.scrollHeight;
    }
  }, [displayedCode]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Extract current word being typed (for autocomplete matching)
  const getCurrentWord = (text: string): string => {
    let i = text.length - 1;
    while (i >= 0 && /[a-zA-Z0-9_$.]/.test(text[i])) {
      i--;
    }
    return text.slice(i + 1);
  };

  // Get suggestions based on current word + extract identifiers from code
  const getSuggestions = (currentWord: string, fullCode: string): { word: string; kind: string; detail: string }[] => {
    if (currentWord.length < 2) return [];

    const lowerWord = currentWord.toLowerCase();

    // Extract identifiers from the code being typed for dynamic suggestions
    const identifiers = new Set<string>();
    const identRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]{2,})\b/g;
    let m;
    while ((m = identRegex.exec(fullCode)) !== null) {
      if (m[1] !== currentWord) {
        identifiers.add(m[1]);
      }
    }

    // Combine DB suggestions + code identifiers
    const allSuggestions: { word: string; kind: string; detail: string }[] = [...SUGGESTION_DB];

    identifiers.forEach(id => {
      if (!allSuggestions.find(s => s.word === id)) {
        allSuggestions.push({ word: id, kind: 'variable', detail: `(local) ${id}` });
      }
    });

    // Filter and sort by relevance
    const filtered = allSuggestions
      .filter(s => s.word.toLowerCase().startsWith(lowerWord) || s.word.toLowerCase().includes(lowerWord))
      .sort((a, b) => {
        const aStarts = a.word.toLowerCase().startsWith(lowerWord) ? 0 : 1;
        const bStarts = b.word.toLowerCase().startsWith(lowerWord) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.word.length - b.word.length;
      })
      .slice(0, 8);

    return filtered;
  };

  // Calculate autocomplete popup position based on cursor position in editor
  const calculateAcPosition = (text: string): { top: number; left: number } => {
    const lines = text.split('\n');
    const lineIndex = lines.length - 1;
    const colIndex = lines[lineIndex].length;

    // Each line is 24px high, line numbers width ~56px, padding left ~16px
    const lineHeight = 24;
    const lineNumbersWidth = 56;
    const paddingLeft = 16;
    const charWidth = 8.4; // approximate monospace char width at text-sm

    const editorEl = codeDisplayRef.current;
    const scrollTop = editorEl ? editorEl.scrollTop : 0;

    const top = (lineIndex + 1) * lineHeight - scrollTop + 2;
    const left = lineNumbersWidth + paddingLeft + colIndex * charWidth;

    return { top: Math.max(top, 0), left: Math.min(left, 400) };
  };

  // Show autocomplete with animation
  const showAcPopup = (text: string, fullCode: string) => {
    if (!showAutocompleteRef.current) return;

    const currentWord = getCurrentWord(text);
    const suggestions = getSuggestions(currentWord, fullCode);

    if (suggestions.length > 0) {
      const position = calculateAcPosition(text);
      setAcSuggestions(suggestions);
      setAcSelectedIndex(Math.floor(Math.random() * Math.min(3, suggestions.length))); // Random selection like human browsing
      setAcPosition(position);
      setAcVisible(true);
    } else {
      setAcVisible(false);
    }
  };

  const hideAcPopup = () => {
    setAcVisible(false);
  };

  const getRandomTypo = (char: string): string => {
    const nearby: { [key: string]: string[] } = {
      'a': ['s', 'q', 'w', 'z'],
      'b': ['v', 'g', 'h', 'n'],
      'c': ['x', 'd', 'f', 'v'],
      'd': ['s', 'e', 'r', 'f', 'c', 'x'],
      'e': ['w', 'r', 'd', 's', '3', '4'],
      'f': ['d', 'r', 't', 'g', 'v', 'c'],
      'g': ['f', 't', 'y', 'h', 'b', 'v'],
      'h': ['g', 'y', 'u', 'j', 'n', 'b'],
      'i': ['u', 'o', 'k', 'j', '8', '9'],
      'j': ['h', 'u', 'i', 'k', 'm', 'n'],
      'k': ['j', 'i', 'o', 'l', 'm'],
      'l': ['k', 'o', 'p', ';'],
      'm': ['n', 'j', 'k', ','],
      'n': ['b', 'h', 'j', 'm'],
      'o': ['i', 'p', 'l', 'k', '9', '0'],
      'p': ['o', '[', ';', 'l'],
      'q': ['w', 'a', '1', '2'],
      'r': ['e', 't', 'f', 'd', '4', '5'],
      's': ['a', 'w', 'e', 'd', 'x', 'z'],
      't': ['r', 'y', 'g', 'f', '5', '6'],
      'u': ['y', 'i', 'j', 'h', '7', '8'],
      'v': ['c', 'f', 'g', 'b'],
      'w': ['q', 'e', 's', 'a', '2', '3'],
      'x': ['z', 's', 'd', 'c'],
      'y': ['t', 'u', 'h', 'g', '6', '7'],
      'z': ['a', 's', 'x'],
    };

    const lowerChar = char.toLowerCase();
    if (nearby[lowerChar]) {
      const typo = nearby[lowerChar][Math.floor(Math.random() * nearby[lowerChar].length)];
      return char === char.toUpperCase() ? typo.toUpperCase() : typo;
    }
    return char;
  };

  const appendCode = (text: string) => {
    displayedCodeRef.current = text;
    setDisplayedCode(text);
  };

  const typeCode = useCallback(async () => {
    const myStopFlag = stopFlagRef.current;
    typingRef.current = true;
    pausedRef.current = false;
    setIsTyping(true);
    setIsPaused(false);

    const code = inputCodeRef.current;
    const startIndex = currentIndexRef.current;
    let lastAcShow = 0;
    let acIsShowing = false;
    let wordCharCount = 0;

    for (let i = startIndex; i < code.length; i++) {
      if (!typingRef.current || stopFlagRef.current !== myStopFlag) {
        hideAcPopup();
        return;
      }

      while (pausedRef.current) {
        await sleep(100);
        if (!typingRef.current || stopFlagRef.current !== myStopFlag) {
          hideAcPopup();
          return;
        }
      }

      const char = code[i];
      const speed = typingSpeedRef.current;
      const typoRate = typoFrequencyRef.current;

      // Track if we're in a word
      if (/[a-zA-Z0-9_$]/.test(char)) {
        wordCharCount++;
      } else {
        wordCharCount = 0;
      }

      // Autocomplete logic
      if (showAutocompleteRef.current) {
        // Show autocomplete when we've typed 2+ word chars and enough time passed
        if (wordCharCount >= 2 && /[a-zA-Z]/.test(char) && i - lastAcShow > 3) {
          // 60% chance to show autocomplete for this word
          if (Math.random() < 0.6 || wordCharCount === 2) {
            showAcPopup(displayedCodeRef.current + char, code);
            acIsShowing = true;
            lastAcShow = i;

            // Sometimes change selected index while showing (simulating arrow keys)
            if (Math.random() < 0.3 && wordCharCount > 3) {
              setTimeout(() => {
                setAcSelectedIndex(prev => Math.min(prev + 1, 7));
              }, 150);
            }
          }
        }

        // Hide autocomplete on non-word characters
        if (!/[a-zA-Z0-9_$.]/.test(char) && acIsShowing) {
          hideAcPopup();
          acIsShowing = false;
        }
      }

      // Random typo logic
      const shouldTypo = Math.random() * 100 < typoRate && /[a-zA-Z]/.test(char);

      if (shouldTypo) {
        // Hide autocomplete during typo
        if (acIsShowing) {
          hideAcPopup();
          acIsShowing = false;
        }

        const typoCount = Math.random() < 0.3 ? (Math.random() < 0.5 ? 3 : 2) : 1;
        const actualTypoCount = Math.min(typoCount, code.length - i);

        let wrongChars = '';
        for (let t = 0; t < actualTypoCount; t++) {
          const targetChar = code[i + t] || char;
          const typoChar = /[a-zA-Z]/.test(targetChar) ? getRandomTypo(targetChar) : targetChar;
          wrongChars += typoChar;
          appendCode(displayedCodeRef.current + typoChar);
          await sleep(speed + Math.random() * 30);
          if (!typingRef.current || stopFlagRef.current !== myStopFlag) return;
        }

        // Pause - noticing mistake
        await sleep(200 + Math.random() * 400);
        if (!typingRef.current || stopFlagRef.current !== myStopFlag) return;

        // Delete wrong characters
        for (let t = 0; t < wrongChars.length; t++) {
          appendCode(displayedCodeRef.current.slice(0, -1));
          await sleep(40 + Math.random() * 40);
          if (!typingRef.current || stopFlagRef.current !== myStopFlag) return;
        }

        await sleep(50 + Math.random() * 100);
        if (!typingRef.current || stopFlagRef.current !== myStopFlag) return;

        appendCode(displayedCodeRef.current + char);
      } else {
        appendCode(displayedCodeRef.current + char);
      }

      // Variable typing speed
      let delay = speed + (Math.random() * 40 - 20);

      if (['.', ',', ';', ':', '{', '}', '(', ')'].includes(char)) {
        delay += 50 + Math.random() * 120;
      }

      if (char === '\n') {
        delay += 100 + Math.random() * 300;
        // Hide autocomplete on newline
        if (acIsShowing) {
          hideAcPopup();
          acIsShowing = false;
        }
      }

      if (Math.random() < 0.015) {
        delay += 300 + Math.random() * 700;
      }

      if (char === ' ' && i > 0 && code[i - 1] === ' ') {
        delay = speed * 0.3;
      }

      await sleep(delay);
      currentIndexRef.current = i + 1;
      setProgress(Math.round(((i + 1) / code.length) * 100));
    }

    hideAcPopup();
    typingRef.current = false;
    setIsTyping(false);
    setProgress(100);
  }, []);

  const startTyping = () => {
    if (isTyping && isPaused) {
      pausedRef.current = false;
      setIsPaused(false);
      return;
    }
    if (!isTyping) {
      displayedCodeRef.current = '';
      setDisplayedCode('');
      currentIndexRef.current = 0;
      setProgress(0);
      hideAcPopup();
      typeCode();
    }
  };

  const pauseTyping = () => {
    if (isTyping && !isPaused) {
      pausedRef.current = true;
      setIsPaused(true);
    } else if (isTyping && isPaused) {
      pausedRef.current = false;
      setIsPaused(false);
    }
  };

  const stopTyping = () => {
    stopFlagRef.current++;
    typingRef.current = false;
    pausedRef.current = false;
    setIsTyping(false);
    setIsPaused(false);
    currentIndexRef.current = 0;
    hideAcPopup();
  };

  const resetAll = () => {
    stopTyping();
    displayedCodeRef.current = '';
    setDisplayedCode('');
    setProgress(0);
  };

  const lines = displayedCode.split('\n');
  const lineCount = Math.max(lines.length, 1);
  const lastLineLength = lines[lines.length - 1]?.length ?? 0;

  return (
    <div className="h-screen bg-[#1e1e1e] flex flex-col overflow-hidden select-none">
      {/* Title Bar */}
      <div className="bg-[#323233] h-8 flex items-center px-4 text-[#cccccc] text-sm shrink-0">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27ca40]"></div>
        </div>
        <span className="flex-1 text-center text-xs">VS Code</span>
      </div>

      {/* Menu Bar */}
      <div className="bg-[#3c3c3c] h-9 flex items-center px-4 text-[#cccccc] text-sm space-x-1 shrink-0">
        {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map(item => (
          <span key={item} className="hover:bg-[#505050] px-2 py-1 rounded cursor-default text-xs">{item}</span>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 space-y-1 shrink-0 border-r border-[#252526]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 cursor-pointer transition-colors relative group ${sidebarOpen ? 'text-white' : 'text-[#858585] hover:text-white'}`}
            title="Explorer (Ctrl+Shift+E)"
          >
            {sidebarOpen && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38H2.5V7.5H7v12.57L8.5 21.5h6v.5zM16 16.5H8.5V7.5h7V5H8.5L7 6.5V3h8.5v12.5h.5v-12z"/>
            </svg>
          </button>
          <button className="p-2 text-[#858585] hover:text-white cursor-pointer transition-colors" title="Search (Ctrl+Shift+F)">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 22.88l1.12 1.12 8.05-9.12A8.251 8.251 0 1 0 15.25.01V0zm0 15a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5z"/>
            </svg>
          </button>
          <button className="p-2 text-[#858585] hover:text-white cursor-pointer transition-colors" title="Source Control (Ctrl+Shift+G)">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.007 8.222A3.738 3.738 0 0 0 15.045 5.2a3.737 3.737 0 0 0 1.156 6.583 8.957 8.957 0 0 1-3.96 6.014c-2.086 1.378-4.553 1.912-6.96 1.504a3.737 3.737 0 1 0-.461 1.965 12.44 12.44 0 0 0 2.007-.238A11.088 11.088 0 0 0 15.3 14.04a3.737 3.737 0 0 0 5.707-5.818z"/>
            </svg>
          </button>
          <button className="p-2 text-[#858585] hover:text-white cursor-pointer transition-colors" title="Extensions (Ctrl+Shift+X)">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zm0 2c4.7 0 8.5 3.8 8.5 8.5s-3.8 8.5-8.5 8.5S3.5 16.7 3.5 12 7.3 3.5 12 3.5zM11 7v6l5.2 3.1.8-1.3-4.5-2.7V7H11z"/>
            </svg>
          </button>
        </div>

        {/* Explorer Panel */}
        <div className={`bg-[#252526] border-r border-[#3c3c3c] flex flex-col shrink-0 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-r-0'}`}>
          <div className={`flex flex-col h-full overflow-y-auto overflow-x-hidden min-w-[256px] ${sidebarOpen ? '' : 'invisible'}`}>
          <div className="p-3 text-[#bbbbbb] text-[11px] uppercase tracking-wider font-semibold">Explorer</div>

          {/* Input Section */}
          <div className="p-2 border-b border-[#3c3c3c]">
            <div className="text-[#cccccc] text-[11px] mb-2 uppercase font-semibold tracking-wide">📋 Paste Code Here</div>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full h-36 bg-[#1e1e1e] text-[#d4d4d4] text-xs p-2 rounded border border-[#3c3c3c] focus:border-[#007acc] focus:outline-none resize-none font-mono scrollbar-thin"
              placeholder="Paste your code here..."
              disabled={isTyping}
            />
          </div>

          {/* Controls */}
          <div className="p-2 space-y-3 border-b border-[#3c3c3c]">
            <div className="text-[#cccccc] text-[11px] uppercase font-semibold tracking-wide">🎮 Controls</div>

            <div className="flex space-x-1.5">
              <button
                onClick={startTyping}
                disabled={isTyping && !isPaused}
                className="flex-1 flex items-center justify-center space-x-1 bg-[#0e639c] hover:bg-[#1177bb] disabled:bg-[#3c3c3c] disabled:text-[#6c6c6c] disabled:cursor-not-allowed text-white px-2 py-1.5 rounded text-xs transition-colors"
              >
                <PlayIcon />
                <span>{isPaused ? 'Resume' : 'Start'}</span>
              </button>

              {isTyping && (
                <button
                  onClick={pauseTyping}
                  className="flex items-center justify-center bg-[#6c6c6c] hover:bg-[#808080] text-white px-2 py-1.5 rounded text-xs transition-colors"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <PlayIcon /> : <PauseIcon />}
                </button>
              )}

              <button
                onClick={stopTyping}
                disabled={!isTyping}
                className="flex items-center justify-center bg-[#c42b1c] hover:bg-[#d43c2d] disabled:bg-[#3c3c3c] disabled:text-[#6c6c6c] disabled:cursor-not-allowed text-white px-2 py-1.5 rounded text-xs transition-colors"
                title="Stop"
              >
                <StopIcon />
              </button>
            </div>

            <button
              onClick={resetAll}
              className="w-full bg-[#3c3c3c] hover:bg-[#505050] text-[#cccccc] px-3 py-1.5 rounded text-xs transition-colors"
            >
              ↺ Reset
            </button>

            {/* Progress Bar */}
            {(isTyping || progress === 100) && (
              <div className="space-y-1">
                <div className="flex justify-between text-[#858585] text-[10px]">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#3c3c3c] rounded overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 rounded ${progress === 100 ? 'bg-[#27ca40]' : 'bg-[#007acc]'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Speed Control */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#858585] text-[10px]">
                <span>⚡ Speed</span>
                <span>{typingSpeed}ms</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={typingSpeed}
                onChange={(e) => setTypingSpeed(Number(e.target.value))}
                className="w-full h-1 bg-[#3c3c3c] rounded appearance-none cursor-pointer accent-[#007acc]"
              />
              <div className="flex justify-between text-[#555] text-[9px]">
                <span>Fast</span>
                <span>Slow</span>
              </div>
            </div>

            {/* Typo Frequency */}
            <div className="space-y-1">
              <div className="flex justify-between text-[#858585] text-[10px]">
                <span>🖊 Typo Rate</span>
                <span>{typoFrequency}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={typoFrequency}
                onChange={(e) => setTypoFrequency(Number(e.target.value))}
                className="w-full h-1 bg-[#3c3c3c] rounded appearance-none cursor-pointer accent-[#007acc]"
              />
              <div className="flex justify-between text-[#555] text-[9px]">
                <span>None</span>
                <span>Many</span>
              </div>
            </div>

            {/* Autocomplete Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[#858585] text-[10px]">💡 IntelliSense</span>
              <button
                onClick={() => setShowAutocomplete(!showAutocomplete)}
                className={`relative w-9 h-5 rounded-full transition-colors ${showAutocomplete ? 'bg-[#007acc]' : 'bg-[#3c3c3c]'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${showAutocomplete ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>

            {/* File Name */}
            <div className="space-y-1">
              <div className="text-[#858585] text-[10px]">📄 File Name</div>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-[#1e1e1e] text-[#d4d4d4] text-xs p-1.5 rounded border border-[#3c3c3c] focus:border-[#007acc] focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* File Tree */}
          <div className="p-2">
            <div className="text-[#cccccc] text-[11px] uppercase mb-2 font-semibold tracking-wide">Open Editors</div>
            <div className="flex items-center space-x-2 text-[#d4d4d4] text-xs py-1 px-2 bg-[#37373d] rounded">
              <FileIcon />
              <span className="truncate">{fileName}</span>
            </div>
            <div className="mt-3">
              <div className="text-[#cccccc] text-[11px] uppercase mb-2 font-semibold tracking-wide">📂 Project</div>
              <div className="space-y-0.5 text-[10px] text-[#cccccc]">
                <div className="flex items-center space-x-1.5 py-0.5 px-1 hover:bg-[#37373d] rounded cursor-default">
                  <span className="text-[#e8ab53]">▾</span>
                  <span>📁 src</span>
                </div>
                <div className="flex items-center space-x-1.5 py-0.5 px-1 pl-5 bg-[#37373d] rounded cursor-default">
                  <FileIcon />
                  <span>{fileName}</span>
                </div>
                <div className="flex items-center space-x-1.5 py-0.5 px-1 pl-5 hover:bg-[#37373d] rounded cursor-default text-[#858585]">
                  <FileIcon />
                  <span>index.html</span>
                </div>
                <div className="flex items-center space-x-1.5 py-0.5 px-1 hover:bg-[#37373d] rounded cursor-default text-[#858585]">
                  <span className="text-[#e8ab53]">▸</span>
                  <span>📁 node_modules</span>
                </div>
                <div className="flex items-center space-x-1.5 py-0.5 px-1 hover:bg-[#37373d] rounded cursor-default text-[#858585]">
                  <FileIcon />
                  <span>package.json</span>
                </div>
                <div className="flex items-center space-x-1.5 py-0.5 px-1 hover:bg-[#37373d] rounded cursor-default text-[#858585]">
                  <FileIcon />
                  <span>README.md</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] min-w-0 relative">
          {/* Tab Bar */}
          <div className="h-9 bg-[#252526] flex items-center border-b border-[#3c3c3c] shrink-0">
            <div className="flex items-center space-x-2 px-4 py-2 bg-[#1e1e1e] text-[#ffffff] text-xs border-t-2 border-t-[#007acc] max-w-[200px]">
              <FileIcon />
              <span className="truncate">{fileName}</span>
              <span className="text-[#858585] hover:text-white cursor-default ml-auto">×</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="h-6 bg-[#1e1e1e] flex items-center px-4 text-[#858585] text-xs border-b border-[#3c3c3c] shrink-0">
            <span>src</span>
            <span className="mx-1.5 text-[#555]">›</span>
            <span className="truncate text-[#cccccc]">{fileName}</span>
          </div>

          {/* Code Editor */}
          <div
            ref={codeDisplayRef}
            className="flex-1 overflow-auto font-mono text-sm select-text relative"
          >
            <div className="flex min-h-full">
              {/* Line Numbers */}
              <div className="sticky left-0 bg-[#1e1e1e] text-[#858585] text-right pr-4 pl-4 select-none z-10 min-w-[3.5rem]">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="leading-6 text-xs">{i + 1}</div>
                ))}
              </div>

              {/* Code Content */}
              <div className="flex-1 pl-4 pr-8 text-[#d4d4d4] relative">
                {lines.map((line, index) => (
                  <div key={index} className="leading-6 whitespace-pre relative">
                    <HighlightedLine line={line} />
                    {index === lines.length - 1 && (
                      <span
                        className={`inline-block w-[2px] h-[16px] bg-[#aeafad] ml-[1px] align-middle transition-opacity duration-100 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
                      />
                    )}
                  </div>
                ))}

                {/* Autocomplete Popup */}
                <AutocompletePopup
                  suggestions={acSuggestions}
                  selectedIndex={acSelectedIndex}
                  visible={acVisible}
                  position={acPosition}
                />
              </div>
            </div>

            {/* Empty state */}
            {displayedCode === '' && !isTyping && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-[#555] space-y-2">
                  <div className="text-4xl">⌨️</div>
                   <div className="text-sm">{sidebarOpen ? 'Paste code in the sidebar and click Start' : 'Click the file icon to open sidebar'}</div>
                  <div className="text-xs text-[#444]">The code will be typed with human-like realism</div>
                </div>
              </div>
            )}
          </div>

          {/* Minimap - decorative */}
          <div className="absolute right-0 top-[60px] bottom-[24px] w-[60px] opacity-40 pointer-events-none overflow-hidden hidden lg:block">
            <div className="p-1 text-[2px] leading-[3px] text-[#d4d4d4] font-mono break-all whitespace-pre-wrap">
              {displayedCode.slice(0, 2000)}
            </div>
          </div>

          {/* Status Bar */}
          <div className="h-6 bg-[#007acc] flex items-center justify-between px-4 text-white text-xs shrink-0">
            <div className="flex items-center space-x-4">
              <span>
                {isTyping
                  ? isPaused
                    ? '⏸ Paused'
                    : '⌨️ Typing...'
                  : displayedCode.length > 0
                    ? progress === 100 ? '✅ Done' : '⏹ Stopped'
                    : '✓ Ready'}
              </span>
              <span>Ln {lineCount}, Col {lastLineLength + 1}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Spaces: 2</span>
              <span>UTF-8</span>
              <span>{fileName.endsWith('.tsx') ? 'TypeScript React' : fileName.endsWith('.ts') ? 'TypeScript' : fileName.endsWith('.jsx') ? 'JavaScript React' : fileName.endsWith('.js') ? 'JavaScript' : fileName.endsWith('.py') ? 'Python' : fileName.endsWith('.css') ? 'CSS' : fileName.endsWith('.html') ? 'HTML' : 'Plain Text'}</span>
              {showAutocomplete && <span>💡 IntelliSense</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

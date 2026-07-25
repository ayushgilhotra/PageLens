import React, { useState, useRef } from 'react';
import { Globe, ClipboardPaste } from 'lucide-react';
import './UrlInput.css';

const UrlInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = 'Enter a website URL...', 
  size = 'default',
  autoFocus = false 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  return (
    <div className={`url-input-wrapper size-${size} ${isFocused ? 'focused' : ''}`}>
      <Globe className="url-input-icon-left" size={20} />
      <input
        ref={inputRef}
        type="url"
        className="url-input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
      <button 
        className="url-input-paste-btn" 
        onClick={handlePaste}
        type="button"
        title="Paste from clipboard"
      >
        <ClipboardPaste size={18} />
      </button>
    </div>
  );
};

export default UrlInput;

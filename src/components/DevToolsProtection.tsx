"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";

// Custom Context Menu Component
function ContextMenuPortal({ x, y, onCopy, onClose }: { x: number; y: number; onCopy: () => void; onClose: () => void }) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Add listeners after a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: y,
        left: x,
        zIndex: 999999,
        backgroundColor: '#1a1a2e',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        minWidth: '120px',
        animation: 'contextMenuFadeIn 0.15s ease-out',
      }}
    >
      <style>{`
        @keyframes contextMenuFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <button
        onClick={onCopy}
        style={{
          width: '100%',
          padding: '10px 16px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.3)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
      </button>
    </div>,
    document.body
  );
}

export default function DevToolsProtection() {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    try {
      if (selectedText) {
        await navigator.clipboard.writeText(selectedText);
      }
    } catch {
      // Fallback: try to get current selection
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        try {
          await navigator.clipboard.writeText(selection.toString());
        } catch {
          document.execCommand('copy');
        }
      }
    }
    setContextMenu(null);
    setSelectedText('');
  };

  const handleClose = () => {
    setContextMenu(null);
    setSelectedText('');
  };

  useEffect(() => {
    // 🔒 SECURITY PRO MAX - Comprehensive DevTools Protection

    // 1. Block default right-click menu (only show custom menu if text is selected)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Only show menu if there's text selected
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';
      if (text.length > 0) {
        // Save the selected text before showing menu
        setSelectedText(text);
        
        // Calculate position to keep menu in viewport
        const x = Math.min(e.clientX, window.innerWidth - 140);
        const y = Math.min(e.clientY, window.innerHeight - 50);
        
        setContextMenu({ x, y });
      }
      return false;
    };

    // 2. Auto-show menu when text is selected
    const handleMouseUp = () => {
      // Small delay to ensure selection is complete
      setTimeout(() => {
        const selection = window.getSelection();
        const text = selection?.toString().trim() || '';
        if (text.length > 0) {
          // Save the selected text
          setSelectedText(text);
          
          // Get the selection's bounding rectangle
          const range = selection!.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          // Position menu near the end of selection
          const x = Math.min(rect.right + 5, window.innerWidth - 140);
          const y = Math.min(rect.bottom + 5, window.innerHeight - 50);
          
          setContextMenu({ x, y });
        }
      }, 10);
    };

    // Close menu when selection is cleared
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.toString().trim().length === 0) {
        setContextMenu(null);
        setSelectedText('');
      }
    };

    // Disable Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
      
      // Cmd+Option+I (Mac DevTools)
      if (e.metaKey && e.altKey && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        return false;
      }
      
      // Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && (e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        return false;
      }
      
      // Cmd+Option+C (Mac Inspect)
      if (e.metaKey && e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        return false;
      }
      
      // Cmd+U (Mac View Source)
      if (e.metaKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
    };

    // Disable Cut
    const disableCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable Paste (only on non-input elements)
    const disablePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target.matches('input, textarea, [contenteditable="true"]')) {
        e.preventDefault();
        return false;
      }
    };

    // Detect DevTools Opening
    let isDevToolsWarningShown = false;
    const detectDevTools = () => {
      if (isDevToolsWarningShown) return;
      
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      
      const threshold = 250;
      const isHeightSuspicious = heightDiff > threshold;
      const isWidthVeryLarge = widthDiff > 400;
      
      if (isHeightSuspicious || isWidthVeryLarge) {
        isDevToolsWarningShown = true;
        document.body.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            text-align: center;
            padding: 20px;
          ">
            <div style="
              background: rgba(0, 0, 0, 0.3);
              backdrop-filter: blur(10px);
              padding: 40px;
              border-radius: 20px;
              max-width: 600px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
              <div style="font-size: 80px; margin-bottom: 20px;">🔒</div>
              <h1 style="font-size: 32px; margin-bottom: 20px; font-weight: 700;">Access Denied</h1>
              <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">
                Developer tools are not allowed on this platform.
                <br/>Please close DevTools and refresh the page to continue.
              </p>
              <button 
                onclick="window.location.reload()" 
                style="
                  background: #fff;
                  color: #667eea;
                  border: none;
                  padding: 15px 40px;
                  font-size: 16px;
                  font-weight: 600;
                  border-radius: 10px;
                  cursor: pointer;
                  transition: transform 0.2s;
                "
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
              >
                Refresh Page
              </button>
            </div>
          </div>
        `;
      }
    };

    // Advanced DevTools Detection using debugger
    const debuggerLoop = () => {
      const start = new Date().getTime();
      // eslint-disable-next-line no-debugger
      debugger;
      const end = new Date().getTime();
      
      if (end - start > 100) {
        document.body.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            text-align: center;
            padding: 20px;
          ">
            <div style="
              background: rgba(0, 0, 0, 0.3);
              backdrop-filter: blur(10px);
              padding: 40px;
              border-radius: 20px;
              max-width: 600px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            ">
              <div style="font-size: 80px; margin-bottom: 20px;">⚠️</div>
              <h1 style="font-size: 32px; margin-bottom: 20px; font-weight: 700;">Security Alert</h1>
              <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">
                Unauthorized debugging detected!
                <br/>Close all developer tools immediately.
              </p>
            </div>
          </div>
        `;
      }
    };

    // Disable Console Methods
    if (typeof window !== 'undefined') {
      const noop = () => {};
      const consoleProxy = new Proxy(console, {
        get() {
          return noop;
        }
      });
      
      try {
        Object.defineProperty(window, 'console', {
          get: () => consoleProxy,
          set: () => {}
        });
      } catch {
        ['log', 'debug', 'info', 'warn', 'error', 'table', 'trace', 'dir', 'dirxml', 'group', 'groupCollapsed', 'groupEnd', 'clear', 'count', 'countReset', 'assert', 'profile', 'profileEnd', 'time', 'timeLog', 'timeEnd', 'timeStamp'].forEach((method) => {
          (console as unknown as Record<string, unknown>)[method] = noop;
        });
      }
    }

    // Prevent iframe injection
    const preventIframe = () => {
      if (window.self !== window.top) {
        window.top!.location.href = window.self.location.href;
      }
    };

    // Clear storage on suspicious activity
    const clearStorage = () => {
      try {
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        const devToolsOpen = heightDiff > 250 || widthDiff > 400;
        
        if (devToolsOpen) {
          sessionStorage.clear();
        }
      } catch {
        // Ignore
      }
    };

    // Disable drag and drop
    const disableDragDrop = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Monitor window resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(detectDevTools, 500);
    };

    // Prevent source code viewing
    const preventSourceView = () => {
      if (window.location.protocol === 'view-source:') {
        window.location.href = window.location.href.replace('view-source:', '');
      }
    };

    // Apply CSS - Enable text selection everywhere
    const style = document.createElement('style');
    style.id = 'devtools-protection-styles';
    style.textContent = `
      /* Allow text selection */
      * {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
      
      body {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
      }
    `;
    document.head.appendChild(style);

    // Register all event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('cut', disableCut);
    document.addEventListener('paste', disablePaste);
    document.addEventListener('dragstart', disableDragDrop);
    document.addEventListener('drop', disableDragDrop);
    window.addEventListener('resize', handleResize);

    // Start detection intervals (reduced frequency to save CPU)
    const devToolsInterval = setInterval(detectDevTools, 5000);
    const debuggerInterval = setInterval(debuggerLoop, 10000);
    const storageInterval = setInterval(clearStorage, 10000);
    
    // Run initial checks
    preventIframe();
    preventSourceView();
    detectDevTools();

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('cut', disableCut);
      document.removeEventListener('paste', disablePaste);
      document.removeEventListener('dragstart', disableDragDrop);
      document.removeEventListener('drop', disableDragDrop);
      window.removeEventListener('resize', handleResize);
      
      clearInterval(devToolsInterval);
      clearInterval(debuggerInterval);
      clearInterval(storageInterval);
      clearTimeout(resizeTimeout);
      
      const styleEl = document.getElementById('devtools-protection-styles');
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, []);

  // Render custom context menu using portal
  return mounted && contextMenu ? (
    <ContextMenuPortal
      x={contextMenu.x}
      y={contextMenu.y}
      onCopy={handleCopy}
      onClose={handleClose}
    />
  ) : null;
}

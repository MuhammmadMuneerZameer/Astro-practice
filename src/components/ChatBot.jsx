import React, { useState } from 'react';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  function handleSend(e) {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, from: 'user' }]);
      setInput('');
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-auto">
      <button
        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
        onClick={() => setOpen(!open)}
        aria-label="Open ChatBot"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01" />
        </svg>
      </button>
      {open && (
        <div className="bg-white rounded-lg shadow-xl w-80 p-4 mt-2">
          <div className="font-bold text-blue-700 mb-2">ChatBot</div>
          <div className="h-40 overflow-y-auto mb-2 border rounded p-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={msg.from === 'user' ? 'text-right text-blue-600' : 'text-left text-gray-700'}>
                {msg.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              className="border rounded px-2 py-1 flex-1"
              placeholder="Type your query..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
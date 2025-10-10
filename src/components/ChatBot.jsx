import React, { useState, useRef, useEffect } from 'react';

// Error Boundary Component
class ChatBotErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ChatBot Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          borderRadius: '8px',
          fontSize: '12px',
          maxWidth: '200px',
          zIndex: 999999
        }}>
          ChatBot Error: {this.state.error?.message || 'Unknown error'}
        </div>
      );
    }

    return this.props.children;
  }
}

function ChatBotComponent() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to help you navigate our website. What can I assist you with today?", from: 'bot' }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Get API key from environment variables with error handling (Astro compatible)
  const OPENAI_API_KEY = import.meta.env.PUBLIC_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is not set. Please check your environment variables.');
  }

 
  
  console.log('API Key status:', OPENAI_API_KEY ? 'Found' : 'Not found');

  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error('Scroll error:', error);
    }
  };

  useEffect(() => {
    try {
      scrollToBottom();
    } catch (error) {
      console.error('useEffect error:', error);
    }
  }, [messages]);

  async function sendToOpenAI(userMessage) {
    try {
      if (!OPENAI_API_KEY) {
        console.warn('OpenAI API key not found');
        return "API key not configured. Please contact support for assistance.";
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful website assistant for Hydra Fox Designs. You help users navigate the website, answer questions about services, pricing, contact information, and general inquiries. Keep responses concise and helpful. If users ask about specific technical details or services not clearly defined, guide them to contact the team directly.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment or contact our support team directly on muneer@hydrafoxdesigns.com.";
    }
  }

  async function handleSend(e) {
    try {
      e.preventDefault();
      if (input.trim() && !loading) {
        const userMessage = input.trim();
        
        // Add user message
        setMessages(prev => [...prev, { text: userMessage, from: 'user' }]);
        setInput('');
        setLoading(true);

        // Get AI response
        const botResponse = await sendToOpenAI(userMessage);
        
        // Add bot response
        setMessages(prev => [...prev, { text: botResponse, from: 'bot' }]);
        setLoading(false);
      }
    } catch (error) {
      console.error('handleSend error:', error);
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    try {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(e);
      }
    } catch (error) {
      console.error('handleKeyPress error:', error);
    }
  }

  console.log('ChatBot rendering...'); // Debug log

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 999999
    }}>
      {/* Chat Button */}
      <button
        onClick={() => {
          console.log('Button clicked, current open state:', open);
          setOpen(!open);
        }}
        style={{
          backgroundColor: 'var(--color-accent)',
          color: 'white',
          borderRadius: '50%',
          padding: open ? '12px 16px' : '16px',
          
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease'
        }}
        aria-label="Open ChatBot"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          width: '320px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            color: 'white',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: '#10b981',
                borderRadius: '50%'
              }}></div>
              <span style={{ fontWeight: '600' }}>Hydra Fox Assistant</span>
            </div>
            <button 
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0 10px',
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            height: '256px',
            overflowY: 'auto',
            padding: '16px',
            backgroundColor: '#f9fafb'
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                marginBottom: '12px',
                textAlign: msg.from === 'user' ? 'right' : 'left'
              }}>
                <div style={{
                  display: 'inline-block',
                  maxWidth: '240px',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: msg.from === 'user' ? '#3b82f6' : 'white',
                  color: msg.from === 'user' ? 'white' : '#374151',
                  border: msg.from === 'user' ? 'none' : '1px solid #e5e7eb',
                  boxShadow: msg.from === 'user' ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {loading && (
              <div style={{ textAlign: 'left', marginBottom: '12px' }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  padding: '12px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite 0.1s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'bounce 1s infinite 0.2s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                style={{
                  flex: 1,
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  outline: 'none'
                }}
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                style={{
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !input.trim() ? 0.5 : 1
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChatBot() {
  return (
    <ChatBotErrorBoundary>
      <ChatBotComponent />
    </ChatBotErrorBoundary>
  );
}
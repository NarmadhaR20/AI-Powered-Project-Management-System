import { useState, useRef, useEffect } from 'react';
import api from '../api/api';

function ChatWidget({ project }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! Ask me about your project, like "How many tasks?" or "Show high priority tasks".' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post('/api/ai/chat', {
                message: userMsg,
                projectId: project.id
            });
            setMessages(prev => [...prev, { role: 'bot', text: res.data.answer }]);
        } catch (err) {
            console.error("Chat failed", err);
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I couldn't get an answer. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* CHAT WINDOW */}
            {isOpen && (
                <div style={styles.window}>
                    <div style={styles.header}>
                        <span>🤖 Project Assistant</span>
                        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✕</button>
                    </div>

                    <div style={styles.messages}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                ...styles.messageBubble,
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.role === 'user' ? '#6366f1' : 'var(--bg-input)',
                                color: msg.role === 'user' ? 'white' : 'var(--text-primary)'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div style={styles.loading}>Generating...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} style={styles.footer}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            style={styles.input}
                        />
                        <button type="submit" disabled={isLoading} style={styles.sendBtn}>➤</button>
                    </form>
                </div>
            )}

            {/* FLOAT BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={styles.floatBtn}
            >
                {isOpen ? '✕' : '💬'}
            </button>
        </div>
    );
}

const styles = {
    container: {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    floatBtn: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#6366f1',
        color: 'white',
        fontSize: '24px',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.2s',
        ':hover': { transform: 'scale(1.05)' }
    },
    window: {
        width: '320px',
        height: '450px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '16px',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
    },
    header: {
        padding: '12px 16px',
        backgroundColor: '#6366f1',
        color: 'white',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px'
    },
    messages: {
        flex: 1,
        padding: '16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    messageBubble: {
        padding: '8px 12px',
        borderRadius: '8px',
        maxWidth: '85%',
        fontSize: '14px',
        lineHeight: '1.4'
    },
    loading: {
        fontSize: '12px',
        color: 'var(--text-secondary)',
        alignSelf: 'flex-start',
        fontStyle: 'italic'
    },
    footer: {
        padding: '12px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        gap: '8px'
    },
    input: {
        flex: 1,
        padding: '8px 12px',
        borderRadius: '20px',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-input)',
        color: 'var(--text-primary)',
        outline: 'none',
        fontSize: '14px'
    },
    sendBtn: {
        background: 'transparent',
        border: 'none',
        color: '#6366f1',
        fontSize: '20px',
        cursor: 'pointer'
    }
};

export default ChatWidget;

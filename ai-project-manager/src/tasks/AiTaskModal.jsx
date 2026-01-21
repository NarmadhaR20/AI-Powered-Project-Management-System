import { useState } from 'react';
import api from '../api/api';

function AiTaskModal({ project, users, onTasksGenerated, onClose }) {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]); // Array of TaskSuggestionDto
    const [selectedSuggestions, setSelectedSuggestions] = useState([]); // Array of indices or objects

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const res = await api.post('/api/ai/generate', { prompt });
            setSuggestions(res.data);
            setSelectedSuggestions(res.data); // Select all by default
        } catch (err) {
            console.error("AI Generation failed", err);
            alert("Failed to generate tasks");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTasks = async () => {
        if (selectedSuggestions.length === 0) return;

        // Process each selected suggestion
        const promises = selectedSuggestions.map(async (suggestion) => {
            // 1. Create Task
            const taskPayload = {
                title: suggestion.title,
                status: 'BACKLOG',
                priority: suggestion.priority || 'LOW',
                dueDate: suggestion.dueDate // "YYYY-MM-DD" from backend
            };

            try {
                const res = await api.post(`/api/tasks/project/${project.id}`, taskPayload);
                const createdTask = res.data;

                // 2. Assign User if suggested
                if (suggestion.assigneeName) {
                    const matchedUser = users.find(u =>
                        u.name.toLowerCase().includes(suggestion.assigneeName.toLowerCase())
                    );

                    if (matchedUser) {
                        try {
                            const assignRes = await api.put(`/api/tasks/${createdTask.id}/assign/${matchedUser.id}`);
                            return assignRes.data; // Return task with assignee
                        } catch (assignErr) {
                            console.error("Failed to assign user", assignErr);
                            return createdTask; // Return task anyway
                        }
                    }
                }
                return createdTask;

            } catch (err) {
                console.error("Failed to create task", err);
                return null;
            }
        });

        try {
            const results = await Promise.all(promises);
            const newTasks = results.filter(t => t !== null);
            onTasksGenerated(newTasks);
            onClose();
            // alert(`${newTasks.length} tasks added!`);
        } catch (err) {
            console.error("Failed to add tasks", err);
        }
    };

    const toggleSuggestion = (suggestion) => {
        setSelectedSuggestions(prev =>
            prev.includes(suggestion)
                ? prev.filter(s => s !== suggestion)
                : [...prev, suggestion]
        );
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2>✨ AI Task Generator</h2>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {suggestions.length === 0 ? (
                    <div style={styles.inputSection}>
                        <p>Describe your project goal, and AI will suggest tasks for you.</p>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. Create a high priority task for John to fix login bug by Friday..."
                            style={styles.textarea}
                        />
                        <button
                            onClick={handleGenerate}
                            style={styles.generateBtn}
                            disabled={isLoading || !prompt.trim()}
                        >
                            {isLoading ? "Generating..." : "Generate Tasks"}
                        </button>
                    </div>
                ) : (
                    <div style={styles.resultsSection}>
                        <h4>Select tasks to add:</h4>
                        <div style={styles.list}>
                            {suggestions.map((s, i) => (
                                <div key={i} style={styles.item} onClick={() => toggleSuggestion(s)}>
                                    <input
                                        type="checkbox"
                                        checked={selectedSuggestions.includes(s)}
                                        readOnly
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '500' }}>{s.title}</div>
                                        <div style={styles.metaRow}>
                                            <span style={styles.badge(s.priority)}>{s.priority}</span>
                                            {s.assigneeName && (
                                                <span style={styles.metaTag}>👤 {s.assigneeName}</span>
                                            )}
                                            {s.dueDate && (
                                                <span style={styles.metaTag}>📅 {s.dueDate}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={styles.actions}>
                            <button onClick={() => setSuggestions([])} style={styles.backBtn}>Back</button>
                            <button onClick={handleAddTasks} style={styles.addBtn}>
                                Add {selectedSuggestions.length} Tasks
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
    },
    modal: {
        backgroundColor: 'var(--bg-card)', width: '500px', borderRadius: '12px',
        padding: '24px', boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-subtle)', color: 'var(--text-primary)'
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px'
    },
    closeBtn: {
        background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer',
        color: 'var(--text-secondary)'
    },
    inputSection: {
        display: 'flex', flexDirection: 'column', gap: '16px'
    },
    textarea: {
        width: '100%', height: '100px', padding: '12px', borderRadius: '8px',
        border: '1px solid var(--border-subtle)', marginBottom: '16px', fontSize: '14px',
        backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none',
        resize: 'none'
    },
    generateBtn: {
        width: '100%', padding: '12px', backgroundColor: '#8b5cf6', color: 'white',
        border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
        transition: 'background 0.2s',
        ':hover': { backgroundColor: '#7c3aed' }
    },
    resultsSection: {
        display: 'flex', flexDirection: 'column', gap: '16px'
    },
    list: {
        maxHeight: '300px', overflowY: 'auto', marginBottom: '10px',
        border: '1px solid var(--border-subtle)', borderRadius: '8px',
        backgroundColor: 'var(--bg-app)'
    },
    item: {
        padding: '12px', borderBottom: '1px solid var(--border-subtle)', display: 'flex',
        gap: '12px', alignItems: 'flex-start', cursor: 'pointer',
        transition: 'background 0.2s',
        ':hover': { backgroundColor: 'var(--bg-input)' }
    },
    metaRow: {
        display: 'flex', gap: '8px', marginTop: '4px', fontSize: '12px'
    },
    badge: (priority) => ({
        padding: '2px 6px', borderRadius: '4px', fontWeight: '600',
        backgroundColor: priority === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' :
            priority === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
        color: priority === 'HIGH' ? '#fca5a5' :
            priority === 'MEDIUM' ? '#fcd34d' : '#6ee7b7'
    }),
    metaTag: {
        color: 'var(--text-secondary)',
        backgroundColor: 'var(--bg-sidebar)',
        padding: '2px 6px', borderRadius: '4px'
    },
    actions: {
        display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px'
    },
    backBtn: {
        padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-subtle)',
        borderRadius: '6px', cursor: 'pointer', color: 'var(--text-primary)'
    },
    addBtn: {
        padding: '8px 16px', backgroundColor: '#10b981', color: 'white',
        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
    }
};

export default AiTaskModal;

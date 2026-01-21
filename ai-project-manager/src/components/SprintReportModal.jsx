import { useEffect, useState } from 'react';
import api from '../api/api';

function SprintReportModal({ project, onClose }) {
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/ai/summary/${project.id}`)
            .then(res => {
                setReport(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch report", err);
                setIsLoading(false);
            });
    }, [project.id]);

    if (!project) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2>📊 AI Sprint Report</h2>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </div>

                {isLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        Generating report... 🤖
                    </div>
                ) : report ? (
                    <div style={styles.content}>
                        {/* STATS ROW */}
                        <div style={styles.statsRow}>
                            <div style={styles.statCard}>
                                <div style={styles.statVal}>{report.totalTasks}</div>
                                <div style={styles.statLabel}>Total Tasks</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={{ ...styles.statVal, color: '#10b981' }}>{report.completedTasks}</div>
                                <div style={styles.statLabel}>Completed</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={{ ...styles.statVal, color: '#f59e0b' }}>{report.pendingTasks}</div>
                                <div style={styles.statLabel}>Pending</div>
                            </div>
                        </div>

                        {/* AI ANALYSIS */}
                        <div style={styles.section}>
                            <h3>💡 AI Analysis</h3>
                            <p style={styles.text}>{report.aiAnalysis}</p>
                        </div>

                        {/* RISKS */}
                        <div style={styles.section}>
                            <h3>⚠️ Risks & Blockers</h3>
                            {report.risks && report.risks.length > 0 ? (
                                <ul style={styles.list}>
                                    {report.risks.map((risk, i) => (
                                        <li key={i} style={styles.riskItem}>{risk}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={styles.text}>No immediate risks detected. 🎉</p>
                            )}
                        </div>

                        {/* MORALE */}
                        <div style={styles.section}>
                            <h3>😊 Team Morale</h3>
                            <div style={styles.moraleBox}>
                                <span style={{ fontSize: '24px' }}>
                                    {report.moraleStatus === 'Positive' ? '🟢' :
                                        report.moraleStatus === 'Negative' ? '🔴' : '⚪'}
                                </span>
                                <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
                                    {report.moraleStatus}
                                </span>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div style={{ padding: '20px', color: 'red' }}>Failed to load report.</div>
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
        backgroundColor: 'var(--bg-card)', width: '600px', borderRadius: '12px',
        padding: '24px', boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
        maxHeight: '90vh', overflowY: 'auto'
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '10px'
    },
    closeBtn: {
        background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer',
        color: 'var(--text-secondary)'
    },
    content: {
        display: 'flex', flexDirection: 'column', gap: '24px'
    },
    statsRow: {
        display: 'flex', gap: '16px', justifyContent: 'space-between'
    },
    statCard: {
        flex: 1, backgroundColor: 'var(--bg-input)', padding: '16px', borderRadius: '8px',
        textAlign: 'center', border: '1px solid var(--border-subtle)'
    },
    statVal: {
        fontSize: '24px', fontWeight: 'bold', marginBottom: '4px'
    },
    statLabel: {
        fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase'
    },
    section: {
        display: 'flex', flexDirection: 'column', gap: '8px'
    },
    text: {
        lineHeight: '1.5', color: 'var(--text-secondary)'
    },
    list: {
        paddingLeft: '20px', margin: 0
    },
    riskItem: {
        color: '#f87171', marginBottom: '4px'
    },
    moraleBox: {
        display: 'flex', alignItems: 'center', padding: '12px',
        backgroundColor: 'var(--bg-input)', borderRadius: '8px',
        border: '1px solid var(--border-subtle)'
    }
};

export default SprintReportModal;

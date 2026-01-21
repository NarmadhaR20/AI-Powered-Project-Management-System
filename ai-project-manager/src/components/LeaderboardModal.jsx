import { useState, useEffect } from 'react';
import api from '../api/api';

function LeaderboardModal({ project, onClose }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (project?.id) {
            api.get(`/api/tasks/project/${project.id}/leaderboard`)
                .then(res => {
                    setData(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch leaderboard", err);
                    setLoading(false);
                });
        }
    }, [project]);

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2>🏆 Team Leaderboard</h2>
                    <button onClick={onClose} style={styles.closeBtn}>&times;</button>
                </div>

                <p style={styles.subtitle}>Ranking by task completion efficiency</p>

                {loading ? (
                    <div style={styles.loading}>Loading rankings...</div>
                ) : (
                    <div style={styles.list}>
                        {data.length === 0 ? (
                            <div style={styles.empty}>No completed tasks yet. Start finishing tasks to climb the board!</div>
                        ) : (
                            data.map((user, index) => (
                                <div key={user.userEmail} style={styles.row}>
                                    <div style={styles.rankInfo}>
                                        <span style={styles.rankNum(index + 1)}>{index + 1}</span>
                                        <div style={styles.userInfo}>
                                            <span style={styles.name}>{user.userName}</span>
                                            <span style={styles.email}>{user.userEmail}</span>
                                        </div>
                                    </div>
                                    <div style={styles.stats}>
                                        <div style={styles.statBox}>
                                            <span style={styles.statVal}>{user.completedTasks}</span>
                                            <span style={styles.statLabel}>Tasks</span>
                                        </div>
                                        <div style={{ ...styles.statBox, borderLeft: '1px solid var(--border-subtle)' }}>
                                            <span style={styles.scoreVal}>{user.score}</span>
                                            <span style={styles.statLabel}>Score</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000
    },
    modal: {
        backgroundColor: 'var(--bg-card)',
        width: '500px',
        maxWidth: '90%',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--border-subtle)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        fontSize: '28px',
        cursor: 'pointer'
    },
    subtitle: {
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '24px'
    },
    loading: {
        padding: '40px',
        textAlign: 'center',
        color: 'var(--text-muted)'
    },
    empty: {
        padding: '40px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '14px',
        lineHeight: '1.6'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '8px'
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        transition: 'transform 0.2s',
        cursor: 'default',
        ':hover': {
            transform: 'scale(1.02)'
        }
    },
    rankInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    rankNum: (num) => ({
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px',
        backgroundColor: num === 1 ? '#fbbf24' : num === 2 ? '#94a3b8' : num === 3 ? '#b45309' : 'var(--bg-app)',
        color: num <= 3 ? '#000' : 'var(--text-secondary)',
        border: num > 3 ? '1px solid var(--border-subtle)' : 'none'
    }),
    userInfo: {
        display: 'flex',
        flexDirection: 'column'
    },
    name: {
        fontWeight: '600',
        color: 'var(--text-primary)',
        fontSize: '15px'
    },
    email: {
        fontSize: '11px',
        color: 'var(--text-muted)'
    },
    stats: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    statBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: '16px'
    },
    statVal: {
        fontWeight: '600',
        color: 'var(--text-primary)',
        fontSize: '16px'
    },
    scoreVal: {
        fontWeight: 'bold',
        color: '#8b5cf6', // Purple color for score
        fontSize: '18px'
    },
    statLabel: {
        fontSize: '10px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    }
};

export default LeaderboardModal;

import { useState, useEffect } from 'react';
import api from '../api/api';

function MembersModal({ organization, onClose, currentUserRole }) {
    const [members, setMembers] = useState([]);
    const [emailToAdd, setEmailToAdd] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });

    const isOwner = currentUserRole === 'OWNER';

    useEffect(() => {
        fetchMembers();
    }, [organization]);

    const fetchMembers = () => {
        if (!organization?.id) return;
        setLoading(true);
        api.get(`/api/organizations/${organization.id}/members`)
            .then(res => {
                setMembers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch members", err);
                setLoading(false);
            });
    };

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!emailToAdd.trim()) return;

        api.post(`/api/organizations/${organization.id}/members`, { email: emailToAdd })
            .then(() => {
                setMessage({ text: 'Member added successfully!', type: 'success' });
                setEmailToAdd('');
                fetchMembers();
            })
            .catch(err => {
                setMessage({ text: err.response?.data?.message || 'Failed to add member', type: 'error' });
            });
    };

    const handleChangeRole = (userId, newRole) => {
        api.put(`/api/organizations/${organization.id}/members/${userId}/role`, { role: newRole })
            .then(() => {
                setMessage({ text: 'Role updated!', type: 'success' });
                fetchMembers();
            })
            .catch(err => {
                setMessage({ text: 'Failed to update role', type: 'error' });
            });
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2>👥 Organization Members</h2>
                    <button onClick={onClose} style={styles.closeBtn}>&times;</button>
                </div>

                {message.text && (
                    <div style={{ ...styles.message, backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#6ee7b7' : '#fca5a5' }}>
                        {message.text}
                    </div>
                )}

                {isOwner && (
                    <form onSubmit={handleAddMember} style={styles.addForm}>
                        <input
                            type="email"
                            placeholder="Invite member by email..."
                            value={emailToAdd}
                            onChange={e => setEmailToAdd(e.target.value)}
                            style={styles.input}
                            required
                        />
                        <button type="submit" style={styles.addBtn}>Invite</button>
                    </form>
                )}

                <div style={styles.list}>
                    {loading ? (
                        <div style={styles.loading}>Loading members...</div>
                    ) : members.length === 0 ? (
                        <div style={styles.empty}>No members found.</div>
                    ) : (
                        members.map(member => (
                            <div key={member.id} style={styles.row}>
                                <div style={styles.memberInfo}>
                                    <div style={styles.avatar}>
                                        {(member.user?.name || member.user?.email || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={styles.details}>
                                        <span style={styles.name}>{member.user?.name}</span>
                                        <span style={styles.email}>{member.user?.email}</span>
                                    </div>
                                </div>

                                {isOwner && member.role !== 'OWNER' ? (
                                    <select
                                        value={member.role}
                                        onChange={(e) => handleChangeRole(member.user.id, e.target.value)}
                                        style={styles.select}
                                    >
                                        <option value="MEMBER">Member</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="GUEST">Guest</option>
                                    </select>
                                ) : (
                                    <span style={styles.roleBadge(member.role)}>{member.role}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
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
        zIndex: 2100
    },
    modal: {
        backgroundColor: 'var(--bg-card)',
        width: '480px',
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
        marginBottom: '20px'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--text-muted)',
        fontSize: '28px',
        cursor: 'pointer'
    },
    addForm: {
        display: 'flex',
        gap: '8px',
        marginBottom: '24px'
    },
    input: {
        flex: 1,
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-input)',
        color: 'var(--text-primary)',
        outline: 'none'
    },
    addBtn: {
        padding: '10px 20px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500'
    },
    message: {
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '16px',
        fontSize: '13px',
        textAlign: 'center'
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxHeight: '350px',
        overflowY: 'auto'
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        borderRadius: '10px',
        backgroundColor: 'var(--bg-app)',
        border: '1px solid var(--border-subtle)'
    },
    memberInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    details: {
        display: 'flex',
        flexDirection: 'column'
    },
    name: {
        fontWeight: '600',
        color: 'var(--text-primary)',
        fontSize: '14px'
    },
    email: {
        fontSize: '12px',
        color: 'var(--text-muted)'
    },
    roleBadge: (role) => {
        const isOwner = role === 'OWNER';
        return {
            fontSize: '11px',
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: isOwner ? 'rgba(245, 158, 11, 0.15)' : 'rgba(107, 114, 128, 0.15)',
            color: isOwner ? '#fcd34d' : '#9ca3af',
            fontWeight: '600'
        };
    },
    select: {
        padding: '6px 10px',
        borderRadius: '6px',
        backgroundColor: 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        color: 'var(--text-primary)',
        fontSize: '12px',
        outline: 'none'
    },
    loading: { padding: '20px', textAlign: 'center', color: 'var(--text-muted)' },
    empty: { padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }
};

export default MembersModal;

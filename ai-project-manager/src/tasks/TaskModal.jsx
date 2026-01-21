import Comments from './Comments';
import Assignees from './Assignees';

function TaskModal({
  task,
  users,
  onAddComment,
  onToggleAssignee,
  canComment,
  canAssign,
  onClose
}) {
  if (!task) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2>{task.title}</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* BASIC INFO */}
        <p>
          <strong>Status:</strong> {task.status}
        </p>
        <p>
          <strong>Priority:</strong> {task.priority}
        </p>
        {task.dueDate && (
          <p>
            <strong>Due Date:</strong> {task.dueDate}
          </p>
        )}

        {/* ASSIGNEES (PERMISSION BASED) */}
        {canAssign ? (
          <Assignees
            users={users}
            selectedAssignees={task.assignees}
            onToggle={onToggleAssignee}
          />
        ) : (
          <div style={styles.readOnlySection}>
            <h4>Assignees</h4>
            {task.assignees?.length > 0 ? (
              task.assignees.map((u) => (
                <span key={u.id} style={styles.assigneeBadge}>
                  {u.name}
                </span>
              ))

            ) : (
              <p>No assignees</p>
            )}
          </div>
        )}

        {/* COMMENTS (PERMISSION BASED) */}
        {canComment ? (
          <Comments
            comments={task.comments}
            onAddComment={onAddComment}
          />
        ) : (
          <p style={styles.readOnlyText}>
            You have read-only access. Comments are disabled.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------------------
   STYLES
---------------------------- */
const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', // Darker overlay
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'var(--bg-card)',
    width: '480px',
    maxHeight: '80vh',
    overflowY: 'auto',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
    boxShadow: 'var(--shadow-lg)',
    color: 'var(--text-primary)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  closeBtn: {
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    transition: 'color 0.2s',
    ':hover': {
      color: 'var(--text-primary)'
    }
  },
  readOnlyText: {
    marginTop: '15px',
    color: 'var(--text-muted)'
  },
  readOnlySection: {
    marginTop: '15px'
  },
  assigneeBadge: {
    display: 'inline-block',
    backgroundColor: 'var(--bg-input)',
    padding: '4px 10px',
    borderRadius: '12px',
    marginRight: '6px',
    fontSize: '12px',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-subtle)'
  }
};

export default TaskModal;

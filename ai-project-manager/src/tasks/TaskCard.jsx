import { useDraggable } from '@dnd-kit/core';

function TaskCard({ task, onClick, onDelete, canDrag, canDelete }) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: task.id,
      disabled: !canDrag
    });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    ...styles.card
  };

  return (
    <div ref={setNodeRef} style={style} onClick={() => onClick(task)}>
      {/* HEADER */}
      <div style={styles.header}>
        <h4 style={styles.title}>{task.title}</h4>

        {/* DELETE BUTTON */}
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            style={styles.deleteBtn}
            title="Delete task"
          >
            🗑️
          </button>
        )}

        {/* DRAG HANDLE */}
        {canDrag && (
          <span
            {...listeners}
            {...attributes}
            style={styles.dragHandle}
            onClick={(e) => e.stopPropagation()}
            title="Drag task"
          >
            ⠿
          </span>
        )}
      </div>

      {/* PRIORITY & DUE DATE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <span style={styles.priority(task.priority)}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span style={styles.dueDate}>
            📅 {task.dueDate}
          </span>
        )}
      </div>

      {/* ASSIGNEES */}
      {task.assignees?.length > 0 && (
        <div style={styles.assignees}>
          {task.assignees.map((user) => (
            <span key={user.id} style={styles.avatar}>
              {user.name.charAt(0).toUpperCase()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------
   STYLES
---------------------------- */
const styles = {
  card: {
    backgroundColor: 'var(--bg-card)',
    padding: '16px',
    borderRadius: '10px',
    marginBottom: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    cursor: 'grab',
    border: '1px solid var(--border-subtle)',
    transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px'
  },
  title: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    lineHeight: '1.5'
  },
  dragHandle: {
    cursor: 'grab',
    color: 'var(--text-muted)',
    opacity: 0.7,
    padding: '4px',
    ':hover': { color: 'var(--text-primary)' }
  },
  priority: (level) => {
    const colors = {
      HIGH: { bg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5' },     // Red-400 equivalent
      MEDIUM: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d' },  // Amber-300
      LOW: { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7' }      // Emerald-300
    };
    const style = colors[level] || colors.LOW;
    return {
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: '600',
      backgroundColor: style.bg,
      color: style.text,
      // marginTop: '8px', // Handled by container
      letterSpacing: '0.5px'
    };
  },
  dueDate: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: '500'
  },
  assignees: {
    display: 'flex',
    marginTop: '12px'
  },
  avatar: {
    backgroundColor: 'var(--primary)',
    color: '#ffffff',
    borderRadius: '50%',
    width: '26px',
    height: '26px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--bg-card)', // Matches card bg to create "cutout" effect
    marginLeft: '-8px', // Overlap
    fontWeight: 'bold',
    position: 'relative' // For stacking
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '4px',
    opacity: 0.6,
    transition: 'opacity 0.2s',
    ':hover': { opacity: 1 }
  }
};

export default TaskCard;

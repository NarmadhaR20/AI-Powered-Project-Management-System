import { useState } from 'react';

function Comments({ comments = [], onAddComment }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAddComment(text);
    setText('');
  };

  return (
    <div style={styles.container}>
      <h4>Comments</h4>

      <div style={styles.list}>
        {comments.length === 0 && (
          <p style={{ color: '#6b7280' }}>
            No comments yet
          </p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} style={styles.comment}>
            <div style={styles.commentHeader}>
              <strong>{comment.author?.name || comment.author?.email || comment.author || "Unknown"}</strong>
              {comment.sentiment && (
                <span style={styles.sentimentBadge(comment.sentiment)}>
                  {comment.sentiment === 'POSITIVE' ? '😊' :
                    comment.sentiment === 'NEGATIVE' ? '😟' : '😐'}
                  {comment.sentiment.toLowerCase()}
                </span>
              )}
            </div>
            <p style={styles.commentText}>{comment.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
      </form>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)'
  },
  list: {
    maxHeight: '180px',
    overflowY: 'auto',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  comment: {
    background: 'var(--bg-input)', // Slightly lighter than card
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  commentText: {
    margin: 0,
    color: 'var(--text-secondary)'
  },
  sentimentBadge: (sentiment) => {
    const colors = {
      POSITIVE: { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7' },
      NEGATIVE: { bg: 'rgba(239, 68, 68, 0.15)', text: '#fca5a5' },
      NEUTRAL: { bg: 'rgba(107, 114, 128, 0.15)', text: '#9ca3af' }
    };
    const style = colors[sentiment] || colors.NEUTRAL;
    return {
      fontSize: '10px',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: style.bg,
      color: style.text,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      textTransform: 'capitalize'
    };
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-app)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-primary)',
    outline: 'none',
    ':focus': {
      borderColor: 'var(--primary)'
    }
  }
};

export default Comments;

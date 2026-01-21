function Assignees({ users = [], selectedAssignees = [], onToggle }) {
  return (
    <div style={styles.container}>
      <h4>Assignees</h4>

      {users.map((user) => {
        const isAssigned = selectedAssignees.some(
          (a) => a.id === user.id
        );

        return (
          <label key={user.id} style={styles.item}>
            <input
              type="checkbox"
              checked={isAssigned}
              onChange={() => onToggle(user)}
            />
            {user.name}
          </label>
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    transition: 'background 0.2s',
    ':hover': {
      backgroundColor: 'var(--bg-input)'
    }
  }
};

export default Assignees;

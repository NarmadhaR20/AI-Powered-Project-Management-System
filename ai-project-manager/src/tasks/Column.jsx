import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function Column({ id, title, tasks, onTaskClick, onDelete, canDrag, canDelete }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} style={styles.column}>
      <h3>{title}</h3>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onClick={onTaskClick}
          onDelete={onDelete}
          canDrag={canDrag}
          canDelete={canDelete}
        />
      ))}
    </div>
  );
}

const styles = {
  column: {
    width: '300px',
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // Semi-transparent slate
    padding: '16px',
    borderRadius: '12px',
    minHeight: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  }
};

export default Column;

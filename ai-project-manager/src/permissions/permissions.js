//role based access logic

export const canEditTask = ({ user, task }) => {
  if (user.projectRole === 'PROJECT_MANAGER') return true;

  if (task.assignees.some(a => a.id === user.id)) return true;

  return user.projectRole === 'CONTRIBUTOR';
};

export const canComment = ({ user }) => {
  return user.projectRole !== 'VIEWER';
};

export const canDragTask = ({ user }) => {
  return user.projectRole !== 'VIEWER';
};

export const canAssignUsers = ({ user }) => {
  return user.projectRole === 'PROJECT_MANAGER';
};

import { useState, useEffect } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import Column from './Column';
import AiTaskModal from './AiTaskModal';
import TaskModal from './TaskModal';
import ChatWidget from '../components/ChatWidget';
import SprintReportModal from '../components/SprintReportModal';
import LeaderboardModal from '../components/LeaderboardModal';
import MembersModal from '../components/MembersModal';
import { jwtDecode } from "jwt-decode";
import api from "../api/api";

function ProjectBoard({ project, organization }) {

  // ---------------------------
  // CURRENT USER FROM TOKEN
  // ---------------------------
  const token = localStorage.getItem("token");
  let currentUser = { email: "guest" };

  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUser = {
        email: decoded.sub,
      };
    } catch (e) {
      console.error("Invalid token", e);
    }
  }

  // ---------------------------
  // STATE
  // ---------------------------
  const [projectRole, setProjectRole] = useState("GUEST");
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  // ---------------------------
  // PERMISSIONS
  // ---------------------------
  const canDrag = projectRole !== "GUEST";
  const canComment = projectRole !== "GUEST";
  const canCreateTask = ["MANAGER", "ADMIN", "OWNER"].includes(projectRole);
  const canAssign = ["MANAGER", "ADMIN", "OWNER"].includes(projectRole);
  const canDelete = ["MANAGER", "ADMIN", "OWNER"].includes(projectRole);

  // ---------------------------
  // FETCH DATA
  // ---------------------------
  useEffect(() => {
    if (project?.id) {
      fetchTasks();
      fetchProjectRole();
    }
    fetchUsers();
  }, [project, organization]);

  const fetchProjectRole = () => {
    const orgId = organization?.id || project.organization?.id || project.organizationId;
    if (!orgId) return;

    api.get(`/api/organizations/${orgId}/role`)
      .then(res => setProjectRole(res.data.role))
      .catch(err => console.error("Failed to fetch project role", err));
  };

  const fetchTasks = () => {
    api.get(`/api/tasks/project/${project.id}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setTasks(res.data);
        } else {
          console.error("API returned non-array tasks:", res.data);
          setTasks([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch tasks", err);
        setTasks([]);
      });
  };

  const fetchUsers = () => {
    api.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error("Failed to fetch users", err));
  };

  // ---------------------------
  // KANBAN COLUMNS
  // ---------------------------
  const columns = [
    { key: 'BACKLOG', title: 'Backlog' },
    { key: 'TODO', title: 'Todo' },
    { key: 'IN_PROGRESS', title: 'In Progress' },
    { key: 'REVIEW', title: 'Review' },
    { key: 'DONE', title: 'Done' }
  ];

  // ---------------------------
  // DND SENSOR
  // ---------------------------
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  );

  // ---------------------------
  // HANDLERS
  // ---------------------------
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !canDrag) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Optimistic update
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );

    // API Call
    api.put(`/api/tasks/${taskId}/status`, { status: newStatus })
      .catch(err => {
        console.error("Failed to update status", err);
        fetchTasks(); // Revert on error
      });
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !canCreateTask) return;

    const newTask = {
      title: newTaskTitle,
      status: 'BACKLOG',
      priority: 'LOW'
    };

    api.post(`/api/tasks/project/${project.id}`, newTask)
      .then(res => {
        setTasks([...tasks, res.data]);
        setNewTaskTitle("");
      })
      .catch(err => console.error("Failed to create task", err));
  };

  const handleAddComment = (text) => {
    if (!selectedTask) return;

    api.post(`/api/comments/task/${selectedTask.id}`, { text })
      .then(res => {
        const newComment = { ...res.data, author: currentUser.email };
        const updatedTask = {
          ...selectedTask,
          comments: [...(selectedTask.comments || []), newComment]
        };
        setSelectedTask(updatedTask);
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      })
      .catch(err => console.error("Failed to add comment", err));
  };

  const handleToggleAssignee = (user) => {
    if (!selectedTask || !canAssign) return;

    api.put(`/api/tasks/${selectedTask.id}/assign/${user.id}`)
      .then(res => {
        const updatedTask = res.data;
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        setSelectedTask(updatedTask);
      })
      .catch(err => console.error("Failed to toggle assignee", err));
  };

  const handleDeleteTask = (taskId) => {
    if (!canDelete) return; // Only managers/owners/admins can delete

    api.delete(`/api/tasks/${taskId}`)
      .then(() => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        if (selectedTask?.id === taskId) setSelectedTask(null);
      })
      .catch(err => console.error("Failed to delete task", err));
  };

  const handleCleanupUntitled = () => {
    const untitledTasks = tasks.filter(t => !t.title || t.title.trim() === "");
    if (untitledTasks.length === 0) {
      alert("No untitled tasks to clean up!");
      return;
    }

    if (window.confirm(`Delete ${untitledTasks.length} untitled tasks?`)) {
      untitledTasks.forEach(task => {
        api.delete(`/api/tasks/${task.id}`)
          .then(() => {
            setTasks(prev => prev.filter(t => t.id !== task.id));
          })
          .catch(err => console.error("Failed to delete task during cleanup", err));
      });
    }
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h2>{project?.name}</h2>

            <button
              onClick={() => setShowLeaderboard(true)}
              style={{ ...styles.button, backgroundColor: '#f59e0b', marginLeft: '8px' }}
            >
              🏆 Leaderboard
            </button>

            <button
              onClick={() => setShowMembersModal(true)}
              style={{ ...styles.button, backgroundColor: '#10b981', marginLeft: '8px' }}
            >
              👥 Members
            </button>

            {canDelete && (
              <button
                onClick={handleCleanupUntitled}
                style={{ ...styles.button, backgroundColor: '#ef4444', marginLeft: '8px' }}
                title="Remove all tasks without titles"
              >
                🧹 Clean up Untitled
              </button>
            )}

            {canCreateTask && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => setShowAiModal(true)}
                  style={{ ...styles.button, backgroundColor: '#8b5cf6' }}
                >
                  ✨ AI Suggestions
                </button>

                {/* ONLY SHOW ADD TASK IF PERMITTED */}
                <div style={{ ...styles.createTask, marginLeft: '12px' }}>
                  <input
                    type="text"
                    placeholder="New task title"
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    style={styles.input}
                  />
                  <button onClick={handleCreateTask} style={styles.button}>Add Task</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.board}>
          {columns.map((column) => (
            <Column
              key={column.key}
              id={column.key}
              title={column.title}
              tasks={Array.isArray(tasks) ? tasks.filter(
                (task) => task.status === column.key
              ) : []}
              onTaskClick={setSelectedTask}
              onDelete={handleDeleteTask}
              canDrag={canDrag}
              canDelete={canDelete}
            />
          ))}
        </div>
      </DndContext>

      <TaskModal
        task={selectedTask}
        users={users}
        canComment={canComment}
        canAssign={canAssign}
        onAddComment={handleAddComment}
        onToggleAssignee={handleToggleAssignee}
        onClose={() => setSelectedTask(null)}
      />

      {showAiModal && (
        <AiTaskModal
          project={project}
          users={users}
          onClose={() => setShowAiModal(false)}
          onTasksGenerated={(newTasks) => {
            setTasks(prev => [...prev, ...newTasks]);
          }}
        />
      )}

      {/* CHATBOT (Bottom Right) */}
      <ChatWidget project={project} />

      {/* AI REPORT BUTTON (Bottom Left) */}
      <button
        onClick={() => setShowReportModal(true)}
        style={styles.fixedReportBtn}
      >
        📊 AI Report
      </button>

      {/* SPRINT REPORT MODAL */}
      {showReportModal && (
        <SprintReportModal
          project={project}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          project={project}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {showMembersModal && (
        <MembersModal
          organization={organization}
          currentUserRole={projectRole}
          onClose={() => setShowMembersModal(false)}
        />
      )}
    </>
  );
}

// ---------------------------
// STYLES
// ---------------------------
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '0 8px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  fixedReportBtn: {
    position: 'fixed',
    bottom: '24px',
    left: '24px', // Bottom Left
    zIndex: 1000,
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-lg)',
    transition: 'transform 0.2s',
    ':hover': { transform: 'scale(1.05)' }
  },
  createTask: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--border-subtle)',
    backgroundColor: 'var(--bg-input)',
    color: 'var(--text-primary)',
    minWidth: '240px',
    outline: 'none',
    boxShadow: 'var(--shadow-sm)',
    ':focus': {
      borderColor: 'var(--primary)',
      boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.2)'
    }
  },
  button: {
    padding: '10px 20px',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    boxShadow: 'var(--shadow-md)',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: 'var(--primary-hover)',
      transform: 'translateY(-1px)'
    }
  },
  board: {
    display: 'flex',
    gap: '24px',
    overflowX: 'auto',
    paddingBottom: '24px',
    height: 'calc(100vh - 140px)',
    alignItems: 'flex-start'
  }
};

export default ProjectBoard;

import { useState, useEffect } from "react";
import api from "../api/api";

function Sidebar({ projects, onSelectProject, onProjectCreated, organizations, activeOrg, onSelectOrg, onOrgCreated }) {
  const [activeProject, setActiveProject] = useState(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);

  const handleSelect = (project) => {
    setActiveProject(project.id);
    onSelectProject(project);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim() || !activeOrg) return;

    try {
      const res = await api.post(`/api/projects/organization/${activeOrg.id}`, { name: newProjectName });
      onProjectCreated(res.data);
      setNewProjectName("");
      setIsCreatingProject(false);
    } catch (err) {
      console.error("Failed to create project", err);
    }
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    try {
      const res = await api.post("/api/organizations", { name: newOrgName });
      onOrgCreated(res.data);
      setNewOrgName("");
      setIsCreatingOrg(false);
    } catch (err) {
      console.error("Failed to create org", err);
    }
  };

  // ... inside Sidebar function
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail.trim() || !activeOrg) return;

    try {
      await api.post(`/api/organizations/${activeOrg.id}/members`, { email: memberEmail });
      setMemberEmail("");
      setIsAddingMember(false);
      alert("Member added successfully!");
    } catch (err) {
      console.error("Failed to add member", err);
      alert("Failed to add member: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={styles.sidebar}>
      {/* ORGANIZATION SWITCHER */}
      <div style={styles.orgHeader}>
        {/* ... existing header code ... */}
        <div onClick={() => setShowOrgDropdown(!showOrgDropdown)} style={styles.orgSelector}>
          <span style={styles.logoIcon}>business</span>
          <span style={{ flex: 1 }}>{activeOrg ? activeOrg.name : "Select Org"}</span>
          <span>▼</span>
        </div>

        {showOrgDropdown && (
          <div style={styles.orgDropdown}>
            {organizations.map(org => (
              <div
                key={org.id}
                style={styles.dropdownItem}
                onClick={() => {
                  onSelectOrg(org);
                  setShowOrgDropdown(false);
                }}
              >
                {org.name}
              </div>
            ))}
            <div style={styles.dropdownDivider} />
            <div style={styles.dropdownItem} onClick={() => setIsCreatingOrg(true)}>
              + Create Organization
            </div>
            {/* NEW ADD MEMBER BUTTON IN DROPDOWN */}
            <div style={styles.dropdownItem} onClick={() => { setIsAddingMember(true); setShowOrgDropdown(false); }}>
              + Invite Member
            </div>
          </div>
        )}
      </div>

      {isCreatingOrg && (
        <form onSubmit={handleCreateOrg} style={styles.createForm}>
          <input
            autoFocus
            type="text"
            placeholder="Org name..."
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            style={styles.input}
            onBlur={() => !newOrgName && setIsCreatingOrg(false)}
          />
        </form>
      )}

      {/* NEW ADD MEMBER FORM */}
      {isAddingMember && (
        <form onSubmit={handleAddMember} style={styles.createForm}>
          <input
            autoFocus
            type="email"
            placeholder="User email..."
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            style={styles.input}
            onBlur={() => !memberEmail && setIsAddingMember(false)}
          />
        </form>
      )}

      {/* PROJECTS SECTION */}
      {/* ... existing project section ... */}

      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>Projects</span>
        <button
          onClick={() => setIsCreatingProject(true)}
          style={styles.addButton}
          title="Create Project"
          disabled={!activeOrg}
        >
          +
        </button>
      </div>

      {isCreatingProject && (
        <form onSubmit={handleCreateProject} style={styles.createForm}>
          <input
            autoFocus
            type="text"
            placeholder="Project name..."
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            style={styles.input}
            onBlur={() => !newProjectName && setIsCreatingProject(false)}
          />
        </form>
      )}

      <div style={styles.list}>
        {!activeOrg ? (
          <div style={styles.emptyState}>Select an organization</div>
        ) : projects.length === 0 && !isCreatingProject ? (
          <div style={styles.emptyState}>No projects yet.</div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              style={{
                ...styles.projectItem,
                ...(activeProject === project.id ? styles.projectItemActive : {})
              }}
              onClick={() => handleSelect(project)}
            >
              # {project.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "280px",
    backgroundColor: "var(--bg-sidebar)",
    color: "var(--text-primary)",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    flexShrink: 0,
    borderRight: "1px solid var(--border-subtle)"
  },
  orgHeader: {
    padding: '16px',
    borderBottom: '1px solid var(--border-subtle)',
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  orgSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    padding: '10px',
    borderRadius: '8px',
    transition: 'background 0.2s',
    '&:hover': {
      backgroundColor: 'var(--bg-card-hover)'
    }
  },
  orgDropdown: {
    position: 'absolute',
    top: '70px',
    left: '16px',
    right: '16px',
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 100,
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden',
    padding: '4px'
  },
  dropdownItem: {
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: 'var(--text-primary)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: 'var(--primary)',
      color: 'white'
    }
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'var(--border-subtle)',
    margin: '4px 0'
  },
  logoIcon: {
    fontFamily: "Material Icons",
    fontSize: "24px",
    color: "var(--primary)",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    padding: "6px",
    borderRadius: "8px"
  },
  sectionHeader: {
    padding: "24px 20px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    fontWeight: "700",
    color: "var(--text-muted)"
  },
  addButton: {
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    border: "1px solid var(--border-subtle)",
    ':hover': {
      borderColor: "var(--primary)",
      color: "var(--primary)"
    }
  },
  list: {
    padding: "8px 16px",
    overflowY: "auto",
    flex: 1
  },
  projectItem: {
    padding: "10px 12px",
    cursor: "pointer",
    borderRadius: "6px",
    marginBottom: "4px",
    fontSize: "14px",
    color: "var(--text-secondary)",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  projectItemActive: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    color: "var(--primary)",
    fontWeight: "500"
  },
  createForm: {
    padding: "0 20px 15px"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid var(--border-subtle)",
    backgroundColor: "var(--bg-app)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    ':focus': {
      borderColor: "var(--primary)"
    }
  },
  emptyState: {
    padding: "20px",
    fontSize: "13px",
    color: "var(--text-muted)",
    textAlign: "center",
    fontStyle: "italic"
  }
};

export default Sidebar;

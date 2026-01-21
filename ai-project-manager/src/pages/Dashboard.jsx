import { useEffect, useState } from "react";
import api from "../api/api";
import ErrorBoundary from "../components/ErrorBoundary";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProjectBoard from "../tasks/ProjectBoard";

function Dashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  // 1. Fetch Organizations on Load
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // 2. Fetch Projects when Active Org Changes
  useEffect(() => {
    if (activeOrg) {
      fetchProjects(activeOrg.id);
    } else {
      setProjects([]);
      setSelectedProject(null);
    }
  }, [activeOrg]);

  const fetchOrganizations = () => {
    api.get("/api/organizations")
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setOrganizations(res.data);
          setActiveOrg(res.data[0]); // Auto-select first org
        } else {
          setOrganizations([]);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load organizations");
      });
  };

  const fetchProjects = (orgId) => {
    api.get(`/api/projects/organization/${orgId}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setProjects(res.data);
          setSelectedProject(null); // Reset selection
        }
      })
      .catch(() => {
        setError("Failed to load projects");
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <Sidebar
          organizations={organizations}
          activeOrg={activeOrg}
          onSelectOrg={setActiveOrg}
          onOrgCreated={(newOrg) => {
            setOrganizations([...organizations, newOrg]);
            setActiveOrg(newOrg);
          }}

          projects={projects}
          onSelectProject={setSelectedProject}
          onProjectCreated={(newProject) => {
            setProjects([...projects, newProject]);
            setSelectedProject(newProject);
          }}
        />

        {/* MAIN CONTENT */}
        <div style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto",
          backgroundColor: "var(--bg-app)"
        }}>
          {!selectedProject && activeOrg && (
            <h2 style={{ color: "var(--text-secondary)", fontStyle: "italic", textAlign: "center", marginTop: "100px" }}>
              Select a project from the sidebar to get started
            </h2>
          )}

          {error && <p style={{ color: "var(--status-high)", textAlign: "center" }}>{error}</p>}

          {/* PROJECT BOARD WITH ERROR BOUNDARY */}
          {selectedProject && (
            <ErrorBoundary>
              <ProjectBoard project={selectedProject} organization={activeOrg} />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

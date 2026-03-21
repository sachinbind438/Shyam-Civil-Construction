import { useState, useEffect } from "react";
import { Project, FilterCategory } from "../types/project";

// ── Use projects hook ─────────────────────────────────────────────────────────
export function useProjects(initialProjects?: Project[]) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("All");

  // Fetch projects from API
  const fetchProjects = async (category?: FilterCategory) => {
    setLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams();
      if (category && category !== "All") {
        params.append("category", category);
      }
      
      const response = await fetch(`/api/projects?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch projects");
      }
      
      setProjects(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects on client side
  const filteredProjects = projects.filter(project => {
    if (activeFilter === "All") return true;
    return project.category === activeFilter;
  });

  // Auto-fetch when filter changes
  useEffect(() => {
    if (!initialProjects) {
      fetchProjects(activeFilter);
    }
  }, [activeFilter]);

  // Refresh projects
  const refresh = () => fetchProjects(activeFilter);

  return {
    projects: filteredProjects,
    allProjects: projects,
    loading,
    error,
    activeFilter,
    setActiveFilter,
    refresh,
    fetchProjects
  };
}

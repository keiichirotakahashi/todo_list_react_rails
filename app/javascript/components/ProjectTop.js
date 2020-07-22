import React, { useState, useEffect } from 'react';
import ProjectNewCard from './ProjectNewCard';
import ProjectCard from './ProjectCard';

const ProjectTop = props => {
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({ name: '' });
  const [formErrors, setFormErrors] = useState([]);
  const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");

  useEffect(() => {
    let unmounted = false;
    const getProjects = async () => {
      try {
        const response = await fetch('/api/v1/projects');
        const json = await response.json();
        if (!unmounted) {
          setProjects(json);
        }
      } catch(error) {
        props.showErrorFlash();
      }
    };
    getProjects();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, []);

  const handleProjectFormChange = event => {
    const { name, value } = event.target;
    setProjectForm({ ...projectForm, [name]: value });
  };

  const handleProjectFormSubmit = (event, id) => {
    event.preventDefault();
    setFormErrors([]);
    props.removeFlashNow();

    if (id) return patchProject(id);
    postProject();
  };

  const postProject = async () => {
    try {
      const response = await fetch('/api/v1/projects', {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({ project: projectForm })
      });

      if (response.ok) {
        const json = await response.json();
        projects.unshift(json);
        setProjects(projects);
        setProjectForm({ name: '' });
        props.showNoticeFlash('プロジェクトを作成しました。');
        return;
      }

      const json = await response.json();
      setFormErrors(json);
      props.showErrorFlash('プロジェクトの作成に失敗しました。');
    } catch (error) {
      props.showErrorFlash();
    }
  };

  const patchProject = async id => {
    try {
      const response = await fetch(`/api/v1/projects/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({ project: projectForm })
      });

      if (response.ok) {
        const json = await response.json();
        setProjects(projects.map(project => {
          if (project.id === json.id) return json;
          return project;
        }));
        props.showNoticeFlash('プロジェクトを更新しました。');
        return;
      }

      const json = await response.json();
      setFormErrors(json);
      props.showErrorFlash('プロジェクトの更新に失敗しました。');
    } catch (error) {
      props.showErrorFlash();
    }
  };

  const buildProjectForm = async id => {
    props.removeFlashNow();

    try {
      const response = await fetch(`/api/v1/projects/${id}`);
      const json = await response.json();
      setProjectForm({ name: json.name });
    } catch (error) {
      props.showErrorFlash();
    }
  }

  const resetProjectForm = () => {
    setProjectForm({ name: '' });
  };

  const removeFormErrors = () => {
    setFormErrors([]);
  };

  const removeProject = async id => {
    props.removeFlashNow();

    try {
      const response = await fetch(`/api/v1/projects/${id}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": csrfToken }
      });
      const json = await response.json();
      setProjects(projects.filter(project => {
        return project.id !== json.id;
      }));
      props.showNoticeFlash('プロジェクトを削除しました。');
    } catch (error) {
      props.showErrorFlash();
    }
  };

  const projectList = projects.map(project =>
    <ProjectCard
      key={project.id}
      projectData={project}
      projectFormData={projectForm}
      formErrorsData={formErrors}
      buildProjectForm={buildProjectForm}
      handleProjectFormChange={handleProjectFormChange}
      handleProjectFormSubmit={handleProjectFormSubmit}
      resetProjectForm={resetProjectForm}
      removeFormErrors={removeFormErrors}
      removeProject={removeProject} />
  );

  return(
    <div className='project-top'>
      <h1 className='project-top__title'>
        プロジェクト一覧
      </h1>
      <div className='project-top-cards'>
        <ProjectNewCard
          projectFormData={projectForm}
          formErrorsData={formErrors}
          handleProjectFormChange={handleProjectFormChange}
          handleProjectFormSubmit={handleProjectFormSubmit}
          resetProjectForm={resetProjectForm}
          removeFormErrors={removeFormErrors} />
        {projectList}
      </div>
    </div>
  );
};

export default ProjectTop;

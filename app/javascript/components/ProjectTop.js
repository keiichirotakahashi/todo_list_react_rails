import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';

const ProjectTop = (props) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await fetch('/api/v1/projects');
        const json = await response.json();
        setProjects(json);
      } catch(error) {
        props.showErrorFlash();
      }
    }

    getProjects();
  }, []);

  const projectList = projects.map((project) =>
    <ProjectCard
      key={project.id}
      projectData={project} />
  );

  return(
    <div className='project-top'>
      <h1 className='project-top__title'>
        プロジェクト一覧
      </h1>
      <div className='project-top-cards'>
        {projectList}
      </div>
    </div>
  );
}

export default ProjectTop;

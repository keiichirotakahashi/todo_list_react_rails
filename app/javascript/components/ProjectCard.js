import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = (props) => {
  const id = props.projectData.id;
  const name = props.projectData.name;

  return(
    <div className='project-card'>
      <Link to={`/projects/${id}`}
        className='project-card-inner'>
        <h2 className='project-card-inner__name'>
          {name}
        </h2>
      </Link>
    </div>
  );
}

export default ProjectCard;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import More from './More';
import Menu from './Menu';
import Modal from './Modal';
import ProjectForm from './ProjectForm';

const ProjectCard = props => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const id = props.projectData.id;
  const name = props.projectData.name;
  const projectForm = props.projectFormData;
  const formErrors = props.formErrorsData;

  const handleClickMore = () => {
    if (isMenuOpen) return;
    setIsMenuOpen(true);
  };

  document.body.addEventListener('click', event => {
    if (!isMenuOpen) return;
    if (event.target.closest('.project-card-menu')) return;
    setIsMenuOpen(false);
  });

  const handleClickEdit = () => {
    if (isModalOpen) return;
    setIsModalOpen(true);
    setIsMenuOpen(false);
    props.buildProjectForm(id);
  };

  const handleClickModalClose = () => {
    setIsModalOpen(false);
    props.resetProjectForm();
    props.removeFormErrors();
  };

  let menu;
  if (isMenuOpen) {
    menu = (
      <div className='project-card-menu'>
        <Menu
          id={id}
          handleClickEdit={handleClickEdit}
          removeProject={props.removeProject} />
      </div>
    );
  }

  let modal;
  if (isModalOpen) {
    modal = (
      <Modal
        modalBody={
          <ProjectForm
            formName={'プロジェクトを更新する'}
            buttonText={'保存'}
            id={id}
            projectFormData={projectForm}
            formErrorsData={formErrors}
            handleProjectFormChange={props.handleProjectFormChange}
            handleProjectFormSubmit={props.handleProjectFormSubmit} />
        }
        handleClickModalClose={handleClickModalClose}/>
    );
  }

  return (
    <div className='project-card'>
      <Link to={`/projects/${id}`}
        className='project-card-inner'>
        <h2 className='project-card-inner__name'>
          {name}
        </h2>
      </Link>
      <div className='project-card-more'>
        <More handleClickMore={handleClickMore} />
      </div>
      {menu}
      {modal}
    </div>
  );
};

export default ProjectCard;

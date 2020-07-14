import React, { useState } from 'react';
import Modal from './Modal';
import ProjectForm from './ProjectForm';

const ProjectNewCard = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projectForm = props.projectFormData;
  const formErrors = props.formErrorsData;

  const handleClickNew = () => {
    setIsModalOpen(true);
  }

  const handleClickModalClose = () => {
    setIsModalOpen(false);
    props.resetProjectForm();
    props.removeFormErrors();
  }

  let modal;
  if (isModalOpen) {
    modal = (
      <Modal
        modalBody={
          <ProjectForm
            projectFormData={projectForm}
            formErrorsData={formErrors}
            handleProjectFormChange={props.handleProjectFormChange}
            handleProjectFormSubmit={props.handleProjectFormSubmit} />
        }
        handleClickModalClose={handleClickModalClose} />
    )
  }

  return (
    <div className='project-new-card'>
      <div className='project-new-card-inner'
        onClick={() => {handleClickNew()}}>
        <h2 className='project-new-card-inner__name'>
          新規作成
        </h2>
      </div>
      {modal}
    </div>
  );
}

export default ProjectNewCard;

import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';

const Project = props => {
  const projectId = props.match.params.id;
  const [projectName, setProjectName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState({
    name: '',
    due_on: ''
  });
  const [taskFormErrors, setTaskFormErrors] = useState([]);
  const [modalTaskForm, setModalTaskForm] = useState({
    name: '',
    due_on: ''
  });
  const [modalTaskFormErrors, setModalTaskFormErrors] = useState([]);
  const csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");

  useEffect(() => {
    let unmounted = false;
    const getProject = async () => {
      try {
        const response = await fetch(`/api/v1/projects/${projectId}`);
        const json = await response.json();
        if (!unmounted) {
          setProjectName(json.name);
        }
      } catch (error) {
        props.showErrorFlash();
      }
    };
    getProject();
    const getTasks = async () => {
      try {
        const response = await fetch(`/api/v1/projects/${projectId}/tasks`);
        const json = await response.json();
        if (!unmounted) {
          setTasks(json);
        }
      } catch (error) {
        props.showErrorFlash();
      }
    };
    getTasks();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, []);

  const handleTaskFormChange = event => {
    const { name, value } = event.target;
    setTaskForm({ ...taskForm, [name]: value });
  };

  const handleTaskFormSubmit = (event, id) => {
    event.preventDefault();
    props.removeFlashNow();

    if (id) return patchTask(id, taskForm);
    postTask();
  };

  const postTask = async () => {
    setTaskFormErrors([]);

    try {
      const response = await fetch(`/api/v1/projects/${projectId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({ task: taskForm })
      });

      if (response.ok) {
        const json = await response.json();
        tasks.unshift(json);
        setTasks(tasks);
        setTaskForm({
          name: '',
          due_on: ''
        });
        props.showNoticeFlash('ToDoを作成しました。');
        return;
      }

      const json = await response.json();
      setTaskFormErrors(json);
      props.showErrorFlash('ToDoの作成に失敗しました。');
    } catch (error) {
      props.showErrorFlash();
    }
  };

  const buildModalTaskForm = async id => {
    props.removeFlashNow();

    try {
      const response = await fetch(`/api/v1/projects/${projectId}/tasks/${id}`);
      const json = await response.json();
      setModalTaskForm({
        name: json.name,
        due_on: json.due_on
      });
    } catch (error) {
      props.showErrorFlash();
    }
  };

  const handleModalTaskFormChange = event => {
    const { name, value } = event.target;
    setModalTaskForm({ ...modalTaskForm, [name]: value });
  };

  const handleModalTaskFormSubmit = (event, id) => {
    event.preventDefault();
    patchTask(id, modalTaskForm);
  };

  const toggleStatus = (id, status) => {
    const toggledStatus = status === 'todo' ? 'done' : 'todo';
    patchTask(id, { status: toggledStatus });
  };

  const removeModalTaskFormErrors = () => {
    setModalTaskFormErrors([]);
  };

  const patchTask = async (id, attributes) => {
    removeModalTaskFormErrors();
    props.removeFlashNow();

    try {
      const response = await fetch(`/api/v1/projects/${projectId}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRF-Token": csrfToken
        },
        body: JSON.stringify({ task: attributes })
      });

      if (response.ok) {
        const json = await response.json();
        setTasks(tasks.map(task => {
          if (task.id === json.id) return json;
          return task;
        }));
        props.showNoticeFlash('ToDoを更新しました。');
        return;
      }

      const json = await response.json();
      setModalTaskFormErrors(json);
      props.showErrorFlash('ToDoの更新に失敗しました。');
    } catch (error) {
      props.showErrorFlash();
    }
  };

  const resetModalTaskForm = () => {
    setModalTaskForm({
      name: '',
      due_on: ''
    });
  };

  const removeTask = async id => {
    props.removeFlashNow();

    try {
      const response = await fetch(`/api/v1/projects/${projectId}/tasks/${id}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": csrfToken }
      });
      const json = await response.json();
      setTasks(tasks.filter(task => {
        return task.id !== json.id;
      }));
      props.showNoticeFlash('ToDoを削除しました。');
    } catch (error) {
      props.showErrorFlash();
    }
  };

  const taskList = tasks.map(task =>
    <TaskCard
      key={task.id}
      taskData={task}
      toggleStatus={toggleStatus}
      removeTask={removeTask}
      modalTaskFormData={modalTaskForm}
      modalTaskFormErrorsData={modalTaskFormErrors}
      buildModalTaskForm={buildModalTaskForm}
      handleModalTaskFormChange={handleModalTaskFormChange}
      handleModalTaskFormSubmit={handleModalTaskFormSubmit}
      removeModalTaskFormErrors={removeModalTaskFormErrors}
      resetModalTaskForm={resetModalTaskForm} />
  );

  return (
    <div className='project'>
      <h1 className='project__title'>
        {projectName}
      </h1>
      <div className='project-task-cards'>
        <div className='project-task-cards-form'>
          <TaskForm
            formName={'新しいToDoを作成する'}
            buttonText={'作成'}
            taskFormData={taskForm}
            formErrorsData={taskFormErrors}
            handleTaskFormChange={handleTaskFormChange}
            handleTaskFormSubmit={handleTaskFormSubmit} />
        </div>
        {taskList}
      </div>
    </div >
  );
};

export default Project;

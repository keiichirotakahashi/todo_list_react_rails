import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';

const Task = (props) => {
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
  const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch('/api/v1/tasks');
        const json = await response.json();
        setTasks(json);
      } catch (error) {
        props.showErrorFlash();
      }
    }

    getTasks();
  }, []);

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target;
    setTaskForm({...taskForm, [name]: value});
  }

  const handleTaskFormSubmit = async (event) => {
    event.preventDefault();
    setTaskFormErrors([]);
    props.removeFlashNow();

    try {
      const response = await fetch('/api/v1/tasks', {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRF-Token": csrf
        },
        body: JSON.stringify({task: taskForm})
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
    } catch(error) {
      props.showErrorFlash();
    }   
  }

  const buildModalTaskForm = async (id) => {
    props.removeFlashNow();

    try {
      const response = await fetch(`/api/v1/tasks/${id}`);
      const json = await response.json();
      setModalTaskForm({
        name: json.name,
        due_on: json.due_on
      });
    } catch(error) {
      props.showErrorFlash();
    }
  }

  const handleModalTaskFormChange = (event) => {
    const { name, value } = event.target;
    setModalTaskForm({...modalTaskForm, [name]: value});
  }

  const handleModalTaskFormSubmit = (event, id) => {
    event.preventDefault();
    patchTask(id, modalTaskForm);
  }

  const toggleStatus = (id, status) => {
    const toggledStatus = status === 'todo' ? 'done' : 'todo';
    patchTask(id, {status: toggledStatus});
  }

  const removeModalTaskFormErrors = () => {
    setModalTaskFormErrors([]);
  }

  const patchTask = async (id, attributes) => {
    removeModalTaskFormErrors();
    props.removeFlashNow();

    try {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRF-Token": csrf
        },
        body: JSON.stringify({task: attributes})
      });

      if (response.ok) {
        const json = await response.json();
        const copiedTasks = tasks.map(task => {
          if (task.id === json.id) return json;
          return task;
        });
        setTasks(copiedTasks);
        props.showNoticeFlash('ToDoを更新しました。');
        return;
      }

      const json = await response.json();
      setModalTaskFormErrors(json);
      props.showErrorFlash('ToDoの更新に失敗しました。');
    } catch(error) {
      props.showErrorFlash();
    }
  }

  const resetModalTaskForm = () => {
    setModalTaskForm({
      name: '',
      due_on: ''
    });
  }

  const removeTask = async (id) => {
    props.removeFlashNow();

    try {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: "DELETE",
        headers: {"X-CSRF-Token": csrf}
      });
      const json = await response.json();
      setTasks(tasks.filter(task => {
        return task.id !== json.id;
      }));
      props.showNoticeFlash('ToDoを削除しました。');
    } catch(error) {
      props.showErrorFlash();
    }
  }

  const taskComponents = tasks.map((task) =>
    <TaskCard
      key={task.id}
      taskData={task}
      toggleStatus={toggleStatus}
      removeTask={removeTask}
      modalTaskFormData={modalTaskForm}
      formErrorsData={modalTaskFormErrors}
      buildModalTaskForm={buildModalTaskForm}
      handleModalTaskFormChange={handleModalTaskFormChange}
      handleModalTaskFormSubmit={handleModalTaskFormSubmit}
      removeModalTaskFormErrors={removeModalTaskFormErrors}
      resetModalTaskForm={resetModalTaskForm} />
  );

  return(
    <React.Fragment>
      <TaskForm
        taskFormData={taskForm}
        formErrorsData={taskFormErrors}
        handleTaskFormChange={handleTaskFormChange}
        handleTaskFormSubmit={handleTaskFormSubmit} />
      {taskComponents}
    </React.Fragment>
  );
}

export default Task;

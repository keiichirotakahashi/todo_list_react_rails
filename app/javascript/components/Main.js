import React, { useState, useEffect } from 'react';
import Flash from './Flash';
import TaskForm from './TaskForm';
import Task from './Task';

const Main = () => {
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
  const [flash, setFlash] = useState({
    isVisible: false,
    status: 'hidden',
    message: ''
  });  
  const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  let timer = null;

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetch('/api/v1/tasks');
        const json = await response.json();
        setTasks(json);
      } catch (error) {
        showErrorFlash();
      }
    }

    getTasks();
  }, []);

  const showNoticeFlash = (message) => {
    setFlash({
      isVisible: true,
      status: 'notice',
      message: message
    });
    removeFlashLater();
  }

  const showErrorFlash = (message) => {
    setFlash({
      isVisible: true,
      status: 'error',
      message: message ? message : 'エラーが発生しました。'
    });
    removeFlashLater();
  }

  const removeFlash = () => {
    setFlash({
      isVisible: false,
      status: 'hidden',
      message: ''
    });
  }

  const removeFlashNow = () => {
    clearTimeout(timer);
    removeFlash();
  }

  const removeFlashLater = () => {
    timer = setTimeout(() => {removeFlash()}, 3000);
  }

  const handleTaskFormChange = (event) => {
    const { name, value } = event.target;
    setTaskForm({...taskForm, [name]: value});
  }

  const handleTaskFormSubmit = async (event) => {
    event.preventDefault();
    setTaskFormErrors([]);
    removeFlashNow();

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
        showNoticeFlash('ToDoを作成しました。');
        return;
      }

      const json = await response.json();
      setTaskFormErrors(json);
      showErrorFlash('ToDoの作成に失敗しました。');
    } catch(error) {
      showErrorFlash();
    }   
  }

  const buildModalTaskForm = async (id) => {
    removeFlashNow();

    try {
      const response = await fetch(`/api/v1/tasks/${id}`);
      const json = await response.json();
      setModalTaskForm({
        name: json.name,
        due_on: json.due_on
      });
    } catch(error) {
      showErrorFlash();
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
    removeFlashNow();

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
        showNoticeFlash('ToDoを更新しました。');
        return;
      }

      const json = await response.json();
      setModalTaskFormErrors(json);
      showErrorFlash('ToDoの更新に失敗しました。');
    } catch(error) {
      showErrorFlash();
    }
  }

  const resetModalTaskForm = () => {
    setModalTaskForm({
      name: '',
      due_on: ''
    });
  }

  const removeTask = async (id) => {
    removeFlashNow();

    try {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: "DELETE",
        headers: {"X-CSRF-Token": csrf}
      });
      const json = await response.json();
      setTasks(tasks.filter(task => {
        return task.id !== json.id;
      }));
      showNoticeFlash('ToDoを削除しました。');
    } catch(error) {
      showErrorFlash();
    }
  }

  const taskComponents = tasks.map((task) =>
    <Task
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
    <main className='main'>
      <Flash flashData={flash} />
      <div className='main-box'>
        <TaskForm
          taskFormData={taskForm}
          formErrorsData={taskFormErrors}
          handleTaskFormChange={handleTaskFormChange}
          handleTaskFormSubmit={handleTaskFormSubmit} />
        {taskComponents}
      </div>
    </main>
  );
}

export default Main;

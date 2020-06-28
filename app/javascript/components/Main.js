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
      const response = await fetch('/api/v1/tasks');
      if (response.ok) {
        return response.json();
      }
      throw new Error();
    }
    
    getTasks()
      .then(json => {
        setTasks(json);
      })
      .catch(error => {
        showErrorFlash();
      })
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

  const handleTaskFormSubmit = (event) => {
    event.preventDefault();
    createTask(taskForm);
  }

  const createTask = (task) => {
    setTaskFormErrors([]);
    removeFlashNow();

    const postTask = async (task) => {
      const response = await fetch('/api/v1/tasks', {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRF-Token": csrf
        },
        body: JSON.stringify({task: task})
      });
      if (response.ok) {
        return response.json();
      }
      if (response.status === 400) {
        throw response;
      }
      throw new Error();
    }

    postTask(task)
      .then(json => {
        tasks.unshift(json);
        setTasks(tasks);
        setTaskForm({
          name: '',
          due_on: ''
        });
        showNoticeFlash('ToDoを作成しました。');
      })
      .catch(error => {
        if (error.status === 400) {
          error
            .json()
            .then(json => {
              setTaskFormErrors(json);
              showErrorFlash('ToDoの作成に失敗しました。');
              return;
            })
        }
        showErrorFlash();
      })
  }

  const buildModalTaskForm = (id) => {
    removeFlashNow();

    const getTask = async (id) => {
      const response = await fetch(`/api/v1/tasks/${id}`);
      if (response.ok) {
        return response.json();
      }
      throw new Error();
    }

    getTask(id)
      .then(json => {
        setModalTaskForm({
          name: json.name,
          due_on: json.due_on
        });
      })
      .catch(error => {
        showErrorFlash();
      })
  }

  const handleModalTaskFormChange = (event) => {
    const { name, value } = event.target;
    setModalTaskForm({...modalTaskForm, [name]: value});
  }

  const handleModalTaskFormSubmit = (event, id) => {
    event.preventDefault();
    updateTask(id, modalTaskForm);
  }

  const toggleStatus = (id, status) => {
    const attributes = {status: null};
    let toggledStatus;

    if (status === 'todo') {
      toggledStatus = 'done';
    } else {
      toggledStatus = 'todo';
    }
    attributes.status = toggledStatus;
    updateTask(id, attributes);
  }

  const removeModalTaskFormErrors = () => {
    setModalTaskFormErrors([]);
  }

  const updateTask = (id, attributes) => {
    removeModalTaskFormErrors();
    removeFlashNow();

    const patchTask = async (id, attributes) => {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-CSRF-Token": csrf
        },
        body: JSON.stringify({task: attributes})
      });
      if (response.ok) {
        return response.json();
      }
      if (response.status === 400) {
        throw response;
      }
      throw new Error();
    }

    patchTask(id, attributes)
      .then(json => {
        const copiedTasks = tasks.map(task => {
          if (task.id === json.id) {
            return json;
          } else {
            return task;
          }
        });
        setTasks(copiedTasks);
        showNoticeFlash('ToDoを更新しました。');
      })
      .catch(error => {
        if (error.status === 400) {
          error
            .json()
            .then(json => {
            setModalTaskFormErrors(json);
            showErrorFlash('ToDoの更新に失敗しました。');
            return;
          })
        }
        showErrorFlash();
      })
  }

  const resetModalTaskForm = () => {
    setModalTaskForm({
      name: '',
      due_on: ''
    });
  }

  const removeTask = (id) => {
    removeFlashNow();

    const deleteTask = async (id) => {
      const response = await fetch(`/api/v1/tasks/${id}`, {
        method: "DELETE",
        headers: {"X-CSRF-Token": csrf}
      });
      if (response.ok) {
        return response.json();
      }
      throw new Error();
    }

    deleteTask(id)
      .then(json => {
        setTasks(tasks.filter(task => {
          return task.id !== json.id;
        }));
        showNoticeFlash('ToDoを削除しました。');
      })
      .catch(error => {
        showErrorFlash();
      })
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

import React from 'react';
import Flash from './Flash';
import TaskForm from './TaskForm';
import Task from './Task';

class Main extends React.Component {
  state = {
    tasks: [],
    taskForm: {
      name: '',
      due_on: ''
    },
    taskFormErrors: [],
    modalTaskForm: {
      name: '',
      due_on: ''
    },
    modalTaskFormErrors: [],
    flash: {
      isVisible: false,
      status: 'hidden',
      message: ''
    }
  }
  timer = null;
  csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");

  componentDidMount() {
    fetch('/api/v1/tasks')
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          this.setState({tasks: response.data});
        }
      })
      .catch((error) => {
        this.showErrorFlash();
        this.removeFlashLater();
      })
  }

  showNoticeFlash(message) {
    this.setState({
      flash: {
        isVisible: true,
        status: 'notice',
        message: message
      }
    });
  }

  showErrorFlash(message) {
    this.setState({
      flash: {
        isVisible: true,
        status: 'error',
        message: message ? message : 'エラーが発生しました。'
      }
    });
  }

  removeFlash() {
    this.setState({
      flash: {
        isVisible: false,
        status: 'hidden',
        message: ''
      }
    });
  }

  removeFlashNow() {
    clearTimeout(this.timer);
    this.removeFlash();
  }

  removeFlashLater() {
    this.timer = setTimeout(() => {this.removeFlash()}, 3000);
  }

  handleTaskFormChange = (event) => {
    const { name, value } = event.target;
    const copiedTaskForm = this.state.taskForm;
    copiedTaskForm[name] = value;

    this.setState({taskForm: copiedTaskForm});
  }

  handleTaskFormSubmit = (event) => {
    event.preventDefault();
    this.createTask(this.state.taskForm);
  }

  createTask = (task) => {
    const tasks = this.state.tasks;

    this.setState({taskFormErrors: []});
    this.removeFlashNow();

    fetch('/api/v1/tasks', {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRF-Token": this.csrf
      },
      body: JSON.stringify({task: task})
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          tasks.unshift(response.data);
          this.setState({
            tasks: tasks,
            taskForm: {
              name: '',
              due_on: ''
            }
          });
          this.showNoticeFlash(response.message);
          this.removeFlashLater();
          return;
        }
        if (response.status === 400) {
          this.setState({taskFormErrors: response.data});
          this.showErrorFlash(response.message);
          this.removeFlashLater();
          return;
        }
      })
      .catch((error) => {
        this.showErrorFlash();
        this.removeFlashLater();
      })
  }

  setModalTaskForm = (id) => {
    this.removeFlashNow();

    fetch(`/api/v1/tasks/${id}`)
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          this.setState({
            modalTaskForm: {
              name: response.data.name,
              due_on: response.data.due_on
            }
          });
          return;
        }
      })
      .catch((error) => {
        this.showErrorFlash();
        this.removeFlashLater();
      })
  }

  handleModalTaskFormChange = (event) => {
    const { name, value } = event.target;
    const copiedModalTaskForm = this.state.modalTaskForm;
    copiedModalTaskForm[name] = value;

    this.setState({modalTaskForm: copiedModalTaskForm});
  }

  handleModalTaskFormSubmit = (event, id) => {
    event.preventDefault();
    this.updateTask(id, this.state.modalTaskForm);
  }

  toggleStatus = (id, status) => {
    const attributes = {status: null};

    if (status === 'todo') {
      status = 'done';
    } else {
      status = 'todo';
    }
    attributes.status = status;
    this.updateTask(id, attributes);
  }

  removeModalTaskFormErrors = () => {
    this.setState({modalTaskFormErrors: []});
  }

  updateTask = (id, attributes) => {
    const tasks = this.state.tasks;

    this.removeModalTaskFormErrors();
    this.removeFlashNow();

    fetch(`/api/v1/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRF-Token": this.csrf
      },
      body: JSON.stringify({task: attributes})
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          const copiedTasks = tasks.map(task => {
            if (task.id === response.data.id) {
              return response.data;
            } else {
              return task;
            }
          });
          this.setState({tasks: copiedTasks});
          this.showNoticeFlash(response.message);
          this.removeFlashLater();
          return;
        }
        if (response.status === 400) {
          this.setState({modalTaskFormErrors: response.data});
          this.showErrorFlash(response.message);
          this.removeFlashLater();
          return;
        }
      })
      .catch((error) => {
        this.showErrorFlash();
        this.removeFlashLater();
      })
  }

  resetModalTaskForm = () => {
    this.setState({
      modalTaskForm: {
        name: '',
        due_on: ''
      }
    });
  }

  removeTask = (id) => {
    const tasks = this.state.tasks;

    this.removeFlashNow();

    fetch(`/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {"X-CSRF-Token": this.csrf}
    })
      .then(response => response.json())
      .then(response => {
        if (response.status === 200) {
          this.setState({
            tasks: tasks.filter((task) => {
              return task.id !== response.data.id;
            })
          });
          this.showNoticeFlash(response.message);
          this.removeFlashLater();
          return;
        }
        if (response.status === 400) {
          this.showErrorFlash(response.message);
          this.removeFlashLater();
          return;
        }
      })
      .catch((error) => {
        this.showErrorFlash();
        this.removeFadedFlash();
      })
  }

  render() {
    const tasks = this.state.tasks;
    const taskForm = this.state.taskForm;
    const taskFormErrors = this.state.taskFormErrors;
    const modalTaskForm = this.state.modalTaskForm;
    const modalTaskFormErrors = this.state.modalTaskFormErrors;
    const flash = this.state.flash;

    const taskComponents = tasks.map((task) => {
      return <Task
               key={task.id}
               taskData={task}
               toggleStatus={this.toggleStatus}
               removeTask={this.removeTask}
               modalTaskFormData={modalTaskForm}
               formErrorsData={modalTaskFormErrors}
               setModalTaskForm={this.setModalTaskForm}
               handleModalTaskFormChange={this.handleModalTaskFormChange}
               handleModalTaskFormSubmit={this.handleModalTaskFormSubmit}
               removeModalTaskFormErrors={this.removeModalTaskFormErrors}
               resetModalTaskForm={this.resetModalTaskForm} />
    });

    return(
      <main className='main'>
        <Flash flashData={flash} />
        <div className='main-box'>
          <TaskForm
            taskFormData={taskForm}
            formErrorsData={taskFormErrors}
            handleTaskFormChange={this.handleTaskFormChange}
            handleTaskFormSubmit={this.handleTaskFormSubmit} />
          {taskComponents}
        </div>
      </main>
    );
  }
}

export default Main;

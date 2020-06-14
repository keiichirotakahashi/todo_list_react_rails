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
      .then(response => {this.setState({tasks: response.data})})
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

  handleChange = (event) => {
    const { name, value } = event.target;
    const copiedTaskForm = this.state.taskForm;
    copiedTaskForm[name] = value;

    this.setState({taskForm: copiedTaskForm});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.createTask(this.state.taskForm);
  }

  createTask = (task) => {
    const tasks = this.state.tasks;

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

  toggleStatus = (id, status) => {
    const tasks = this.state.tasks;

    if (status === 'todo') {
      status = 'done';
    } else {
      status = 'todo';
    }

    this.removeFlashNow();

    fetch(`/api/v1/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-CSRF-Token": this.csrf
      },
      body: JSON.stringify({task: {status: status}})
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
    const flash = this.state.flash;

    const taskComponents = tasks.map((task) => {
      return <Task
               key={task.id}
               taskData={task}
               toggleStatus={this.toggleStatus}
               removeTask={this.removeTask} />
    });

    return(
      <main className='main'>
        <Flash flashData={flash} />
        <div className='main-box'>
          <TaskForm
            taskFormData={taskForm}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit} />
          {taskComponents}
        </div>
      </main>
    );
  }
}

export default Main;

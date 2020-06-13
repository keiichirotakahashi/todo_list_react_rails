import React from 'react';
import Flash from './Flash';
import Task from './Task';

class Main extends React.Component {
  state = {
    tasks: [],
    flash: {
      isVisible: false,
      status: 'hidden',
      message: ''
    }
  }
  timer = null;

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

  toggleStatus = (id, status) => {
    const tasks = this.state.tasks;
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");

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
        "X-CSRF-Token": csrf
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
          this.showErrorFlash(`${response.message}\n${response.data}`);
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
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");

    this.removeFlashNow();

    fetch(`/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {"X-CSRF-Token": csrf}
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
          this.showErrorFlash(`${response.message}\n${response.data}`);
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
    const flash = this.state.flash;

    const taskComponents = tasks.map((task) => {
      return <Task
               key={task.id}
               id={task.id}
               name={task.name}
               status={task.status}
               due_on={task.due_on}
               created_at={task.created_at}
               toggleStatus={this.toggleStatus}
               removeTask={this.removeTask} />
    });

    return(
      <main className='main'>
        <Flash flashData={flash} />
        <div className='main-box'>
          {taskComponents}
        </div>
      </main>
    );
  }
}

export default Main;
import React from 'react';
import Task from './Task';

class Main extends React.Component {
  state = {
    tasks: []
  }

  componentDidMount() {
    fetch('/api/v1/tasks')
      .then(response => response.json())
      .then(response => {this.setState({tasks: response.data})})
  }

  toggleStatus = (id, status) => {
    const { tasks } = this.state;
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");

    if (status === 'todo') {
      status = 'done';
    } else {
      status = 'todo';
    }

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
        const copiedTasks = tasks.map(task => {
          if (task.id === response.data.id) {
            return response.data;
          } else {
            return task;
          }
        }); 
        this.setState({tasks: copiedTasks});
      })
  }

  removeTask = (id) => {
    const { tasks } = this.state;
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content");

    fetch(`/api/v1/tasks/${id}`, {
      method: "DELETE",
      headers: {"X-CSRF-Token": csrf}
    })
      .then(response => response.json())
      .then(response => {
        this.setState({
          tasks: tasks.filter((task) => {
            return task.id !== response.data.id;
          })
        })
      })
  }

  render() {
    const { tasks } = this.state;

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
        <div className='main-box'>
          {taskComponents}
        </div>
      </main>
    );
  }
}

export default Main;

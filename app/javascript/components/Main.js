import React from 'react';
import Task from './Task';

class Main extends React.Component {
  state = {
    data: []
  }

  componentDidMount() {
    fetch('/api/v1/tasks')
      .then(response => response.json())
      .then(response => {this.setState({data: response.data})})
  }

  toggleStatus = (id, status) => {
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
        const dataCopy = this.state.data.slice().map(e => {
          if (e.id === id) {
            return response.data;
          } else {
            return e;
          }
        }); 
        this.setState({data: dataCopy});
      })
  }

  render() {
    const { data } = this.state;

    const tasks = data.map((item) => {
      return <Task
               key={item.id}
               id={item.id}
               name={item.name}
               status={item.status}
               due_on={item.due_on}
               created_at={item.created_at}
               toggleStatus={this.toggleStatus} />
    });

    return(
      <main className='main'>
        <div className='main-box'>
          {tasks}
        </div>
      </main>
    );
  }
}

export default Main;

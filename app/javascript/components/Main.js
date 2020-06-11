import React from 'react';
import PropTypes from 'prop-types';
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

  render() {
    const { data } = this.state;

    const tasks = data.map((item) => {
      return <Task
               key={item.id}
               name={item.name}
               status={item.status}
               due_on={item.due_on}
               created_at={item.created_at} />
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

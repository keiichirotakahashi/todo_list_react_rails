import React from 'react';

class Task extends React.Component {
  translateStatus = (status) => {
    switch (status) {
      case 'todo':
        return '未完了';
      case 'done':
        return '完了';
    }
  }

  render() {
    const id = this.props.id;
    const name = this.props.name;
    const dueOn = new Date(this.props.due_on.replace(/-/g, '/'));
    const dueDate = `${dueOn.getFullYear()}年${dueOn.getMonth() + 1}月${dueOn.getDate()}日`;
    const createdAt = new Date(this.props.created_at);
    const createdDate = `${createdAt.getFullYear()}年${createdAt.getMonth() + 1}月${createdAt.getDate()}日`;
    const status = this.props.status;
    const translatedStatus = this.translateStatus(this.props.status);

    return(
      <div className='task'>
        <h2 className='task__name'>
          {name}
        </h2>
        <div className='task-body'>
          <div className='task-body-info'>
            <div className='task-body-info-due-date'>
              <div className='task-body-info-due-date__label'>
                期限：
              </div>
              <div className='task-body-info-due-date__value'>
                {dueDate}
              </div>
            </div>
            <div className='task-body-info-created-date'>
              <div className='task-body-info-created-date__label'>
                作成日：
              </div>
              <div className='task-body-info-created-date__value'>
                {createdDate}
              </div>
            </div>
          </div>
          <div className='task-body-buttons'>
            <div className='task-body-buttons-top'>
              <button className={`task-body-buttons-top__status--${status}`}
                      onClick={() => {this.props.toggleStatus(id, status)}}>
                {translatedStatus}
              </button>
            </div>
            <div className='task-body-buttons-bottom'>
              <button className='task-body-buttons-bottom__edit'>
                編集
              </button>
              <button className='task-body-buttons-bottom__delete'
                      onClick={() => {this.props.removeTask(id)}}>
                削除
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Task;

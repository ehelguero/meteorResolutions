import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks';

export default class Task extends Component {
  // function to check resolutions
  toggleChecked() {
      // use api to update them and mark as the oposite of checked
      Meteor.call('tasks.update', this.props.task._id, !this.props.task.checked)
  }

  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }

  render() {
    const taskClassName = this.props.task.checked ? 'checked' : '';

    return (
      <li className={taskClassName}>
        <button className='btn btn-default delete' onClick={this.deleteThisTask.bind(this)} >&times;</button>
        <input type="checkbox"
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked.bind(this)}
        />
      {this.props.task.text} - {this.props.task.username}
      </li>
    );
  }
}

Task.propTypes = {
  task: PropTypes.object.isRequired
};

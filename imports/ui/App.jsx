import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper';

class App extends Component {
  constructor(props){
      super(props)

      this.state = {
        hideCompleted: false
      };
  }

  handleSubmit(event) {
      event.preventDefault();
      const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

      Tasks.insert({
        text,
        createdAt: new Date(),
        owner: Meteor.userId(),
        username: Meteor.user().username,
      });

      ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTask() {
    let filteredTasks = this.props.tasks;
    if(this.state.hideCompleted){
      filteredTasks = filteredTasks.filter( task => !task.checked );
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  toggleHideCompleted(){
    this.setState({ hideCompleted: !this.state.hideCompleted })
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List {this.props.incompleteCount}</h1>
          <label className="hide-completed">
            <input type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
          Hide completed task
          </label>
          <AccountsUIWrapper />
          {this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                className="form-control"
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
          </form> : ''
          }
        </header>

        <div className="row">
          <div className="col-md-12">
            <ul>
              {this.renderTask()}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
}

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, {sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App)

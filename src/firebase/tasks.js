'use strict';

const firebase = require('../../lib/_firebase');

const firebaseRef = firebase.database().ref();

const createTaskObject = function(task) {
  return {
    id: task.id || undefined,
    path: task.path || undefined,
    subtasksCount: task.subtasksCount || 0,
    completedSubtasksCount: task.completedSubtasksCount || 0,
    totalSubtasksCount: task.totalSubtasksCount || 0,
    totalCompletedSubtasksCount: task.totalCompletedSubtasksCount || 0,
    isCompleted: task.isCompleted || false
  };
};

const sumCountProperty = function(workspaceId, pathArr, property1, property2) {
  let sumPromises = pathArr.map((taskId) => (
    firebaseRef.child(`tasks/${workspaceId}/${taskId}`).transaction((task) => {
      if (task) {
        task[property1]++;
        task[property2]++;

        return task;
      } else {
        return {
          [property1]: 1,
          [property2]: 1
        };
      }
    })
  ));

  return Promise.all(sumPromises);
};

const addTask = function(payload) {
  const workspaceId = firebaseRef.child(`tasks`).push().key;
  payload.id = workspaceId;
  payload.path = workspaceId;
  
  const path = `tasks/${workspaceId}/${workspaceId}`;

  firebaseRef.child(path).set(payload);

  return payload;
};

const addSubTask = function(parentTask, payload) {
	const pathArr = parentTask.path.split('|');
	const workspaceId = pathArr[0];
	const taskId = firebaseRef.child(`tasks/${workspaceId}`).push().key;

	payload.path = `${parentTask.path}|${taskId}`;
  payload.id = taskId;
  payload.parentId = parentTask.id;
  payload.isCompleted = false;
  
  const path = `tasks/${workspaceId}/${taskId}`;
  
  return new Promise((resolve, reject) => {
    firebaseRef.child(path).set(payload)
      .then(() => {
        return sumCountProperty(workspaceId, pathArr, 'subtasksCount', 'totalSubtasksCount');
      })
      .then(resolve(payload))
      .catch(reject);
  });
};

const completeTask = function(task) {
	const pathArr = task.path.split('|'); 
	const workspaceId = pathArr[0];
	
	if (!task.isCompleted) {
		task.isCompleted = true;
	}

	const path = `tasks/${workspaceId}/${task.id}`;

  return new Promise((resolve, reject) => {
    firebaseRef.child(path).set(task)
      .then(() => {
        return sumCountProperty(workspaceId, pathArr, 'completedSubtasksCount', 'totalCompletedSubtasksCount');
      })
      .then(resolve(task))
      .catch(reject);
  });
};

const moveTask = function() {

};

const clearTasks = function() {
  return new Promise((resolve, reject) => {
    firebaseRef.child('tasks').set(null)
      .then(resolve)
      .catch(reject);
  });
};	

module.exports = {
  createTaskObject: createTaskObject,
	addTask: addTask,
	addSubTask: addSubTask,
	completeTask: completeTask,
	moveTask: moveTask,
	clearTasks: clearTasks
};
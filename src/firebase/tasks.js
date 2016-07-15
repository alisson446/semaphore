'use strict';

const firebase = require('../../lib/_firebase');

const firebaseRef = firebase.database().ref();

const sumeCountProperty = function(workspaceId, pathArr, property1, property2) {
	pathArr.forEach((taskId) => {
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
		});
	});
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
  
  firebaseRef.child(path).set(payload)
  	.then(() => {
  		sumeCountProperty(workspaceId, pathArr, 'subtasksCount', 'totalSubtasksCount');
  	});

  return payload;
};

const completeTask = function(task, taskIndexRandom) {
	const pathArr = task.path.split('|'); 
	const workspaceId = pathArr[0];
	
	if (!task.isCompleted) {
		task.isCompleted = true;
	}

	const path = `tasks/${workspaceId}/${task.id}`;

	firebaseRef.child(path).set(task)
  	.then(() => {
  		sumeCountProperty(workspaceId, pathArr, 'completedSubtasksCount', 'totalCompletedSubtasksCount');
  	});

  return task;
};

const moveTask = function() {

};

const clearTasks = function() {
  firebaseRef.child('tasks').set(null);
};	

module.exports = {
	addTask: addTask,
	addSubTask: addSubTask,
	completeTask: completeTask,
	moveTask: moveTask,
	clearTasks: clearTasks
};
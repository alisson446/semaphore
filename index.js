'use strict';

const addTask = require('./src/firebase/tasks').addTask;
const addSubTask = require('./src/firebase/tasks').addSubTask;
const completeTask = require('./src/firebase/tasks').completeTask;
const clearTasks = require('./src/firebase/tasks').clearTasks;

function createAndCompleteTasks() {
	clearTasks();
	let count = 1;
	let tasksArr = [];

	const payload = {
		id: undefined,
	  path: undefined,
	  subtasksCount: 0,
	  completedSubtasksCount: 0,
	  totalSubtasksCount: 0,
	  totalCompletedSubtasksCount: 0,
	  isCompleted: false
	};

	tasksArr.push(addTask(payload));

	const interval = setInterval(() => {
		if(count == 5) {
			clearInterval(interval);
		}
		
		const taskIndexRandom = Math.floor(Math.random() * tasksArr.length);
		const taskSelected = tasksArr[taskIndexRandom];

		tasksArr.push(addSubTask(taskSelected, payload));
		tasksArr.push(completeTask(taskSelected, taskIndexRandom));

		count++;
	}, 1000);
};

createAndCompleteTasks();

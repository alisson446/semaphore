'use strict';

const createTaskObject = require('./src/firebase/tasks').createTaskObject;
const addTask = require('./src/firebase/tasks').addTask;
const addSubTask = require('./src/firebase/tasks').addSubTask;
const completeTask = require('./src/firebase/tasks').completeTask;
const clearTasks = require('./src/firebase/tasks').clearTasks;

function createAndCompleteTasks() {
	clearTasks()
		.then(() => {
			let count = 1;
			let tasksArr = [];
			const taskObject = createTaskObject();

			tasksArr.push(addTask(taskObject));

			const interval = setInterval(() => {
				if(count == 5) {
					clearInterval(interval);
				}
				
				const randomTaskIndex = Math.floor(Math.random() * tasksArr.length);
				const selectedTask = tasksArr[randomTaskIndex];

				addSubTask(selectedTask, taskObject)
					.then((payload) => {
						tasksArr.push(payload);
						return completeTask(selectedTask);
					})
					.catch((error) => console.log(error));

				count++;
			}, 1000);
		});
};

createAndCompleteTasks();

class Task {
    constructor(id, arr) {
        this.id = id;
        this.task = arr[1];
        this.priority = arr[0];
        this.date = arr[2];
        this.time = arr[3];
    }
}

class UI {
    constructor() { }

    getinput() {
        const taskInput = document.querySelector('#task-title');

        if (taskInput.value) {
            var newTask = [
                document.querySelector('#priority').value,
                taskInput.value,
                document.querySelector('#date').value,
                document.querySelector('#time').value
            ]
        } else {
            return 'Input a value';
        };

        return newTask;
    }

    displayTasks(arr) {
        let tasksContainer = document.querySelector('.tasks');
        let tasks = document.querySelectorAll('.tasks > *');

        tasks.forEach(task => {
            task.remove();
        })

        arr.forEach(obj => {
            let task = document.createElement('div');
            task.classList.add('task');

            let taskPriority = document.createElement('div');
            taskPriority.classList.add('task-priority');
            taskPriority.classList.add(obj.priority);
            task.appendChild(taskPriority);

            let taskLeft = document.createElement('div');
            taskLeft.classList.add('task-left');
            task.appendChild(taskLeft);

            let taskDesc = document.createElement('div');
            taskDesc.classList.add('task-desc');
            taskLeft.appendChild(taskDesc);

            let taskTitle = document.createElement('h3');
            taskTitle.classList.add('task-title');
            taskTitle.innerText = obj.task;
            taskDesc.appendChild(taskTitle);

            let taskRight = document.createElement('div');
            taskRight.classList.add('task-right');
            task.appendChild(taskRight);

            let taskDeadline = document.createElement('h4');
            taskDeadline.classList.add('task-deadline');
            taskDeadline.classList.add('tool-tip-parent');
            taskDeadline.innerText = 'work in progress';
            taskRight.appendChild(taskDeadline);

            let taskDone = document.createElement('a');
            taskDone.classList.add('task-done');
            taskDone.setAttribute('id', 'btn-done');
            taskDone.setAttribute('data-id', obj.id);
            taskRight.appendChild(taskDone);

            let taskCM = document.createElement('img');
            taskCM.classList.add('checkmark');
            taskCM.setAttribute('src', 'assets/img/check-mark-svgrepo-com.svg');
            taskDone.appendChild(taskCM);

            tasksContainer.appendChild(task);
        });
    }
}

class Data {
    static getTasks() {
        return JSON.parse(localStorage.getItem('taskList'));
    }

    static storeTask(arr) {
        let id, task;
        let taskList = this.getTasks();

        id = 0;
        if (taskList.length != 0) {
            id = taskList[taskList.length - 1].id + 1;
        }

        task = new Task(id, arr)
        taskList.push(task);

        localStorage.setItem('taskList', JSON.stringify(taskList))
    }

    static removeTask(id) {
        let taskList = this.getTasks();

        // taskList.forEach(task => {
        //     if (id === task.id) {
        //         taskList.splice(task, 1);
        //     }
        // });

        for (let i = 0; i < taskList.length; i++) {
            if (id == taskList[i].id) {
                taskList.splice(i, 1);
            };
        }

        localStorage.setItem('taskList', JSON.stringify(taskList));
    }
}

class Controller {
    static initializeApp() {
        document.querySelector('#submit').addEventListener('click', this.addTask)
        document.querySelector('.add-task').addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                this.addTask()
            }
        })
        document.querySelector('.tasks').addEventListener('click', e => this.deleteTask(e))

        if (localStorage.getItem('taskList') === null) {
            var taskList = JSON.stringify([])
            localStorage.setItem('taskList', taskList)
        }

        if (localStorage.getItem('taskList') !== null) {
            this.displayTasks()
        }
    }

    static addTask() {
        let ui = new UI;
        let newTask = ui.getinput()
        // ui.clearInput();
        Data.storeTask(newTask)

        this.displayTasks();
    }

    static displayTasks() {
        let ui = new UI;
        let tasklist = Data.getTasks();
        ui.displayTasks(tasklist)
    }

    static startTime() {

        time = dataCtrl.getTime();
        uiCtrl.updateTime(time);

        setTimeout(startTime, 1000)
    }

    static deleteTask(e) {
        let id;

        if (e.target.matches('.checkmark')) {
            id = e.target.parentElement.getAttribute('data-id');
        }
        if (e.target.matches('#btn-done')) {
            id = e.target.getAttribute('data-id');
        }
        Data.removeTask(id);
        this.displayTasks()

    }
}

Controller.initializeApp()
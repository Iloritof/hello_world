class Task {
    constructor(obj) {
        this.id = obj.id;
        this.task = obj.task;
        this.priority = obj.priority;
        this.date = obj.date;
        this.time = obj.time;
    }

    remainingTime() {
        const present = new Date();
        const deadline = new Date(`${this.date} ${this.time}`)

        if (present < deadline) {
            const diff = Math.max(present, deadline) - Math.min(present, deadline)
            const SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN, DAY = 24 * HRS;

            const days = Math.floor(diff / DAY)
            const hrs = Math.floor((diff % DAY) / HRS).toLocaleString('en-US', { minimumIntegerDigits: 2 })
            const min = Math.floor((diff % HRS) / MIN).toLocaleString('en-US', { minimumIntegerDigits: 2 })
            const sec = Math.floor((diff % MIN) / SEC).toLocaleString('en-US', { minimumIntegerDigits: 2 })
            const ms = Math.floor(diff % SEC).toLocaleString('en-US', { minimumIntegerDigits: 4, useGrouping: false })

            if (days > 0)
                return `${days} days, ${hrs}hrs, ${min} min`;
            else
                return `${hrs}hrs, ${min} min`;
        }
        else
            return `Time's Up!!!`
    }
}

class UI {

    getinput() {
        const taskInput = document.querySelector('#task-title');
        let newTask, feedback;

        if (taskInput.value) {
            newTask = {
                id: '',
                task: taskInput.value,
                priority: document.querySelector('#priority').value,
                date: document.querySelector('#date').value,
                time: document.querySelector('#time').value,
            };
            feedback = [true];
        } else {
            newTask = null
            feedback = [false, 'Please, Enter a task title!'];
        };
        return [newTask, feedback];
    }

    displayTasks(tasklist) {
        const tasksContainer = document.querySelector('.tasks');
        const tasks = document.querySelectorAll('.tasks > *');

        tasks.forEach(task => {
            task.remove();
        })

        tasklist.forEach(singleTask => {
            const obj = new Task(singleTask);

            const task = document.createElement('div');
            task.classList.add('task');

            const taskPriority = document.createElement('div');
            taskPriority.classList.add('task-priority');
            taskPriority.classList.add(obj.priority);
            task.appendChild(taskPriority);

            const taskLeft = document.createElement('div');
            taskLeft.classList.add('task-left');
            task.appendChild(taskLeft);

            const taskDesc = document.createElement('div');
            taskDesc.classList.add('task-desc');
            taskLeft.appendChild(taskDesc);

            const taskTitle = document.createElement('h3');
            taskTitle.classList.add('task-title');
            taskTitle.innerText = obj.task;
            taskDesc.appendChild(taskTitle);

            const taskRight = document.createElement('div');
            taskRight.classList.add('task-right');
            task.appendChild(taskRight);

            const taskDeadline = document.createElement('h4');
            taskDeadline.classList.add('task-deadline');
            taskDeadline.classList.add('tool-tip-parent');
            if (obj.date !== '') {
                taskDeadline.innerText = new Date(obj.date).toDateString();
                const toolTip = document.createElement('p');
                toolTip.classList.add('tool-tip');
                toolTip.innerText = obj.remainingTime()
                taskDeadline.appendChild(toolTip);
            }
            if (obj.date === '')
                taskDeadline.innerText = `No Deadline Set`
            taskRight.appendChild(taskDeadline);

            const taskDone = document.createElement('a');
            taskDone.classList.add('task-done');
            taskDone.setAttribute('id', 'btn-done');
            taskDone.setAttribute('data-id', obj.id);
            taskRight.appendChild(taskDone);

            const taskCM = document.createElement('img');
            taskCM.classList.add('checkmark');
            taskCM.setAttribute('src', 'assets/img/check-mark-svgrepo-com.svg');
            taskDone.appendChild(taskCM);

            tasksContainer.appendChild(task);
        });
    }

    clearValues() {
        const inputFields = document.querySelectorAll('.input')

        for (let i = 1; i < inputFields.length; i++) {
            inputFields[i].value = '';
        }

        inputFields[0].value = 'default';
    }

    notify(success, message) {
        let tNotify;
        if (document.querySelector('.notice')) {
            tNotify = '';
            this.clearNotify()
        }
        const notification = document.createElement('div');
        notification.classList.add('notice')
        const notificationText = document.createElement('p');
        notificationText.classList.add('notice-text')
        notification.appendChild(notificationText)
        const notificationButton = document.createElement('a')
        notificationButton.classList.add('notice-close')
        notificationButton.innerText = `x`
        notification.appendChild(notificationButton)
        if (success) {
            notification.classList.add('success-notice');
            notificationText.innerText = message;
            notification.classList.add('show-notice');
        }
        if (!success) {
            notification.classList.add('error-notice');
            notificationText.innerText = message;
            notification.classList.add('show-notice');
        }
        document.querySelector('.section-bottom').prepend((notification));

        tNotify = setTimeout(this.clearNotify, 3000)
    }

    clearNotify(el) {
        if (el)
            el.parentElement.remove();
        if (!el)
            if (document.querySelector('.notice'))
                document.querySelector('.notice').remove()
    }

    static timeUI(today) {
        document.querySelector('.current-date').innerText = today.toDateString();
        document.querySelector('.current-time').innerText = today.toLocaleTimeString();
    };
}

class Data {
    static getTasks() {
        return JSON.parse(localStorage.getItem('taskList'));
    }

    // static getSettings() {
    //     return JSON.parse(localStorage.getItem('setting'));
    // }

    static storeTask(task) {
        let id;
        const taskList = this.getTasks();

        id = 0;
        if (taskList.length != 0) {
            id = taskList[taskList.length - 1].id + 1;
        }

        task.id = id
        taskList.push(task);

        localStorage.setItem('taskList', JSON.stringify(taskList))
    }

    static removeTask(id) {
        const taskList = this.getTasks();

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

    static getTime() {
        const today = new Date();
        return today;
    }
}

class Controller {
    static initializeApp() {
        this.startTime()
        const self = this
        document.querySelector('#submit').addEventListener('click', this.addTask)
        document.querySelector('.add-task').addEventListener('keypress', (e) => {
            if (e.keyCode === 13) {
                this.addTask()
            }
        })
        document.querySelector('.tasks').addEventListener('click', e => this.deleteTask(e))
        document.querySelector('.section-bottom').addEventListener('click', e => this.removeNotice(e))

        if (localStorage.getItem('taskList') === null) {
            var taskList = JSON.stringify([])
            localStorage.setItem('taskList', taskList)
        }

        if (localStorage.getItem('taskList') !== null) {
            this.displayTasks();
        }
    };

    static addTask() {
        const ui = new UI;
        const newTask = ui.getinput();
        ui.clearValues();

        if (newTask[1][0]) {
            Data.storeTask(newTask[0]);
            Controller.displayTasks();
            ui.notify(newTask[1][0], 'Tasks was added successfully!');
        }
        if (!newTask[1][0]) {
            ui.notify(newTask[1][0], newTask[1][1]);
        }
    };

    static displayTasks() {
        const ui = new UI;
        const tasklist = Data.getTasks();
        ui.displayTasks(tasklist)
    };

    static startTime() {
        const today = Data.getTime();
        UI.timeUI(today);
        setInterval(this.startTime, 1000)
    };

    static deleteTask(e) {
        let id;
        const ui = new UI;

        if (e.target.matches('.checkmark')) {
            id = e.target.parentElement.getAttribute('data-id');
            Data.removeTask(id);
            ui.notify(true, 'Task was deleted successfully!')
        }
        if (e.target.matches('#btn-done')) {
            id = e.target.getAttribute('data-id');
            Data.removeTask(id);
            ui.notify(true, 'Task was deleted successfully!')
        }
        this.displayTasks()
    };

    static removeNotice(e) {
        const ui = new UI;
        if (e.target.matches('.notice-close'))
            ui.clearNotify(e.target)
    }
}

Controller.initializeApp()
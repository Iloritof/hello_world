const dataController = (function() {

    return {
        getTime: function() {
            const today = new Date();
    
            return {
                seconds: today.getSeconds(),
                minutes: today.getMinutes(),
                hours: today.getHours(),
                day: today.getDate(),
                dayWeek: today.getDay(),
                dayName: function() {
                    var dayName;
                    switch (this.dayWeek) {
                        case 0: dayName = 'Sunday'; break;
                        case 1: dayName = 'Monday'; break;
                        case 2: dayName = 'Tuesday'; break;
                        case 3: dayName = 'Wednesday'; break;
                        case 4: dayName = 'Thursday'; break;
                        case 5: dayName = 'Friday'; break;
                        case 6: dayName = 'Satursday'; break;
                    }
    
                    return dayName;
                },
                month: today.getMonth(),
                monthName: function() {
                    switch (this.month) {
                        case 0: currMonth = 'January'; break;
                        case 1: currMonth = 'February'; break;
                        case 2: currMonth = 'March'; break;
                        case 3: currMonth = 'April'; break;
                        case 4: currMonth = 'May'; break;
                        case 5: currMonth = 'June'; break;
                        case 6: currMonth = 'July'; break;
                        case 7: currMonth = 'August'; break;
                        case 8: currMonth = 'September'; break;
                        case 9: currMonth = 'October'; break;
                        case 10: currMonth = 'November'; break;
                        case 11: currMonth = 'December'; break;
                        default: currMonth = null; break;
                    }
    
                    return currMonth;
                },
                year: today.getFullYear(),
            }
        },
    }
})();

const uiController = (function() {
    
    domStrings = {
        inputPriority: '#priority',
        inputTask: '#task-title',
        inputDate: '#date',
        inputTime: '#time',
        inputSubmit: '#submit',
        uiTime: '.current-time',
        uiSecond: '.current-seconds',
        uiDate: '.current-date'
    }

    timeUI = function(obj) {
        var displayHours, session, displayMinutes, displaySeconds;

        displayHours = obj.hours;
        session = 'AM';
        if (displayHours > 12) {
            displayHours = displayHours - 12;
            session = 'PM';
        }

        displayMinutes = obj.minutes;
        displaySeconds = obj.seconds;
        if (obj.minutes < 10) {
            displayMinutes = '0' + obj.minutes
        }
        if (obj.seconds < 10) {
            displaySeconds = '0' + obj.seconds
        }

        displaySeconds = displaySeconds + ' ' + session;
        displayTime = displayHours + ':' + displayMinutes;
        displayDate = obj.dayName() + ', ' + obj.monthName() + ' ' + obj.day + ', ' + obj.year;

        document.querySelector(domStrings.uiDate).innerText = displayDate;
        document.querySelector(domStrings.uiTime).innerText = displayTime;
        document.querySelector(domStrings.uiSecond).innerText = displaySeconds;
    }

    function input() {
        
    }
    
    return {
        strings: domStrings,

        getInput: function() {
            return {
                priority: document.querySelector(domStrings.inputPriority).value,
                task: document.querySelector(domStrings.inputTask).value,
                date: document.querySelector(domStrings.inputDate).value,
                time: document.querySelector(domStrings.inputTime).value
            }
        },

        updateTime: function(obj) {
            timeUI(obj);
        }
    };
})();

const controller = (function(uiCtrl, dataCtrl) {
    
    function addNewTask() {
        //get input
        console.log(uiCtrl.getInput());
        //store input
        

        //update UI
    }

    function startTime() {
        
        time = dataCtrl.getTime();
        uiCtrl.updateTime(time);

        setTimeout(startTime, 1000)
    }

    document.onload = startTime()
    document.querySelector(uiCtrl.strings.inputSubmit).addEventListener('click', addNewTask);
})(uiController, dataController);
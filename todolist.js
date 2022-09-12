const inputTask = document.querySelector("#input-task");
const addBtn = document.querySelector("#add-btn");
const taskList = document.querySelector("#main-list");
const checkBtn = document.getElementsByClassName("check-btn");
const trashBtn = document.getElementsByClassName("trash-btn");
const filter = document.getElementById("filter-tasks");

// Event Listeners
document.addEventListener("DOMContentLoaded", getTasksStorage);
addBtn.addEventListener("click", addTask);
filter.addEventListener("change", filterTask);

// Funtions
// Create Task Divs
function createTaskDivs(taskValue, taskClass="incomplete"){
    console.log("you are in createTaskDivs");
    // Creating a new container with class task-container for a new task
    let newTaskCont = document.createElement("div");
    newTaskCont.classList.add("task-container");
    newTaskCont.classList.add(taskClass);
    // Creating an li element with class task inside th above div element and assigning it value from input tag
    let newTask = document.createElement("li");
    newTask.classList.add("task");
    newTask.innerText = taskValue;
    newTaskCont.appendChild(newTask);
    // Adding check button to this div
    let checkBtn = document.createElement("button");
    checkBtn.classList.add("complete-btn");
    checkBtn.innerHTML = "<i class='fa-solid fa-check'></i>";
    newTaskCont.appendChild(checkBtn);
    // Adding delete button to this div
    let delBtn = document.createElement("button");
    delBtn.classList.add("trash-btn");
    delBtn.innerHTML = "<i class='fa-solid fa-trash'></i>";
    newTaskCont.appendChild(delBtn);
    // Adding this now ready div to main list ul
    taskList.appendChild(newTaskCont);
    delBtn.addEventListener("click", deleteTask);
    checkBtn.addEventListener("click", checkComplete);
}

// to add a task
function addTask(event){
    event.preventDefault();
    console.log("you are in addTask");
    createTaskDivs(inputTask.value);
    saveTasksStorage(inputTask.value);
    // Clearing Input tag value
    inputTask.value = "";
}

// Funtion to delete tasks
function deleteTask(e){
    let taskDiv = e.target.parentElement;
    taskDiv.classList.add("fall");
    removeTasksStorage(taskDiv);
    taskDiv.addEventListener("transitionend", function(){
        taskDiv.remove();
    })
}

// Function to check the tasks as completed
function checkComplete(e){
    let item = e.target;
    let tasks = JSON.parse(localStorage.getItem("tasks"));;
    item.parentElement.classList.toggle("completed");
    for (let task of tasks){
        if((item.previousElementSibling.innerHTML === task["task"])&&(task["status"] === "incomplete")){
            task["status"] = "completed";
        }
        else if((item.previousElementSibling.innerHTML === task["task"])&&(task["status"] === "completed")){
            task["status"] = "incomplete";
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// Function to filter tasks
function filterTask(e){
    let filterValue = e.target.value;
    let myTasks = taskList.childNodes;
    myTasks.forEach(myTask =>{
        switch (filterValue){
            case "all":
                myTask.style.display = "flex";
                break
            case "completed":
                if (myTask.classList.contains("completed")){
                    myTask.style.display = "flex";
                }else{
                    myTask.style.display = "none";
                }
                break
            case "incomplete":
                if (!myTask.classList.contains("completed")){
                    myTask.style.display = "flex";
                }else{
                    myTask.style.display = "none";
                }
                break
        }
    })
}

// Function to store tasks in localStorage
function saveTasksStorage(task){
    console.log("you are in saveTasksStorage");
    let tasks;
    if(localStorage.getItem("tasks") === null){
        tasks = [];
    }
    else{
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    // tasks.push(task);
    // New Method
    let myDivs = taskList.children;
    Array.from(myDivs).forEach(myDiv =>{
        // console.log(myDiv.children[0].innerHTML);
        if(myDiv.children[0].innerHTML === task){
            if(myDiv.classList.contains("completed")){
                tasks.push({"task":task, "status": "completed"});
            }
            else{
                tasks.push({"task":task, "status": "incomplete"});
            }
        }
    })
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to delete tasks in localStorage
function removeTasksStorage(taskDiv){
    let tasks;
    let copy = [];
    if(localStorage.getItem("tasks") === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    let task = taskDiv.childNodes[0].innerText;
    Array.from(tasks).forEach(myTask =>{
        if (myTask["task"] !== task){
            copy.push(myTask);
        }
    })
    tasks = copy;
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

// To get Tasks on DOMContentLoaded
function getTasksStorage(){
    console.log("you are in getTasksStorage");
    let tasks;
    if(localStorage.getItem("tasks") === null){
        tasks = [];
    }else{
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }
    tasks.forEach(task =>{
        createTaskDivs(task["task"],task["status"]);
    })
}
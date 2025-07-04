const createButton = document.querySelector("#create-button")
const todoListContainer = document.querySelector("#todo-list-container")

createButton.addEventListener("click", function() {
    // console.log("clicked!") -- Debug
    const numberOfTodoLists = todoListContainer.children.length;
    if (numberOfTodoLists >= 4) {
        alert("Can't have more than 4 todo lists!");
        return;
    }

    const listTemplate = document.getElementById("todo-list-template");
    const listTemplateClone = listTemplate.content.cloneNode(true);

    if (!todoListContainer.classList.contains("container-with-frame")) {
        todoListContainer.classList.add("container-with-frame");
    }

    const background = listTemplateClone.querySelector(".todo-list-frame");
    // console.log(background)

    const deleteButton = background.querySelector(".container .delete-list-button");

    deleteButton.addEventListener("click", function() {
        deleteButton.parentElement.parentElement.remove();
        const numberOfTodoLists = todoListContainer.children.length;
        if (numberOfTodoLists <= 0) {
            if (todoListContainer.classList.contains("container-with-frame")) {
                todoListContainer.classList.remove("container-with-frame");
            }
        }
    })

    const addButton = background.querySelector(".container .add-task-button");

    addButton.addEventListener("click", function() {
        const taskTemplate = document.getElementById("task-template");
        const taskTemplateClone = taskTemplate.content.cloneNode(true);

        const tasksContainer = addButton.parentElement.parentElement.querySelector(".tasks-container");

        const deleteTaskButton = taskTemplateClone.querySelector(".task-div .task-delete-button-container .delete-task-button")

        deleteTaskButton.addEventListener("click", function() {
            deleteTaskButton.parentElement.parentElement.remove()
        })

        tasksContainer.append(taskTemplateClone)
    })

    todoListContainer.append(listTemplateClone);
})


const createButton = document.querySelector("#create-button")
const todoListContainer = document.querySelector("#todo-list-container")

createButton.addEventListener("click", function() {
    // console.log("clicked!") -- Debug
    const numberOfTodoLists = todoListContainer.children.length;
    if (numberOfTodoLists >= 4) {
        alert("Can't have more than 4 todo lists!");
        return;
    }
    const frame = document.createElement("div");
    todoListContainer.append(frame);
    todoListContainer.classList.add("container-with-frame");
    frame.classList.add("todo-list-frame");
})


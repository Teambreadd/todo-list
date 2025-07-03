const createButton = document.querySelector("#create-button")
const todoListContainer = document.querySelector("#todo-list-container")

createButton.addEventListener("click", function() {
    // console.log("clicked!") -- Debug
    const numberOfTodoLists = todoListContainer.children.length;
    if (numberOfTodoLists >= 4) {
        alert("Can't have more than 4 todo lists!");
        return;
    }

    const template = document.getElementById("todo-list-template");
    const clone = template.content.cloneNode(true);

    todoListContainer.append(clone);
    if (!todoListContainer.classList.contains("container-with-frame")) {
        todoListContainer.classList.add("container-with-frame");
    }
})


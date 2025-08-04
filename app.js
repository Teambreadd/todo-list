const createButton = document.querySelector("#create-button")
const todoListContainer = document.querySelector("#to-do-list-container")
const listTemplate = document.getElementById("to-do-list-template");
const taskTemplate = document.getElementById("task-template");


// Saves all to-do lists in browser to localStorage
function saveTodoListsToLocalStorage() {
    const allLists = [];

    const listFrames = document.querySelectorAll(".to-do-list-frame");

    listFrames.forEach((frame) => {
        const titleEl = frame.querySelector(".list-title");
        const tasksEls = frame.querySelectorAll(".task-div");

        const list = {
            title: titleEl.innerText,
            tasks: []
        };

        tasksEls.forEach((taskEl) => {
            const taskTextEl = taskEl.querySelector(".task-text");
            list.tasks.push(taskTextEl.innerText);
        });

        allLists.push(list);
    });

    localStorage.setItem("todoLists", JSON.stringify(allLists));
}

// Loads saved to-do lists if there are any
function loadTodoListsFromLocalStorage() {
    const data = localStorage.getItem("todoLists");
    if (!data) return;

    const allLists = JSON.parse(data);
    allLists.forEach((list) => {
        createTodoListFromData(list);
    });
}

// Creates to-do list from saved data
function createTodoListFromData(listData) {
    const listTemplateClone = listTemplate.content.cloneNode(true);
    const background = listTemplateClone.querySelector(".to-do-list-frame");

    const titleEl = background.querySelector(".list-title");
    titleEl.innerText = listData.title;

    const addButton = background.querySelector(".add-task-button");
    const tasksContainer = background.querySelector(".tasks-container");


    listData.tasks.forEach(taskText => {
        const taskTemplateClone = taskTemplate.content.cloneNode(true);
        const taskTextEl = taskTemplateClone.querySelector(".task-text");
        taskTextEl.innerText = taskText;

        const deleteTaskButton = taskTemplateClone.querySelector(".delete-task-button");
        deleteTaskButton.addEventListener("click", () => {
            deleteTaskButton.parentElement.parentElement.remove();
        });

        tasksContainer.appendChild(taskTemplateClone);
    });

    setupListButtons(background)

    if (!todoListContainer.classList.contains("container-with-frame")) {
        todoListContainer.classList.add("container-with-frame");
    }

    createButton.classList.add("stuck");

    todoListContainer.appendChild(listTemplateClone);
}

function setupListButtons(background) {
    const deleteButton = background.querySelector(".container .delete-list-button");

    deleteButton.addEventListener("click", () => {
        deleteButton.parentElement.parentElement.remove();
        const numberOfTodoLists = todoListContainer.children.length;
        if (numberOfTodoLists <= 0) {
            if (todoListContainer.classList.contains("container-with-frame")) {
                todoListContainer.classList.remove("container-with-frame");
                createButton.classList.remove("stuck");
            }
        }
        saveTodoListsToLocalStorage();
    })

    const addButton = background.querySelector(".container .add-task-button");

    addButton.addEventListener("click", () => {
        const taskTemplateClone = taskTemplate.content.cloneNode(true);

        const tasksContainer = addButton.parentElement.parentElement.querySelector(".tasks-container");

        const deleteTaskButton = taskTemplateClone.querySelector(".task-div .task-delete-button-container .delete-task-button");

        deleteTaskButton.addEventListener("click", function () {
            deleteTaskButton.parentElement.parentElement.remove();
        })

        tasksContainer.append(taskTemplateClone);

        saveTodoListsToLocalStorage();
    })
}


createButton.addEventListener("click", () => {
    // console.log("clicked!") -- Debug
    const numberOfTodoLists = todoListContainer.children.length;
    if (numberOfTodoLists >= 4) {
        alert("Can't have more than 4 todo lists!");
        return;
    }

    createButton.classList.add("stuck");

    const listTemplateClone = listTemplate.content.cloneNode(true);

    if (!todoListContainer.classList.contains("container-with-frame")) {
        todoListContainer.classList.add("container-with-frame");
    }

    const background = listTemplateClone.querySelector(".to-do-list-frame");

    setupListButtons(background)

    // console.log(background)

    todoListContainer.append(listTemplateClone);

    saveTodoListsToLocalStorage();
})

document.addEventListener('focusin', (event) => {
    if (event.target.isContentEditable) {
        const element = event.target
        const placeholderText = element.getAttribute("data-placeholder-text")
        if (!placeholderText) {
            // console.log("nil")
            return
        }

        if (placeholderText == element.innerText) {
            element.innerText = ""
        }
        // console.log("User focused a contenteditable element:"", event.target);
    }
});

document.addEventListener('focusout', (event) => {
    if (event.target.isContentEditable) {
        const element = event.target
        const placeholderText = element.getAttribute("data-placeholder-text")
        if (!placeholderText) {
            // console.log("nil")
            return
        }
        // console.log(element.innerText)
        if (element.innerText.trim() === "") {
            element.innerText = placeholderText
        }

         saveTodoListsToLocalStorage();

        // console.log("User focused a contenteditable element:"", event.target);
    }
});

// Track user key presses. To be used to check when user presses certain key combinations such as shift + enter for special functionality.
const keysPressed = new Set();

window.addEventListener("keydown", (event) => {
    keysPressed.add(event.key);
});

window.addEventListener("keyup", (event) => {
    keysPressed.delete(event.key);
});

// Big repeated block of code so I put into a function. Didn't use arrow function here because I think a traditional function is just more clear.
function shiftEnterFunctionality(event, element) {
    if (document.activeElement === element) {
        // console.log(keysPressed)
        if (keysPressed.has("Enter") && keysPressed.has("Shift")) {
            // console.log("enter and shift key pressed")
            const br = document.createElement("br");
            const zwsp = document.createTextNode("\u200B");

            const wrapper = document.createElement("span");
            wrapper.appendChild(br);
            wrapper.appendChild(zwsp);

            let selection = window.getSelection();
            let range = selection.getRangeAt(0);

            let container = range.commonAncestorContainer;
            if (container.nodeType === Node.TEXT_NODE) {
                container = container.parentNode;
            }

            if (container.closest("span")) {
                const outerSpan = container.closest("span");
                const afterSpanRange = document.createRange();
                afterSpanRange.setStartAfter(outerSpan);
                afterSpanRange.setEndAfter(outerSpan);
                range = afterSpanRange;
            }

            range.deleteContents();
            range.insertNode(wrapper);

            range.setStartAfter(wrapper);
            range.setEndAfter(wrapper);
            selection.removeAllRanges();
            selection.addRange(range);


            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (
                        (mutation.type === "childList" &&
                            [...mutation.removedNodes].includes(zwsp)) ||
                        (mutation.type === "characterData" && mutation.target === zwsp && zwsp.data === "")
                    ) {
                        wrapper.remove();
                        observer.disconnect();
                    }
                }
            });

            observer.observe(wrapper, {
                childList: true,
                subtree: true,
                characterData: true
            });



        } else if (event.key == "Enter") {
            element.blur();
        }
    }
}

// for editable elements that already exist when this script runs.
const editableElements = document.querySelectorAll(".editable")

for (const element of editableElements) {
    element.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            // console.log("Enter");
            event.preventDefault();
        }
    })

    element.addEventListener("keyup", (event) => {
        shiftEnterFunctionality(event, element);
    });
}

// A listener for future editable elements that may be added.
const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) {
                const nodes = node.querySelectorAll(".editable")
                if (nodes.length > 0) {
                    for (const element of nodes) {
                        // console.log("Element with editable class was added");

                        element.addEventListener("keydown", (event) => {
                            if (event.key == "Enter") {
                                // console.log("Enter");
                                event.preventDefault();
                            }
                        })

                        // Must be keyup otherwise the keysPressed Set will not update in time!
                        element.addEventListener("keyup", (event) => {
                            shiftEnterFunctionality(event, element);
                        });
                    }
                }
            }
        }
    }
});

// Initialise 
observer.observe(document.body, { childList: true, subtree: true });

// Load lists (if any)
loadTodoListsFromLocalStorage()



// Previous system - Didn't work out :c
// const observer = new IntersectionObserver(
//     (entries) => {
//         entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.classList.remove("stuck");
//         } else {
//             entry.target.classList.add("stuck");
//         }
//     });
//     },
//     {
//         threshold: 1.0
//     }
// );

// // Initialise
// observer.observe(createButton) 
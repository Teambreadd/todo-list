const createButton = document.querySelector("#create-button")
const todoListContainer = document.querySelector("#to-do-list-container")

createButton.addEventListener("click", () => {
    // console.log("clicked!") -- Debug
    const numberOfTodoLists = todoListContainer.children.length;
    if (numberOfTodoLists >= 4) {
        alert("Can't have more than 4 todo lists!");
        return;
    }

    createButton.classList.add("stuck");

    const listTemplate = document.getElementById("to-do-list-template");
    const listTemplateClone = listTemplate.content.cloneNode(true);

    if (!todoListContainer.classList.contains("container-with-frame")) {
        todoListContainer.classList.add("container-with-frame");
    }

    const background = listTemplateClone.querySelector(".to-do-list-frame");
    // console.log(background)

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
    })

    const addButton = background.querySelector(".container .add-task-button");

    addButton.addEventListener("click", () => {
        const taskTemplate = document.getElementById("task-template");
        const taskTemplateClone = taskTemplate.content.cloneNode(true);

        const tasksContainer = addButton.parentElement.parentElement.querySelector(".tasks-container");

        const deleteTaskButton = taskTemplateClone.querySelector(".task-div .task-delete-button-container .delete-task-button")

        deleteTaskButton.addEventListener("click", function () {
            deleteTaskButton.parentElement.parentElement.remove()
        })

        tasksContainer.append(taskTemplateClone)
    })

    todoListContainer.append(listTemplateClone);
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

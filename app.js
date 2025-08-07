// DOM Elements Variables
const createButton = document.querySelector("#create-button")
const todoListContainer = document.querySelector("#to-do-list-container")
const listTemplate = document.getElementById("to-do-list-template");
const taskTemplate = document.getElementById("task-template");
const MAX_NUM_OF_TODO_LISTS = 4;

// Saves all to-do lists in browser to localStorage
function saveTodoListsToLocalStorage() {
    // This creates an array that will store all user lists. 
    const allLists = [];

    // Gets every element of class .to-do-list-frame currently in the DOM
    const listFrames = document.querySelectorAll(".to-do-list-frame");

    // Loops through every element found with the class .to-do-list-frame
    listFrames.forEach((frame) => {
        // For every element found, get their title element and all task elements.
        const titleEl = frame.querySelector(".list-title");
        const tasksEls = frame.querySelectorAll(".task-div");

        // Creates an object to store the text from the title and all tasks.
        const list = {
            title: titleEl.innerText,
            tasks: []
        };

        // Loops though every task element found.
        tasksEls.forEach((taskEl) => {
            // For every task element found get the task text element inside the task element (task element here is the container, text is in task text element)
            const taskTextEl = taskEl.querySelector(".task-text");
            // Add the text of the task to the list.tasks array. so like basically: const list = {title: "title text", tasks: ["the text goes in here", "HELO"]}
            list.tasks.push(taskTextEl.innerText);
        });

        // Adds the list object created to the end of the allLists array. Will look something like this (when the first one is added): const allLists = [{title: "", tasks:["", ""]}]
        allLists.push(list);
    });
    // Now after looping through all the lists the allLists array should have all the lists created by the user.
    // allList is now turned into a string and saved in localStorage under the key/identifier "todoLists". This is how it is retrieved later.
    localStorage.setItem("todoLists", JSON.stringify(allLists));
}

// Loads saved to-do lists if there are any
function loadTodoListsFromLocalStorage() {
    // Checks if the user has saved data before loading. If not, then don't load anything.
    const data = localStorage.getItem("todoLists");
    if (!data) return;

    // JSON.parse turns the data from strings back into objects/arrays.
    const allLists = JSON.parse(data);
    // Calls the createTodoListFromData function for every list object in allList.
    allLists.forEach((list) => {
        createTodoListFromData(list);
    });
}

// Creates to-do list from saved data
function createTodoListFromData(listData) {
    // Clones the list.
    const listTemplateClone = listTemplate.content.cloneNode(true);
    const background = listTemplateClone.querySelector(".to-do-list-frame");

    // References and sets list title text based on saved data.
    const titleEl = background.querySelector(".list-title");
    titleEl.innerText = listData.title;

    const tasksContainer = background.querySelector(".tasks-container");

    // For every task in the tasks array in the listData, create a task element from template and set its text to the saved text string.
    listData.tasks.forEach(taskText => {
        const taskTemplateClone = taskTemplate.content.cloneNode(true);
        const taskTextEl = taskTemplateClone.querySelector(".task-text");
        taskTextEl.innerText = taskText;

        // Initalise deleteTaskButton behaviour
        const deleteTaskButton = taskTemplateClone.querySelector(".delete-task-button");
        deleteTaskButton.addEventListener("click", () => {
            deleteTaskButton.parentElement.parentElement.remove();
        });

        tasksContainer.appendChild(taskTemplateClone);
    });

    // Calls the function to set up the delete and add task button in the to-do list.
    setupListButtons(background)

    // Assigns the to-do list container class to the to-do list container, so it can properly fit the to-do lists inside.
    if (!todoListContainer.classList.contains("container-with-frame")) {
        todoListContainer.classList.add("container-with-frame");
    }

    // Sticks the create to-do list button to a fixed position at the bottom of the screen when there 1 or more to-do lists. Ensures it does not go out of view. 
    // This was added because users found having to scroll down to click the previously out of view create button frustrating. 
    createButton.classList.add("stuck");

    // Parents the to-do list as a child of the to-do list container
    todoListContainer.appendChild(listTemplateClone);
}

// Function to set up the click event listeners for the two list buttons delete list and add task.
function setupListButtons(background) {
    const deleteButton = background.querySelector(".container .delete-list-button");
    // When you click on the delete button, delete the list
    deleteButton.addEventListener("click", () => {
        deleteButton.parentElement.parentElement.remove();
        // Check if there are any to-do lists remaining in the container.
        const numberOfTodoLists = todoListContainer.children.length;
        // If there are none left, then collapse the spacing by removing the container class that gives the to-do list container space.
        if (numberOfTodoLists <= 0) {
            if (todoListContainer.classList.contains("container-with-frame")) {
                todoListContainer.classList.remove("container-with-frame");
                createButton.classList.remove("stuck");
            }
        }
        // Saves the updated number of lists.
        saveTodoListsToLocalStorage();
    })

    const addButton = background.querySelector(".container .add-task-button");

    // When you click on the add task button, clone and add a task element 
    addButton.addEventListener("click", () => {
        const taskTemplateClone = taskTemplate.content.cloneNode(true);

        const tasksContainer = addButton.parentElement.parentElement.querySelector(".tasks-container");

        const deleteTaskButton = taskTemplateClone.querySelector(".task-div .task-delete-button-container .delete-task-button");

        // Deletes task on click.
        deleteTaskButton.addEventListener("click", function () {
            deleteTaskButton.parentElement.parentElement.remove();
        })

        // Adds the task to the tasksContainer
        tasksContainer.append(taskTemplateClone);

        // Updates the to-do list save
        saveTodoListsToLocalStorage();
    })
}


// Listener that adds a to-do list on click. It is similar to the load to-do list from localStorage section but I have decided to make it separate and not a function because there are some differences. 
createButton.addEventListener("click", () => {
    // console.log("clicked!"); -- Debug
    // Checks the number of to-do lists that currently exist. If more than the maxNumber defined at the top of the script, return and prevent any further code from executing.
    const numberOfTodoLists = todoListContainer.children.length;
    if (numberOfTodoLists >= MAX_NUM_OF_TODO_LISTS) {
        alert(`Can't have more than ${MAX_NUM_OF_TODO_LISTS} todo lists!`);
        return;
    }

    // Fixes the create button to the bottom of the screen ensuring it stays in view.
    createButton.classList.add("stuck");

    // Clones the to-do list from its template.
    const listTemplateClone = listTemplate.content.cloneNode(true);

    // Gives the appropriate class (if not already added) to the container of the to-do lists to ensure it can fit the lists properly.
    if (!todoListContainer.classList.contains("container-with-frame")) {
        todoListContainer.classList.add("container-with-frame");
    }

    const background = listTemplateClone.querySelector(".to-do-list-frame");

    // Adds click event listener functionality for add task button and delete list button.
    setupListButtons(background);

    // console.log(background);

    // Makes the list a child of the to-do list container.
    todoListContainer.append(listTemplateClone);

    // Saves the newly changed list to localStorage.
    saveTodoListsToLocalStorage();
})

// Helper function to move cursor to the end of text (conventional)
function placeCursorAtEnd(el) {
    // If the element passed through the parameter is not valid or is not contenteditable then return out of the function.
    if (!el || !el.isContentEditable) return;

    const range = document.createRange();
    const sel = window.getSelection();

    range.selectNodeContents(el);
    range.collapse(false);

    sel.removeAllRanges();
    sel.addRange(range);
}

// The 3 event listeners below manage the removal and addition of the "Click to add text" placeholder text.

// Computer - Removes "Click to add text" placeholder if it is present.
document.addEventListener("focusin", (event) => {
    // Checks if the element is contentedtiable.
    if (event.target.isContentEditable) {
        const element = event.target;
        const placeholderText = element.getAttribute("data-placeholder-text");
        // Return if placeholder text not found
        if (!placeholderText) {
            // console.log("nil");
            return
        }

        // If the text of the element is the placeholder text then remove it.
        if (element.innerText.trim() === placeholderText) {
            element.innerText = "";
        }

        // Places cursor at the end of the text.
        setTimeout(() => placeCursorAtEnd(element), 0);

        // console.log("User focused a contenteditable element:"", event.target);
    }
});

// Mobile - Removes "Click to add text" placeholder if it is present. - Not going to repeat comments. Code slightly modified for mobile (which is why I didn't use a function).
document.addEventListener("touchstart", (event) => {
    if (event.target.isContentEditable) {
        const element = event.target;
        const placeholder = element.getAttribute("data-placeholder-text");
        if (!placeholder) return;

        if (element.innerText.trim() === placeholder) {
            element.innerText = "";
            setTimeout(() => element.focus(), 0);
        }

        setTimeout(() => placeCursorAtEnd(element), 0);
    }
});

// Saves user text changes on contenteditable elements to localStorage and sets element text to placeholder if the text is an empty string.
document.addEventListener("focusout", (event) => {
    // This conditional checks whether the element was contenteditable.
    if (event.target.isContentEditable) {
        const element = event.target;
        const placeholderText = element.getAttribute("data-placeholder-text");
        // Exits the event listener if the attribute placeholder text cannot be found to prevent errors.
        if (!placeholderText) {
            // console.log("nil");
            return;
        }
        // console.log(element.innerText);

        // Checks whether the elements innerText is an empty string and if it is, change it to the elements placeholder text.
        if (element.innerText.trim() === "") {
            element.innerText = placeholderText;
        }

        // Saves changes to localStorage
        saveTodoListsToLocalStorage();

        // console.log("User focused a contenteditable element:"", event.target);
    }
});

// Track user key presses. To be used to check when user presses certain key combinations such as shift + enter for special functionality.
const keysPressed = new Set();

// Tracks and removes keys from the keysPressed set as they are pressed and released.
window.addEventListener("keydown", (event) => {
    keysPressed.add(event.key);
});

window.addEventListener("keyup", (event) => {
    keysPressed.delete(event.key);
});

// Function that handles shift + enter functionality (adding new lines).
function shiftEnterFunctionality(event, element) {
    // Checks whether the current focused element is the element passed in.
    if (document.activeElement === element) {
        // console.log(keysPressed);
        // Checks whether the user is holding down enter and shift at the same time.
        if (keysPressed.has("Enter") && keysPressed.has("Shift")) {
            // console.log("enter and shift key pressed");
            // Creates and inserts br and zwsp into a span, which is then inserted into the text to create a line break.
            const br = document.createElement("br");
            const zwsp = document.createTextNode("\u200B");

            const wrapper = document.createElement("span");
            wrapper.appendChild(br);
            wrapper.appendChild(zwsp);

            // Gets current cursor position
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);

            // Ensures container is an element node (a DOM element and not like, a text node)
            let container = range.commonAncestorContainer;
            if (container.nodeType === Node.TEXT_NODE) {
                container = container.parentNode;
            }

            // Avoids nesting inside another span, breaks the line break system. 
            if (container.closest("span")) {
                const outerSpan = container.closest("span");
                const afterSpanRange = document.createRange();
                afterSpanRange.setStartAfter(outerSpan);
                afterSpanRange.setEndAfter(outerSpan);
                range = afterSpanRange;
            }

            // Replaces selection with new content.
            range.deleteContents();
            range.insertNode(wrapper);

            // Moves cursor after the line break.
            range.setStartAfter(wrapper);
            range.setEndAfter(wrapper);
            selection.removeAllRanges();
            selection.addRange(range);


            // Creates a mutations observer which listens for when the zwsp is deleted and deletes the span along with it. 
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (
                        (mutation.type === "childList" &&
                            [...mutation.removedNodes].includes(zwsp)) ||
                        (mutation.type === "characterData" && mutation.target === zwsp && zwsp.data === "")
                    ) {
                        wrapper.remove();
                        // Ensures the observer does not persist.
                        observer.disconnect();
                    }
                }
            });

            // Initialises the observer
            observer.observe(wrapper, {
                childList: true,
                subtree: true,
                characterData: true
            });

        } else if (event.key == "Enter") {
            // If the user only pressed enter, exit out of the element instead.
            element.blur();
        }
    }
}

function setupEditableElement(element) {
    // console.log("Element with editable class was added");
    element.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            // console.log("Enter");
            event.preventDefault();
        }
    })

    // Only adds event listener if the element has the task-text class.
    if (element.classList.contains("task-text")) {
        // Must be keyup otherwise the keysPressed Set will not update in time! Assigns shift enter functionality to key up listener.
        element.addEventListener("keyup", (event) => {
            shiftEnterFunctionality(event, element);
        });
    } else {
        // If it doesn't have the task-text class, the element must be a title, so assign title functionality. 

        // Limits characters to maxChar.
        const maxChar = 20;
        element.addEventListener("input", () => {
            let string = element.innerText;
            // console.log(string);
            // Prevents user from typing more than 20 characters.
            if (string.length > maxChar) {
                element.innerText = string.slice(0, maxChar);
                placeCursorAtEnd(element);
            }
        });

        // Makes enter exit out of the element. 
        element.addEventListener("keyup", (event) => {
            if (event.key == "Enter") {
                element.blur();
            }
        });
    }
}

// for editable elements that already exist when this script runs.
const editableElements = document.querySelectorAll(".editable");

// Loops through all elements found that have the .editable class in the DOM.
for (const element of editableElements) {
    shiftEnterFunctionality(element);
}


// A listener for future editable elements that may be added. Like when the user creates a new to-do list.
const observer = new MutationObserver((mutationsList) => {
    // Loops through every new change.
    for (const mutation of mutationsList) {
        // Checks what elements were added inside the mutation.
        for (const node of mutation.addedNodes) {
            // Checks if the node is an element.
            if (node.nodeType === 1) {
                // Returns a nodeList of all elements with the class .editable inside node (node here is the to-do list itself)
                const nodes = node.querySelectorAll(".editable");
                // Only proceeds if there are any child elements with the .editable class like the list title
                if (nodes.length > 0) {
                    // Loops through every element found with the .editable class and assigns it the following event listeners to give it functionality.
                    for (const element of nodes) {
                        setupEditableElement(element);
                    }
                }
            }
        }
    }
});

// Initialise 
observer.observe(document.body, { childList: true, subtree: true });

// Load lists (if any)
loadTodoListsFromLocalStorage();

// Registers the service worker
if ("serviceWorker" in navigator) {
    // Wait until the website fully loads
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("./service-worker.js").then(function (registration) {
            console.log("ServiceWorker registered with scope:", registration.scope);
        }, function (err) {
            console.log("ServiceWorker registration failed:", err);
        });
    });
}

// Previous create button stick system - Didn't work out :c
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
const toDoInput = document.querySelector(".toDoInput");
const submitBtn = document.querySelector(".submitBtn");

let id;
let idToCurrentTodo = 0;
let isEditing = false;
let arrOfToDo = [];
let helperTodo = [];

window.addEventListener("load", () => {
    if (localStorage.getItem("allTodos")) {
        const savedToDos = JSON.parse(localStorage.getItem("allTodos"));
        savedToDos.forEach(todo => {
            createToDo(todo.text, todo.id, todo.isChecked); 
        });
    }
});


const createToDo = (textOfTodo, todoId, isChecked) => {
    const toDoContainer = document.querySelector(".toDoContainer");

    //if new todo is created attach new id to the created todo
    if (!todoId) {
        todoId = ++idToCurrentTodo;
    }
    if (!textOfTodo) {
        return null
    }

    // create new todo
    const newToDo = document.createElement("div");
    const text = document.createElement("p")
    const deleteBtn = document.createElement("button")
    const checkInput = document.createElement("input");
    const editBtn = document.createElement("button")
    const buttonsContainer = document.createElement("div");

    newToDo.style.backgroundColor = "greenyellow";
    newToDo.classList.add("newToDo")
    newToDo.id = todoId;

    text.textContent = textOfTodo;
    text.classList.add("textParagraph")

    buttonsContainer.style.display = "flex"
    buttonsContainer.style.justifyContent = "center";
    buttonsContainer.style.alignItems = "center";

    deleteBtn.textContent = "Delete"
    deleteBtn.classList.add("deleteBtnClass");

    checkInput.type = "checkbox";
    checkInput.classList.add("checkInputClass");
    checkInput.checked = isChecked;

    editBtn.textContent = "Edit";
    editBtn.classList.add("editBtnClass");

    newToDo.appendChild(text);
    buttonsContainer.append(checkInput, deleteBtn, editBtn);
    newToDo.appendChild(buttonsContainer)


    // dellete Logic
    deleteBtn.addEventListener("click", () => {
        newToDo.remove();
        arrOfToDo = arrOfToDo.filter(todo => todo.id !== newToDo.id)
        helperTodo = helperTodo.filter(todo => todo.id !== newToDo.id)
        localStorage.setItem("allTodos", JSON.stringify(helperTodo))
    });

    // text decoration on check
    checkInput.addEventListener("click", (e) => {
        if (e.target.checked) {
            text.style.textDecoration = "line-through white";
            editBtn.style.display = "none";
            helperTodo = helperTodo.map(todo =>
                todo.id === newToDo.id ? { ...todo, isChecked: true } : todo
            );
            console.log("ALWAYS GOES TRUE")
        } else {
            text.style.textDecoration = "none";
            editBtn.style.display = "block";
            helperTodo = helperTodo.map(todo =>
                todo.id === newToDo.id ? { ...todo, isChecked: false } : todo
            );
            console.log("ALWAYS GOES FALSE")

        }
        localStorage.setItem("allTodos", JSON.stringify(helperTodo));
    });

    // edit Logic 
    editBtn.addEventListener("click", () => {
        toDoInput.value = textOfTodo;
        isEditing = true;
        id = newToDo.id;
        submitBtn.textContent = "Save";
        
    });

    if (isChecked) {
        text.style.textDecoration = "line-through white";
        editBtn.style.display = "none";
    }

    toDoContainer.appendChild(newToDo);

    // save todo to array
    if (!isEditing) {
        arrOfToDo.push({ text: textOfTodo, id: newToDo.id, isChecked: isChecked }); 
        helperTodo.push({ text: textOfTodo, id: newToDo.id, isChecked: isChecked }); 
        localStorage.setItem("allTodos", JSON.stringify(helperTodo));
    }
    toDoInput.value = "";
};

toDoInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && !isEditing) {
        createToDo(e.target.value); // create todo when enter is pressed and when its not in editing stage
    }
});

submitBtn.addEventListener("click", () => {
    if (isEditing) {
        const foundEditingToDo = arrOfToDo.find(todo => todo.id === id);
        foundEditingToDo.textContent = toDoInput.value;


        //add to html
        const editedToDo = document.getElementById(id).querySelector("p");
        editedToDo.textContent = toDoInput.value;

        helperTodo = helperTodo.map(todo =>
            todo.id === id ? { text: toDoInput.value, id: id, isChecked: foundEditingToDo.isChecked } : todo 
        );

        localStorage.setItem("allTodos", JSON.stringify(helperTodo));
        isEditing = false;
        submitBtn.textContent = "Enter New Todo";
        toDoInput.value = "";
    } else {
        createToDo(toDoInput.value);
    }
});

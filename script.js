let todo_list = [];				// array of todo objects
let todo_el_list = [];			// array of todo nodes(elements)


let todoForm = document.querySelector(".todo-form");
let input = document.querySelector("input[type=text]");
let todos = document.querySelector(".todos");

let allBtn = document.querySelector("#all-btn");
let activeBtn = document.querySelector("#active-btn");
let completedBtn = document.querySelector("#completed-btn");
let clearBtn = document.querySelector("#clear");

let newTodo, todoDIV, todoSpan;
let dragStartIndex;


function todoCreator(content) {
	//this function creates the todo object.
	this.id;
	this.content = content;
	this.completed = false;
	this.node;
}

function showTodo(todoWrapper, todoObject) {
	// this function displays the newly created todo on the page.

	todoDIV = document.createElement("DIV");
	todoDIV.classList.add("item-todo");

	todoDIV.innerHTML =
		`<div>` +
		`<input type="checkbox" id="${todoObject.id}" />` +
		`<label for="${todoObject.id}">${todoObject.content}</label>` +
		`</div>` +
		`<img src="images/icon-cross.svg" class="cancel" />` +
		`<span class="checkbox-border">` +
		`<span class="checkbox-wrapper">` +
		`<img src="images/icon-check.svg" id="checkbox-image" />` +
		`</span>` +
		`</span>`

	todoWrapper.appendChild(todoDIV);

	todoSpan = document.querySelectorAll(".checkbox-border");

	todoObject.node = todoDIV;
	todo_el_list.push(todoDIV);

	todoSpan[todoSpan.length - 1].addEventListener("click", handleChecked.bind(null, todo_list), false);

	handleDragDrop(todoObject.node);

}


const handleSubmit = (ev) => {
	//this function handles what happens when you hit submit

	ev.preventDefault();				//stop it from reloading
	let todoContent = input.value;		//we feed this text to the todoCreator function

	newTodo = new todoCreator(todoContent);
	todo_list.push(newTodo);
	newTodo.id = "todoItem" + todo_list.indexOf(newTodo);	//generate a unique id for each todo
	todoForm.reset();
	showTodo(todos, newTodo);								//display the newly-created todo.


	document.querySelectorAll(".cancel").forEach(btn => {
		btn.addEventListener("click", handleDelete);
	})
}

const handleDelete = (ev) => {
	let targetElement = ev.target;
	let element = targetElement.parentElement;
	const content = element.childNodes[0].childNodes[1].textContent.trim();

	todo_list = todo_list.filter((el) => {
		return el.content != content;
	})
	todo_el_list = todo_el_list.filter((el) => {
		return el != element;
	})

	element.style.display = "none";

	console.log(todo_el_list);
	console.log(element);

}



function handleDragDrop(element) {
	// handles the dragging and dropping of todos

	element.setAttribute("draggable", true);
	element.classList.add("draggable")

	element.addEventListener("dragstart", (ev) => {
		element.classList.add("dragging");
		dragStartIndex = todo_el_list.findIndex((elx) => {
			if (elx === ev.target) return ev.target
		});
	});
	element.addEventListener("dragend", (ev) => {
		element.classList.remove("dragging");
		ev.preventDefault();
	});
	element.addEventListener("dragover", (ev) => {
		ev.preventDefault();
	});
	element.addEventListener("drop", (ev) => {
		let dragEndIndex = todo_el_list.findIndex((elx) => {
			if (elx === ev.target) return ev.target
		});
		swapItems(dragStartIndex, dragEndIndex, todos);
	});
}

function swapItems(fromIndex, toIndex, parent) {
	if (fromIndex < toIndex) {
		parent.insertBefore(todo_el_list[fromIndex], todo_el_list[toIndex].nextSibling);

		const tempRemoved = todo_el_list.splice(fromIndex, 1)[0];
		todo_el_list.splice(toIndex, 0, tempRemoved);
		const tempObjRemoved = todo_list.splice(fromIndex, 1)[0];
		todo_list.splice(toIndex, 0, tempObjRemoved);
	}
	else if (fromIndex > toIndex) {
		parent.insertBefore(todo_el_list[fromIndex], todo_el_list[toIndex]);

		const tempRemoved = todo_el_list.splice(fromIndex, 1)[0];
		todo_el_list.splice(toIndex, 0, tempRemoved);
		const tempObjRemoved = todo_list.splice(fromIndex, 1)[0];
		todo_list.splice(toIndex, 0, tempObjRemoved);
	}
	console.log(todo_list);

}

const handleChecked = (objList, ev) => {
	const todoObject = objList.filter(obj => {
		if (ev.currentTarget === obj.node.childNodes[2]) {
			return ev.target;
		}
	})[0];

	if (!todoObject.completed) {
		todoObject.completed = true;
		ev.currentTarget.firstChild.classList.add("checked");
		todoObject.node.childNodes[2].firstChild.firstChild.style.visibility = "visible";
		todoObject.node.firstChild.childNodes[1].style.textDecoration = "line-through"
		todoObject.node.firstChild.childNodes[1].style.color = "#535369"
	}
	else {
		todoObject.completed = false;
		ev.currentTarget.firstChild.classList.remove("checked");
		todoObject.node.childNodes[2].firstChild.firstChild.style.visibility = "hidden";
		todoObject.node.firstChild.childNodes[1].style.textDecoration = "";
		todoObject.node.firstChild.childNodes[1].style.color = "#FFFFFF";
	}
	console.log(objList);
}


//the following three functions filter the todos according to whether they have been completed or not.
const handleCompleted = () => {
	allBtn.classList.remove("active");
	activeBtn.classList.remove("active");
	completedBtn.classList.add("active");

	todo_list.forEach(obj => {
		obj.node.style.display = "";
	})

	todo_list.forEach(obj => {
		if (!obj.completed) {
			obj.node.style.display = "none";
		}
	})
}
const handleActive = () => {
	allBtn.classList.remove("active");
	activeBtn.classList.add("active");
	completedBtn.classList.remove("active");

	todo_list.forEach(obj => {
		obj.node.style.display = "";
	})

	todo_list.forEach(obj => {
		if (obj.completed) {
			obj.node.style.display = "none";
		}
	})
}
const handleAll = () => {
	allBtn.classList.add("active");
	activeBtn.classList.remove("active");
	completedBtn.classList.remove("active");

	todo_list.forEach(obj => {
		obj.node.style.display = "";
	})
}

function clearCompleted() {
	todo_list.forEach(obj => {
		elem = obj.node;
		if (obj.completed) {
			todo_el_list.splice(todo_el_list.findIndex(el => el === elem), 1);
			todos.removeChild(elem);
			todo_list.splice(todo_list.findIndex(objx => objx === obj), 1);

			console.log(todo_list);
			console.log(todo_el_list);
		}
	})
}


const displayCount = () => {
	completed_todos = todo_list.filter(obj => {
		if (!obj.completed) { return obj; };
	})
	completed = completed_todos.length;
	document.getElementById("todo-count").innerHTML = `${completed} items left`;
	completed_todos = [];
}
setInterval(displayCount, 50);



todoForm.addEventListener("submit", handleSubmit);
completedBtn.addEventListener("click", function () { handleCompleted() });
activeBtn.addEventListener("click", function () { handleActive() });
allBtn.addEventListener("click", function () { handleAll() });
clearBtn.addEventListener("click", function () { clearCompleted() });
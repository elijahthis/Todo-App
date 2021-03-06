let todo_list = [];				// array of todo objects


let todoForm = document.querySelector(".todo-form");
let todos = document.querySelector(".todos");

let allBtns = document.querySelectorAll(".all-btn");
let activeBtns = document.querySelectorAll(".active-btn");
let completedBtns = document.querySelectorAll(".completed-btn");
let clearBtn = document.querySelector("#clear");
let themeBtn = document.querySelector("#theme-selector-image");

let newTodo, todoDIV, todoSpan;
let dragStartIndex;
let theme = true;		// true means DARK mode

function todoCreator(content) {
	//this function creates the todo object.
	this.id;
	this.content = content;
	this.completed = false;
	this.node;
}

const toggleTheme = () => {
	if (theme) {
		themeBtn.src = "images/icon-moon.svg";
		document.body.classList.add("light");
		theme = !theme;
	}
	else {
		themeBtn.src = "images/icon-sun.svg";
		document.body.classList.remove("light");
		theme = !theme;
	}
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

	todoSpan[todoSpan.length - 1].addEventListener("click", handleChecked.bind(null, todo_list), false);

	handleDragDrop(todoObject.node);

}


const handleSubmit = (ev) => {
	//this function handles what happens when you hit submit


	ev.preventDefault();				//stop it from reloading
	let todoContent = todoForm["todo-input"].value;		//we feed this text to the todoCreator function

	newTodo = new todoCreator(todoContent);
	todo_list.push(newTodo);
	newTodo.id = "todoItem" + todo_list.indexOf(newTodo);	//generate a unique id for each todo
	todoForm.reset();
	showTodo(todos, newTodo);								//display the newly-created todo.


	document.querySelectorAll(".cancel").forEach(btn => {
		btn.addEventListener("click", handleDelete);
	})
	document.querySelectorAll(".item-todo")[0].setAttribute("id", "first");
	hideCancel();
}

const handleDelete = (ev) => {
	let targetElement = ev.target;
	let element = targetElement.parentElement;

	todo_list = todo_list.filter((obj) => {
		if (obj.node !== element) {
			return obj;
		}
	})

	element.style.display = "none";

	console.log(todo_list);
	console.log(element);

}



function handleDragDrop(element) {
	// handles the dragging and dropping of todos

	element.setAttribute("draggable", true);
	element.classList.add("draggable")

	element.addEventListener("dragstart", (ev) => {
		element.classList.add("dragging");
		dragStartIndex = todo_list.findIndex((obj) => {
			if (obj.node === ev.target) return obj
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
		let dragEndIndex = todo_list.findIndex((obj) => {
			if (obj.node === ev.target) return obj
		});
		swapItems(dragStartIndex, dragEndIndex, todos);
	});
}

function swapItems(fromIndex, toIndex, parent) {
	if (fromIndex < toIndex) {
		parent.insertBefore(todo_list[fromIndex].node, todo_list[toIndex].node.nextSibling);

		const tempObjRemoved = todo_list.splice(fromIndex, 1)[0];
		todo_list.splice(toIndex, 0, tempObjRemoved);
	}
	else if (fromIndex > toIndex) {
		parent.insertBefore(todo_list[fromIndex].node, todo_list[toIndex].node);

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
		todoObject.node.classList.add("true");
	}
	else {
		todoObject.completed = false;
		ev.currentTarget.firstChild.classList.remove("checked");
		todoObject.node.childNodes[2].firstChild.firstChild.style.visibility = "hidden";
		todoObject.node.firstChild.childNodes[1].style.textDecoration = "";
		todoObject.node.classList.remove("true");
	}
	console.log(objList);
}


//the following three functions filter the todos according to whether they have been completed or not.
const handleCompleted = () => {
	allBtns.forEach(allB => allB.classList.remove("active"));
	activeBtns.forEach(activeB => activeB.classList.remove("active"));
	completedBtns.forEach(completedB => completedB.classList.add("active"));

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
	allBtns.forEach(allB => allB.classList.remove("active"));
	activeBtns.forEach(activeB => activeB.classList.add("active"));
	completedBtns.forEach(completedB => completedB.classList.remove("active"));

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
	allBtns.forEach(allB => allB.classList.add("active"));
	activeBtns.forEach(activeB => activeB.classList.remove("active"));
	completedBtns.forEach(completedB => completedB.classList.remove("active"));

	todo_list.forEach(obj => {
		obj.node.style.display = "";
	})
}

function clearCompleted() {
	todo_list.forEach(obj => {
		if (obj.completed) {
			todos.removeChild(obj.node);
			todo_list = todo_list.filter(objx => {
				if (objx !== obj) { return obj }
			});
			console.log(obj);
		}
	})
}

const hideCancel = () => {
	todo_list.forEach(obj => {
		obj.node.addEventListener("mouseover", function () { obj.node.childNodes[1].classList.add("show") })
	})
	todo_list.forEach(obj => {
		obj.node.addEventListener("mouseleave", function () { obj.node.childNodes[1].classList.remove("show") })
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
completedBtns.forEach(btn => { btn.addEventListener("click", handleCompleted) });
activeBtns.forEach(btn => { btn.addEventListener("click", handleActive) });
allBtns.forEach(btn => { btn.addEventListener("click", handleAll) });
clearBtn.addEventListener("click", clearCompleted);
themeBtn.addEventListener("click", toggleTheme)
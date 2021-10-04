const todo_list = [];

let todoForm = document.querySelector("body");
let input = document.querySelector("input[type=text]");
let todos = document.querySelector(".todos");
let newTodo, todoDIV, todoINPUT, todoLABEL, textNode;

function todoCreator(content) {
	this.content = content;
	this.completed = false;
}

function showTodo(todoWrapper, todoObject) {
	todoDIV = document.createElement("DIV");
	todoDIV.classList.add("item-todo");
	
	todoINPUT = document.createElement("INPUT");
	todoINPUT.setAttribute("type", "checkbox");
	todoINPUT.setAttribute("id", todoObject.id);
	
	todoLABEL = document.createElement("LABEL");
	todoLABEL.setAttribute("for", todoObject.id);
	textNode = document.createTextNode(" " + todoObject.content);
	todoLABEL.appendChild(textNode);
	
	todoDIV.appendChild(todoINPUT);
	todoDIV.appendChild(todoLABEL);
	todos.appendChild(todoDIV);
}


const handleSubmit = (ev) => {
	ev.preventDefault();
	let todoContent = input.value;
	
	newTodo = new todoCreator(todoContent);
	todo_list.push(newTodo);
	newTodo.id = "todoItem" + todo_list.indexOf(newTodo);
	console.log(todo_list);
	showTodo(todos, newTodo);
}


todoForm.addEventListener("submit", handleSubmit);
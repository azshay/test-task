// Общие элементы

const insertData = (element, li) => {
	if (document.querySelector(".menu").textContent === "") {
		currentElement.appendChild(element);
		currentElement = currentElement.lastChild;
	} else if (currentElement.tagName === "UL") {
		currentElement.appendChild(li);
	} else if (
		currentElement.parentElement.parentElement.lastChild.tagName !== "UL" &&
		currentElement.parentElement.parentElement.tagName !== "UL"
	) {
		currentElement.parentElement.parentElement.appendChild(element);
	} else {
		currentElement.parentElement.parentElement.lastChild.appendChild(li);
	}
};

// Текущий элемент

const menu = document.querySelector(".menu");

let currentElement = menu;

menu.addEventListener("click", (e) => {
	currentElement.classList.remove("currentElement");
	if (e.target.tagName == "SUMMARY" || e.target.tagName == "LI") {
		currentElement = e.target.firstChild;
	} else {
		currentElement = e.target;
	}

	if (currentElement.tagName == "SPAN") {
		currentElement.classList.toggle("active");
	}

	if (currentElement.tagName != "UL") {
		currentElement.classList.add("currentElement");
	}
});

// Создание папки

const btnCreateFolder = document.querySelector(".btn__createFolder");

btnCreateFolder.addEventListener("click", () => {
	const name = prompt("Введите название папки: ");

	if (name != "") {
		const element = document.createElement("ul");
		const li = document.createElement("li");
		const details = document.createElement("details");
		const summary = document.createElement("summary");
		const span = document.createElement("span");
		span.textContent = name;
		summary.appendChild(span);
		details.appendChild(summary);
		li.appendChild(details);
		element.appendChild(li);

		insertData(element, li);
	} else {
		alert("Папка не может быть без названия!");
	}
});

// Переименовать

const btnRename = document.querySelector(".btn__rename");
btnRename.addEventListener("click", () => {
	if (
		currentElement.tagName !== "UL" &&
		!currentElement.classList.contains("menu")
	) {
		const name = prompt("Введите новое название:");
		if (currentElement.classList.contains("file")) {
			document.querySelectorAll(".editor__file").forEach((editorFile) => {
				if (editorFile.textContent == currentElement.textContent) {
					editorFile.textContent = name;
					files.set(name, files.get(currentElement.textContent));
					files.delete(currentElement.textContent);
				}
			});
		}
		currentElement.textContent = name;
	} else {
		alert("Выберите нужный файл/папку");
	}
});

// Удалить папку

const btnDeleteFolder = document.querySelector(".btn__deleteFolder");

btnDeleteFolder.addEventListener("click", () => {
	const name = prompt("Введите название папки: ");
	const elements = document.querySelectorAll("details");

	elements.forEach((element) => {
		if (element.firstChild.firstChild.textContent === name) {
			element.remove();
		}
	});
});

// Загрузить файл

const btnUpload = document.querySelector(".btn__upload");
const btnModal = document.querySelector(".btn__modal");
const modal = document.querySelector(".modal");

btnUpload.addEventListener("click", () => {
	modal.style.display = "block";
});

const files = new Map();
const filesDescription = new Map();

btnModal.addEventListener("click", () => {
	// let file = document.getElementById("file").files[0];
	// let reader = new FileReader();
	// reader.readAsText(file);
	// reader.onload = () => {
	// 	files.set(file.name, reader.result);
	// };
	let willBeAdded = true;

	let file = document.getElementById("file").files[0];
	const description = document.getElementById("description");
	if (files.has(file.name)) {
		alert("Файл с таким названием уже есть!");
	} else {
		let reader = new FileReader();
		reader.readAsText(file);
		reader.onload = () => {
			files.set(file.name, reader.result);
		};

		if (description.value == "") {
			filesDescription.set(file.name, "Без описания");
		} else {
			filesDescription.set(file.name, description.value);
		}

		const descriptionElement = document.createElement("div");
		descriptionElement.classList.add("menu__description");
		console.log(filesDescription.get(file.name));
		descriptionElement.textContent = filesDescription.get(file.name);
		descriptionElement.style.display = "none";

		const element = document.createElement("ul");
		const li = document.createElement("li");
		const span = document.createElement("span");
		span.textContent = file.name;
		span.classList.add("file");
		li.appendChild(span);
		li.appendChild(descriptionElement);
		li.addEventListener("mouseover", (e) => {
			descriptionElement.style.display = "block";
			descriptionElement.style.top = e.clientX;
		});
		li.addEventListener("mouseout", () => {
			descriptionElement.style.display = "none";
		});
		element.appendChild(li);

		const temp = currentElement;
		if (currentElement.classList.contains("file")) {
			currentElement.classList.remove("currentElement");
			currentElement = currentElement.parentElement;
		}
		insertData(element, li);
	}

	document.getElementById("file").value = "";
	modal.style.display = "none";
});

// Обработка модалки

modal.addEventListener("click", (e) => {
	if (e.target.classList.contains("modal")) {
		modal.style.display = "none";
	}
});

// Удаление файла

const btnDelete = document.querySelector(".btn__deleteFile");

btnDelete.addEventListener("click", () => {
	if (currentElement.classList.contains("file")) {
		currentElement.remove();
		currentElement = menu;
	} else {
		alert("Не был выбран файл для удаления.");
	}
});

// Изменение контентной части

const editor = document.querySelector(".editor");

menu.addEventListener("click", () => {
	let needChange = true;

	document.querySelectorAll(".editor__file").forEach((element) => {
		if (element.textContent == currentElement.textContent) {
			needChange = false;
		}
	});

	if (currentElement.classList.contains("file") && needChange) {
		const name = document.createElement("p");
		name.textContent = currentElement.textContent;
		document.querySelectorAll(".editor__file").forEach((file) => {
			file.classList.remove("active");
		});
		name.classList.add("editor__file", "active");
		editor.firstChild.appendChild(name);

		const text = document.createElement("pre");
		const code = document.createElement("code");
		text.appendChild(code);
		text.classList.add("editor__text");
		text.firstChild.textContent = files.get(currentElement.textContent);
		editor.lastChild.remove();
		editor.appendChild(text);
		hljs.highlightAll();
		editor.lastChild.firstChild.style.background = "none";
		editor.lastChild.style.margin = "0px";

		// text.classList.add("editor__text");
		// text.textContent = files.get(currentElement.textContent);
		// editor.lastChild.remove();
		// editor.appendChild(text);
	}
});

// Изменение содержания и названия

const changeActiveEditor = () => {
	document.querySelector(".editor").addEventListener("click", (e) => {
		if (e.target.classList.contains("editor__file")) {
			document.querySelectorAll(".editor__file").forEach((file) => {
				file.classList.remove("active");
			});

			e.target.classList.add("active");

			const editorText = document.querySelector(".editor__text");
			editorText.lastChild.textContent = files.get(e.target.textContent);
			editor.lastChild.remove();
			editor.appendChild(editorText);
			hljs.highlightAll();
			editorText.firstChild.style.background = "none";
			editor.lastChild.style.margin = "0px";
		}
	});
};

changeActiveEditor();

// Скачивание файла

const btnDownload = document.querySelector(".btn__download");

btnDownload.addEventListener("click", () => {
	if (currentElement.classList.contains("file")) {
		const a = document.createElement("a");
		const file = new Blob([files.get(currentElement.textContent)], {
			type: "text/plain",
		});
		a.href = URL.createObjectURL(file);
		a.download = currentElement.textContent;
		a.click();
	}
});

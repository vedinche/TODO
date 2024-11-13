(function () {
  let todoArray = [];

  //! Функция сохранения данных в LocalStorage
  function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  //! Функция чтения данных из LocalStorage
  function loadFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  //* создаём и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    appTitle.classList.add('app-title');

    return appTitle;
  }

  //* создаём и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWraper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWraper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWraper.append(button);
    form.append(input);
    form.append(buttonWraper);

    //Деактивируем кнопку "Добавить дело"
    function inputActivate() {
      !input.value ? (button.disabled = true) : (button.disabled = false);
    }

    input.addEventListener('input', inputActivate);

    return {
      form,
      input,
      button,
    };
  }

  //* создаём и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');

    return list;
  }
  function generateTodoId() {
    let maxId = 0;
    for (let i = 0; i < todoArray.length; i++) {
      if (todoArray[i].id > maxId) {
        maxId = todoArray[i].id;
      }
    }
    return maxId + 1; // Возвращаем значение id
  }

  //* Добавляем список дел
  function createTodoItem(todoObj, key) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-center'
    );

    //Название дела
    item.textContent = todoObj.name;
    if (todoObj.done) {
      item.classList.add('list-group-item-success');
    }

    // Присваиваем id элементу для использования в функции удаления
    item.setAttribute('id', `todo-${todoObj.id}`);

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      for (let i = 0; i < todoArray.length; i++) {
        if (todoArray[i].id === todoObj.id) {
          todoArray[i].done = !todoArray[i].done; //Обновляем статус в массиве
          // Этап 5
          saveToLocalStorage(key, todoArray); // Сохраняем массив в LocalStorage
          break;
        }
      }
      console.log(todoArray);
    });

    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены')) {
        item.remove();
        // Удаляем дело из массива
        let index = -1;
        for (let i = 0; i < todoArray.length; i++) {
          if (todoArray[i].id === todoObj.id) {
            index = i;
            break;
          }
        }
        if (index > -1) {
          todoArray.splice(index, 1); // Удаляем элемент из массива
          // Этап 5
          saveToLocalStorage(key, todoArray); //Сохраняем массив в LocalStorage
        }
        console.log(todoArray);
      }
    });

    return {
      item,
      doneButton,
      deleteButton,
    };
  }

  //* Добавляем элементы в HTML
  function createTodoApp(container, title, listName) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    //Загружаем данные из LocalStorage
    todoArray = loadFromLocalStorage(listName);

    //Добавляем загруженные дела в список
    for (let todoObj of todoArray) {
      let todoItem = createTodoItem(todoObj, listName);
      todoList.append(todoItem.item);
    }

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      //Деактивируем кнопку "Добавить дело"
      todoItemForm.button.disabled = true;

      //Создаём объект дела с id
      let todoObj = {
        id: generateTodoId(),
        name: todoItemForm.input.value,
        done: false,
      };

      // Добавляем дело в массив
      todoArray.push(todoObj);

      let todoItem = createTodoItem(todoObj, listName);
      todoList.append(todoItem.item);

      todoItemForm.input.value = '';
      // Сохраняем массив в LocalStorage
      saveToLocalStorage(listName, todoArray);
      console.log(todoArray);
    });
  }
  window.createTodoApp = createTodoApp;
})();

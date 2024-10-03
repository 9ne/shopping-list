const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
const cancelBtn = document.querySelector('.btn-cancel');

cancelBtn.style.display = 'none';
let isEditMode = false;


const displayItems = () => {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach(item => addItemToDOM(item));

  checkUI();
};

const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if(checkIfItemExists(newItem)) {
      alert('That item already exists!')
      return;
    }
  } 
  
  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  };

  // Create item DOM element
  addItemToDOM(newItem);
  // Add item to local storage
  addItemToStorage(newItem);
  checkUI();

  itemInput.value = '';

};

const addItemToDOM = (item) => {
  //Create List item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);

};

const createButton = (classes) => {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
};

const createIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
};

const addItemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const getItemsFromStorage = () => {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  };

  return itemsFromStorage;
};

const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

const setItemToEdit = (item) => {
  isEditMode = true;

  if (isEditMode === true) {
    cancelBtn.style.display = 'block';
  };

  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class ="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228b22';

  itemInput.value = item.textContent;
};


const cancelEditMode = (e) => {
  e.preventDefault();
  
  itemInput.value = '';

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  cancelBtn.style.display = 'none';

  itemList.querySelectorAll('li').forEach(item => item.classList.remove('edit-mode'));

  checkUI();
};

const removeItem = (item) => {
  if (confirm('Are you sure?')) {
    // Remove item from the DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
};

const removeItemFromStorage = (item) => {
  let itemsFromStorage = getItemsFromStorage();

  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

const clearItems = () => {
  // itemList.innerHTML = ''; One way of doing it
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  };

  // Clear from localstorage
  localStorage.removeItem('items')
  checkUI();
};

const filterItems = (e) => {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLocaleLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

const checkIfItemExists = (item) => {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.some(storedItem => storedItem.toLowerCase() === item.toLowerCase());
};

const checkUI = () => {
  itemInput.value = '';

  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  } 

  formBtn.innerHTML = '<i class ="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  cancelBtn.style.display = 'none';

  isEditMode = false;
};

// Initialize app
const init = () => {
  //Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  cancelBtn.addEventListener('click', cancelEditMode);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();





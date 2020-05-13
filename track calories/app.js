const StorageCtrl = (function() {

    return {
        storeItem: function(item) {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        }, 
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }

})();

const ItemCtrl = (function() {

    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            return newItem;
        },
        getItemToEdit: function(id) {
            let found = null;
            data.items.forEach(function(item) {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories) {
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            const ids = data.items.map(function(item) {
                return item.id;
            });

            const index = ids.indexOf(id);
            data.items.splice(index, 1);
        },
        clearEverything: function() {
            data.items = [];
        },
        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(function(item) {
                total += item.calories;
            });

            data.totalCalories = total;
            return data.totalCalories;
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        displayData: function() {
            return data;
        }
    }
})();

const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        clearBtn: '.clear-btn'
    }

    return {
        populateItemList: function(items) {
            let html = '';
            items.forEach(function(item) {

                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name} </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>
                `;

            });
            document.querySelector(UISelectors.itemList).innerHTML = html; 
        },
        BackButton: function() {
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
            <strong>${item.name} </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name} </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(function(item) {
                item.remove();
            });
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
        },
        showEditState: function () {
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        },
        getSelectors: function() {
            return UISelectors;
        }
    }
})();

const App = (function(StorageCtrl, ItemCtrl, UICtrl) {

    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.BackButton);
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItems);
    }

    const itemAddSubmit = function(e) {

        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            UICtrl.addListItem(newItem);
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            StorageCtrl.storeItem(newItem);
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    const itemEditClick = function(e) {

        if(e.target.classList.contains('edit-item')) {
            console.log('take it ez');
            const listId = e.target.parentElement.parentElement.id;
            
            const listIdArray = listId.split('-');
            const id = parseInt(listIdArray[1]);
            const itemToEdit = ItemCtrl.getItemToEdit(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    const itemUpdateSubmit = function(e) {
        const input = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        UICtrl.updateListItem(updatedItem);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        StorageCtrl.updateItemStorage(updatedItem);
        UICtrl.clearEditState();
        e.preventDefault();
    }    

    const itemDeleteSubmit = function(e) {
        const currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currentItem.id);
        UICtrl.deleteListItem(currentItem.id);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        StorageCtrl.deleteItemFromStorage(currentItem.id);
        UICtrl.clearEditState();
        e.preventDefault();
    }

    const clearAllItems = function() {
        ItemCtrl.clearEverything();
        UICtrl.clearItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        StorageCtrl.clearItemsFromStorage();
    }

    return {
        init: function() {
            console.log('os for life');
            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();
            UICtrl.populateItemList(items);
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            loadEventListeners();
        } 
    }

})(StorageCtrl, ItemCtrl, UICtrl);

App.init();
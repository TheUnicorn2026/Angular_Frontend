// URL endpoint variable
const API_URL = 'http://localhost:8000/user/';

const userTableBody = document.getElementById('user-table-body');
const addUserForm = document.getElementById('add-user-form');

// Load users on page load
window.onload = function() {
    loadUsers();
};

// Fetch users from the API
function loadUsers() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            userTableBody.innerHTML = ''; // Clear table before adding new data
            data.forEach(user => {
                const tr = document.createElement('tr');
                tr.dataset.id = user.id;

                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td><input type="text" value="${user.name}" ${user.editing ? '' : 'disabled'} class="form-control" /></td>
                    <td><input type="email" value="${user.email}" ${user.editing ? '' : 'disabled'} class="form-control" /></td>
                    <td><input type="text" value="${user.phone}" ${user.editing ? '' : 'disabled'} class="form-control" /></td>
                    <td><input type="text" value="${user.address}" ${user.editing ? '' : 'disabled'} class="form-control" /></td>
                    <td>${user.is_active ? 'Active' : 'Inactive'}</td>
                    <td class="user-actions">
                        <button class="btn btn-warning" onclick="editUser(${user.id})" ${user.editing ? 'style="display:none;"' : ''}>Edit</button>
                        <button class="btn btn-success" onclick="saveUser(${user.id})" ${user.editing ? '' : 'style="display:none;"'}>Save</button>
                        <button class="btn btn-secondary" onclick="cancelEdit(${user.id})" ${user.editing ? '' : 'style="display:none;"'}>Cancel</button>
                        <button class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                    </td>
                `;
                
                userTableBody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
        });
}

// Add user
addUserForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const newUser = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then(response => response.json())
    .then(data => {
        loadUsers(); // Reload the users after adding
        addUserForm.reset(); // Clear the form fields
    })
    .catch(error => {
        console.error('Error adding user:', error);
    });
});

// Edit user
function editUser(userId) {
    const row = document.querySelector(`tr[data-id="${userId}"]`);
    const userInputs = row.querySelectorAll('input');
    userInputs.forEach(input => input.disabled = false);

    // Show/hide buttons
    row.querySelectorAll('button').forEach(button => {
        if (button.innerText === 'Edit') button.style.display = 'none';
        if (button.innerText === 'Save' || button.innerText === 'Cancel') button.style.display = '';
    });

    // Add 'editing' flag to user
    row.dataset.editing = 'true';
}

// Save user
function saveUser(userId) {
    const row = document.querySelector(`tr[data-id="${userId}"]`);
    const updatedUser = {
        id: userId,
        name: row.querySelector('input[type="text"]').value,
        email: row.querySelector('input[type="email"]').value,
        phone: row.querySelectorAll('input[type="text"]')[1].value,
        address: row.querySelectorAll('input[type="text"]')[2].value
    };

    fetch(`${API_URL}${userId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
    })
    .then(() => {
        loadUsers(); // Reload the users after saving
    })
    .catch(error => {
        console.error('Error saving user:', error);
    });
}

// Cancel edit
function cancelEdit(userId) {
    loadUsers(); // Reload the users to discard changes
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`${API_URL}${userId}/`, {
            method: 'DELETE'
        })
        .then(() => {
            loadUsers(); // Reload the users after deletion
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
    }
}

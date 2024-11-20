const UserManager = {

    users: [],
    currentPage: 1,
    usersPerPage: 5,
    activeFilter: 'all',
    clickCount: 0,
    init() {
     
        this.bindEvents();
        this.render();
        this.updateUserCount(); 
    },

    bindEvents() {
        document.getElementById('addUserBtn').addEventListener('click', () => this.openModal());
        document.getElementById('saveUserBtn').addEventListener('click', () => this.saveUser());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('input-search').addEventListener('input', () => this.render());
        document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (event) => this.editUser(event));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (event) => this.deleteUser(event));
        });
        document.querySelector('.button-active').addEventListener('click', () => this.toggleActiveFilter());
        document.getElementById('ascSortingBtn').addEventListener('click', () => this.ascSorting());
        document.getElementById(`descSortingBtn`).addEventListener(`click`, () => this.descSorting());
        document.getElementById('colorBtn').addEventListener('click', () => this.toggleLampColor());
    },

    renderPagination() {
        const paginationContainer = document.querySelector('.btn-pogination');
        paginationContainer.innerHTML = ''; 
    
        const totalPages = Math.ceil(this.users.length / this.usersPerPage);
        
        const pageSelect = document.getElementById('pageSelect');
        pageSelect.innerHTML = ''; 
    
        const pageSizes = [5, 10, 15, 20];
        for (let i = 0; i < pageSizes.length; i++) {
            if (this.users.length >= pageSizes[i]) {
                const option = document.createElement('option');
                option.value = pageSizes[i];
                option.textContent = `${pageSizes[i]} users per page`;
                pageSelect.appendChild(option);
            }
        }
        pageSelect.value = this.usersPerPage;
        pageSelect.addEventListener('change', () => {
            this.usersPerPage = parseInt(pageSelect.value);
            this.currentPage = 1;
            this.render();
        });
    
        const prevBtn = document.createElement('button');
        prevBtn.innerText = 'prev';
        prevBtn.classList.add('btn-pagination');
        prevBtn.disabled = this.currentPage === 1; 
        prevBtn.addEventListener('click', () => {
            this.changePage(-1);
        });
        paginationContainer.appendChild(prevBtn);
    
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('button');
            pageLink.innerText = i;
            pageLink.classList.add('btn-pagination');
            pageLink.disabled = this.currentPage === i; 
            pageLink.addEventListener('click', () => {
                this.currentPage = i;
                this.render();
            });
            paginationContainer.appendChild(pageLink);
        }
        
        const nextBtn = document.createElement('button');
        nextBtn.innerText = 'next';
        nextBtn.classList.add('btn-pagination');
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            this.changePage(1);
        });
        paginationContainer.appendChild(nextBtn);
    },

    updateUserCount() {
        const userCountElement = document.getElementById('userCount');
        userCountElement.innerText = this.users.length; 
    },

    toggleLampColor() {
        this.clickCount++;

        document.querySelector('.lamp.gray').classList.add('none');
        document.querySelector('.lamp.red').classList.add('none');
        document.querySelector('.lamp.grin').classList.add('none');

        if (this.clickCount === 1) {
            document.querySelector('.lamp.grin').classList.remove('none'); // Зеленая
        } else if (this.clickCount === 2) {
            document.querySelector('.lamp.red').classList.remove('none'); // Красная
        } else if (this.clickCount === 3) {
            document.querySelector('.lamp.gray').classList.remove('none'); // Серая
            this.clickCount = 0;         }
    },

    toggleSortingModal() {
        const sortingModal = document.getElementById('sortingModal');
        sortingModal.style.display = sortingModal.style.display === 'none' ? 'block' : 'none';
    },

    ascSorting() {
        const sortBy = document.getElementById('sortingSelect').value;
    
        this.users.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });
    
        this.render();
    },

    descSorting() {
        const sortBy = document.getElementById('sortingSelect').value;
    
        this.users.sort((a, b) => {
            if (a[sortBy] > b[sortBy]) return -1;
            if (a[sortBy] < b[sortBy]) return 1;
            return 0;
        });
    
        this.render();
    },

    openModal(user = null) {
        this.currentUser = user;
        document.getElementById('modalTitle').innerText = user ? 'Редактировать пользователя' : 'Добавить пользователя';
        document.getElementById('name').value = user ? user.name : '';
        document.getElementById('birth').value = user ? user.birth : '';
        document.getElementById('active').checked = user ? user.active : false;
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('userModal').style.display = 'flex';
    },

    closeModal() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('userModal').style.display = 'none';
    },

    
    saveUser() {
        const name = document.getElementById('name').value;
        const birth = document.getElementById('birth').value;
        const active = document.getElementById('active').checked;
    
        if (this.currentUser) {
            Object.assign(this.currentUser, { name, birth, active });
        } else {
            const maxId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) : 0;
            const newUser = {
                id: maxId + 1,
                name,
                birth,
                active
            };
            this.users.push(newUser);
        }
    
        this.closeModal();
        this.render();
        this.updateUserCount(); 
    },

    editUser(event) {
        const userId = event.target.dataset.id;
        const user = this.users.find(u => u.id == userId);
        this.openModal(user);
    },
    deleteUser(event) {
        const userId = event.target.dataset.id;
        this.users = this.users.filter(u => u.id != userId);
        this.users.forEach((user, index) => {
            user.id = index + 1;
        });
    
        this.render();
        this.updateUserCount();
    },

    openModal(user = null) {
        this.currentUser = user;
        document.getElementById('modalTitle').innerText = user ? 'Редактировать пользователя' : 'Добавить пользователя';
        document.getElementById('name').value = user ? user.name : '';
        document.getElementById('birth').value = user ? user.birth : '';
        document.getElementById('active').checked = user ? user.active : false;
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('userModal').style.display = 'flex';
    },

    toggleActiveFilter() {
        switch (this.activeFilter) {
            case 'all':
                this.activeFilter = 'active';
                break;
            case 'active':
                this.activeFilter = 'inactive';
                break;
            case 'inactive':
                this.activeFilter = 'all';
                break;
        }
        this.render();
    },


    render() {
        const userTableBody = document.getElementById('userTableBody');
        userTableBody.innerHTML = '';

        const searchValue = document.getElementById('input-search').value.toLowerCase();

        const filteredUsers = this.users.filter(user => {
            const nameMatch = user.name.toLowerCase().includes(searchValue);
            const birthMatch = user.birth.toLowerCase().includes(searchValue);

            switch (this.activeFilter) {
                case 'all':
                    return nameMatch || birthMatch;
                case 'active':
                    return (user.active && (nameMatch || birthMatch));
                case 'inactive':
                    return (!user.active && (nameMatch || birthMatch));
            }
        });

        const startIndex = (this.currentPage - 1) * this.usersPerPage;
        const endIndex = startIndex + this.usersPerPage;
        const usersToDisplay = filteredUsers.slice(startIndex, endIndex);

        usersToDisplay.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.birth}</td>
                <td>${user.active ? 'Да' : 'Нет'}</td>
                <td>
                    <button class="edit-btn" data-id="${user.id}">red</button>
                    <button class="delete-btn" data-id="${user.id}">del</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        this.renderPagination(); 
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (event) => this.editUser(event));
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (event) => this.deleteUser(event));
        });
    },

    changePage(direction) {
        this.currentPage += direction;
        this.render();
    },
    changePage(direction) {
        this.currentPage += direction;
        this.render();
    }
};

UserManager.init();

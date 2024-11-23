function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');

    if (sidebar.classList.contains('hidden')) {
        // Show sidebar
        sidebar.classList.remove('hidden');
        content.style.marginLeft = '250px'; // Adjust content margin for sidebar width
    } else {
        // Hide sidebar
        sidebar.classList.add('hidden');
        content.style.marginLeft = '0'; // Remove content margin
    }
}

function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.classList.toggle('show'); // Toggles visibility
}

function setActive(itemId) {
    const items = document.querySelectorAll('.sidebar ul li');
    items.forEach(item => item.classList.remove('active')); // Remove active class from all
    document.getElementById(itemId).classList.add('active'); // Add active class to clicked
}

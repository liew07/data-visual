function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
 
    if (sidebar.classList.contains('hidden')) {
        // Show sidebar
        sidebar.classList.remove('hidden');
        content.style.marginLeft = '250px'; // Adjust content margin for sidebar width
   
        localStorage.setItem('sidebarVisible', 'true'); // Save state in localStorage
    } else {
        // Hide sidebar
        sidebar.classList.add('hidden');
        content.style.marginLeft = '0'; // Remove content margin
        localStorage.setItem('sidebarVisible', 'false'); // Save state in localStorage
    }
}

// Ensure the sidebar's state is applied on page load
window.onload = function () {
    const sidebar = document.getElementById('sidebar');
    const content = document.querySelector('.content');
    const sidebarVisible = localStorage.getItem('sidebarVisible');

    if (sidebarVisible === 'false') {
        // Hide sidebar if previously hidden
        sidebar.classList.add('hidden');
        content.style.marginLeft = '0';
    } else {
        // Show sidebar by default
        sidebar.classList.remove('hidden');
        content.style.marginLeft = '250px';
    }
};


function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    dropdownMenu.classList.toggle('show'); // Toggles visibility
}

function setActive(itemId) {
    const items = document.querySelectorAll('.sidebar ul li');
    items.forEach(item => item.classList.remove('active')); // Remove active class from all
    document.getElementById(itemId).classList.add('active'); // Add active class to clicked
}


function setActive(sectionId) {
    // Remove 'active' class from all sidebar items
    const sidebarItems = document.querySelectorAll(".sidebar ul li");
    sidebarItems.forEach((item) => item.classList.remove("active"));

    // Add 'active' class to the selected item
    const selectedItem = document.getElementById(sectionId);
    if (selectedItem) {
        selectedItem.classList.add("active");
    }

    // Collapse the dropdown if clicking outside Project Overview
    if (sectionId !== "ict") {
        collapseDropdown("dropdown-menu");
    }
}



function collapseDropdown(dropdownId) {
    const dropdownMenu = document.getElementById(dropdownId);
    dropdownMenu.classList.add("hidden");
    dropdownMenu.classList.remove("show");
}

function navigateTo(url) {
    // Navigate to the specified URL
    window.location.href = url;
}


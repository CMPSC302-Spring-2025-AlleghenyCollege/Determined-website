/**
 * Theme toggle functionality for dark mode support
 * Manages user preferences for light/dark themes across the site
 */

// Immediately execute this function to set the theme before the page renders
// This prevents the flash of unstyled content when loading the page
(function() {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkMode = localStorage.getItem('dark_mode');
    
    if (darkMode === 'enabled' || (darkMode === null && userPrefersDark)) {
        document.documentElement.classList.add('dark-mode');
    }
})();

// Wait for DOM to load before setting up toggle listeners
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeToggleSettings = document.getElementById('darkModeToggleSettings');

    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkMode = localStorage.getItem('dark_mode');

    const enableDarkMode = () => {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('dark_mode', 'enabled');
        if (darkModeToggle) darkModeToggle.checked = true;
        if (darkModeToggleSettings) darkModeToggleSettings.checked = true;
    };

    const disableDarkMode = () => {
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('dark_mode', 'disabled');
        if (darkModeToggle) darkModeToggle.checked = false;
        if (darkModeToggleSettings) darkModeToggleSettings.checked = false;
    };

    // Initialize toggle state
    if (darkMode === 'enabled' || (darkMode === null && userPrefersDark)) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Main toggle in header
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            darkModeToggle.checked ? enableDarkMode() : disableDarkMode();
        });
    }

    // Settings page toggle
    if (darkModeToggleSettings) {
        darkModeToggleSettings.addEventListener('change', () => {
            darkModeToggleSettings.checked ? enableDarkMode() : disableDarkMode();
        });
    }
    
    // Enable transitions after page is fully loaded to prevent initial flash
    // Wait a bit to ensure all styles are applied
    setTimeout(() => {
        document.documentElement.classList.add('transition-ready');
    }, 100);
});

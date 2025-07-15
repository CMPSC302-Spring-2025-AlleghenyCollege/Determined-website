document.addEventListener('DOMContentLoaded', function () {
    const SettingsManager = {
        defaults: {
            fontSize: "medium",
            colorMode: "True",
            dyslexicFont: "false",
            ttsEnabled: "false",
            speechVolume: "0.5",
            altTextEnabled: "false"
        },

        init() {
            // Initialize default settings
            Object.entries(this.defaults).forEach(([key, value]) => {
                if (!localStorage.getItem(key)) {
                    localStorage.setItem(key, value);
                }
            });
        }
    };

    // Initialize default settings if they don't exist
    SettingsManager.init();

    // ----- Get all settings UI elements -----
    
    // Theme Controls
    const darkModeToggleSettings = document.getElementById('darkModeToggleSettings');
    
    // Color Vision Controls
    const colorButtons = {
        True: document.getElementById('True'),
        Prot: document.getElementById('Prot'),
        Deut: document.getElementById('Deut'),
        Trit: document.getElementById('Trit')
    };
    
    // Text Controls
    const dyslexicFontToggle = document.getElementById('dyslexicFontToggle');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const fontButtons = {
        'x-small': document.getElementById('x-small'),
        'small': document.getElementById('small'),
        'medium': document.getElementById('medium'),
        'large': document.getElementById('large'),
        'x-large': document.getElementById('x-large')
    };
    
    // Audio Controls
    const ttsToggle = document.getElementById('ttsToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const testSpeechButton = document.getElementById('testSpeechButton');
    
    // Alt Text Controls
    const altTextToggle = document.getElementById('altTextToggle');
    
    // Action Buttons
    const resetSettingsButton = document.getElementById('resetSettingsButton');
    const mainMenuButton = document.getElementById('mainMenuButton');
    
    // ----- Initialize UI state from localStorage -----
    initializeUIState();
    
    // ----- Event Listeners -----
    
    // Theme Controls
    if (darkModeToggleSettings) {
        darkModeToggleSettings.checked = localStorage.getItem('dark_mode') === 'enabled';
        darkModeToggleSettings.addEventListener('change', function() {
            if (darkModeToggleSettings.checked) {
                document.body.classList.add('dark-mode');
                document.documentElement.classList.add('dark-mode');
                localStorage.setItem('dark_mode', 'enabled');
                const mainToggle = document.getElementById('darkModeToggle');
                if (mainToggle) mainToggle.checked = true;
            } else {
                document.body.classList.remove('dark-mode');
                document.documentElement.classList.remove('dark-mode');
                localStorage.setItem('dark_mode', 'disabled');
                const mainToggle = document.getElementById('darkModeToggle');
                if (mainToggle) mainToggle.checked = false;
            }
        });
    }
    
    // Color Vision Controls
    Object.entries(colorButtons).forEach(([mode, button]) => {
        if (button) {
            button.addEventListener('click', function() {
                const previousMode = localStorage.getItem("colorMode") || "True";
                localStorage.setItem("colorMode", mode);
                updateColorMode(previousMode);
                updateColorButtonUI();
            });
        }
    });
    
    // Dyslexic Font Toggle
    if (dyslexicFontToggle) {
        dyslexicFontToggle.checked = localStorage.getItem("dyslexicFont") === "true";
        dyslexicFontToggle.addEventListener('change', function() {
            localStorage.setItem("dyslexicFont", dyslexicFontToggle.checked);
            changeFont();
        });
    }
    
    // Font Size Controls
    if (fontSizeSlider) {
        // Set slider based on current font size
        const currentSize = localStorage.getItem("fontSize") || "medium";
        const sizeValues = ['x-small', 'small', 'medium', 'large', 'x-large'];
        fontSizeSlider.value = sizeValues.indexOf(currentSize) + 1;
        
        fontSizeSlider.addEventListener('input', function() {
            const sizeMap = {
                "1": "x-small",
                "2": "small",
                "3": "medium",
                "4": "large",
                "5": "x-large"
            };
            const newSize = sizeMap[fontSizeSlider.value];
            const previousSize = localStorage.getItem("fontSize");
            localStorage.setItem("fontSize", newSize);
            updateFontSize(previousSize);
            updateFontButtonsUI();
        });
    }
    
    // Font Size Buttons
    Object.entries(fontButtons).forEach(([size, button]) => {
        if (button) {
            button.addEventListener('click', function() {
                const previousSize = localStorage.getItem("fontSize");
                localStorage.setItem("fontSize", size);
                updateFontSize(previousSize);
                updateFontButtonsUI();
                
                // Update slider to match
                const sizeValues = ['x-small', 'small', 'medium', 'large', 'x-large'];
                if (fontSizeSlider) {
                    fontSizeSlider.value = sizeValues.indexOf(size) + 1;
                }
            });
        }
    });
    
    // Text-to-Speech Controls
    if (ttsToggle) {
        ttsToggle.checked = localStorage.getItem('ttsEnabled') === 'true';
        ttsToggle.addEventListener('change', function() {
            const isEnabled = ttsToggle.checked;
            localStorage.setItem('ttsEnabled', isEnabled);
            
            // Update TTSController if it exists
            if (window.TTSController) {
                window.TTSController.enabled = isEnabled;
                if (isEnabled) {
                    window.TTSController.createFloatingButton();
                } else {
                    window.TTSController.removeFloatingButton();
                    if (window.TTSController.speaking) {
                        window.TTSController.stop();
                    }
                }
            }
        });
    }
    
    if (volumeSlider) {
        volumeSlider.value = localStorage.getItem('speechVolume') || 0.5;
        volumeSlider.addEventListener('input', function() {
            localStorage.setItem('speechVolume', volumeSlider.value);
            
            // Update TTSController if it exists
            if (window.TTSController) {
                window.TTSController.volume = parseFloat(volumeSlider.value);
            }
        });
    }
    
    if (testSpeechButton) {
        testSpeechButton.addEventListener('click', function() {
            if (localStorage.getItem('ttsEnabled') !== 'true') {
                alert('Please enable Text-to-Speech first.');
                return;
            }
            
            if (window.TTSController) {
                window.TTSController.testSpeech();
            }
        });
    }
    
    // Alt Text Controls
    if (altTextToggle) {
        altTextToggle.checked = localStorage.getItem('altTextEnabled') === 'true';
        altTextToggle.addEventListener('change', function() {
            const isEnabled = altTextToggle.checked;
            localStorage.setItem('altTextEnabled', isEnabled);
            
            // Update AltTextController if it exists
            if (window.AltTextController) {
                window.AltTextController.enabled = isEnabled;
                if (isEnabled) {
                    window.AltTextController.enableAltText();
                } else {
                    window.AltTextController.disableAltText();
                }
            }
            
            // Update the alt text preview in settings
            const previewImage = document.querySelector('.preview-image');
            if (previewImage) {
                if (isEnabled) {
                    previewImage.classList.add('alt-text-enabled');
                } else {
                    previewImage.classList.remove('alt-text-enabled');
                }
            }
        });
        
        // Initialize alt text preview state
        const previewImage = document.querySelector('.preview-image');
        if (previewImage && altTextToggle.checked) {
            previewImage.classList.add('alt-text-enabled');
        }
    }
    
    // Action Buttons
    if (resetSettingsButton) {
        resetSettingsButton.addEventListener('click', function() {
            if (confirm('Reset all settings to default values?')) {
                resetAllSettings();
                initializeUIState();
            }
        });
    }
    
    if (mainMenuButton) {
        mainMenuButton.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    // ----- Helper Functions -----
    
    function initializeUIState() {
        updateFontSize();
        changeFont();
        updateColorMode();
        updateColorButtonUI();
        updateFontButtonsUI();
        
        // Initialize alt text preview visibility
        const altTextExample = document.querySelector('.alt-text-example');
        if (altTextExample && altTextToggle) {
            altTextExample.style.display = altTextToggle.checked ? 'block' : 'none';
        }
    }
    
    function updateFontSize(previous) {
        const size = (localStorage.getItem("fontSize") || "medium").trim();
        
        // Remove previous class if specified
        if (previous) {
            document.body.classList.remove(previous);
        } else {
            // Remove all size classes if previous not specified
            document.body.classList.remove('x-small', 'small', 'medium', 'large', 'x-large');
        }
        
        // Add new size class
        document.body.classList.add(size);
    }
    
    function updateColorMode(previousMode) {
        const mode = (localStorage.getItem("colorMode") || "True").trim();
        
        // Remove previous mode if specified
        if (previousMode && previousMode !== mode) {
            document.documentElement.classList.remove(previousMode);
            document.body.classList.remove(previousMode);
        } else {
            // Remove all mode classes if previous not specified
            document.documentElement.classList.remove('True', 'Prot', 'Deut', 'Trit');
            document.body.classList.remove('True', 'Prot', 'Deut', 'Trit');
        }
        
        // Only add class for non-standard modes
        if (mode !== 'True') {
            document.documentElement.classList.add(mode);
            document.body.classList.add(mode);
        }
    }
    
    function changeFont() {
        const dysFontSetting = localStorage.getItem("dyslexicFont") === "true";
        
        if (dysFontSetting) {
            document.body.classList.add("dyslexicFont");
            document.documentElement.classList.add("dyslexicFont");
            if (dyslexicFontToggle) dyslexicFontToggle.checked = true;
        } else {
            document.body.classList.remove("dyslexicFont");
            document.documentElement.classList.remove("dyslexicFont");
            if (dyslexicFontToggle) dyslexicFontToggle.checked = false;
        }
    }
    
    function updateColorButtonUI() {
        const mode = localStorage.getItem("colorMode") || "True";
        
        // Reset all buttons
        Object.values(colorButtons).forEach(button => {
            if (button) button.classList.remove('clicked');
        });
        
        // Highlight active button
        const activeButton = colorButtons[mode];
        if (activeButton) activeButton.classList.add('clicked');
    }
    
    function updateFontButtonsUI() {
        const size = localStorage.getItem("fontSize") || "medium";
        
        // Reset all buttons
        Object.values(fontButtons).forEach(button => {
            if (button) button.classList.remove('clicked');
        });
        
        // Highlight active button
        const activeButton = fontButtons[size];
        if (activeButton) activeButton.classList.add('clicked');
    }
    
    function resetAllSettings() {
        // Reset to defaults
        Object.entries(SettingsManager.defaults).forEach(([key, value]) => {
            localStorage.setItem(key, value);
        });
        
        // Handle dark mode separately
        localStorage.setItem('dark_mode', 'disabled');
        
        // Apply defaults
        updateFontSize();
        changeFont();
        updateColorMode();
        
        // Update UI
        if (darkModeToggleSettings) darkModeToggleSettings.checked = false;
        if (dyslexicFontToggle) dyslexicFontToggle.checked = false;
        if (ttsToggle) ttsToggle.checked = false;
        if (altTextToggle) altTextToggle.checked = false;
        if (volumeSlider) volumeSlider.value = 0.5;
        if (fontSizeSlider) fontSizeSlider.value = 3; // medium
        
        // Update controllers
        if (window.TTSController) {
            window.TTSController.enabled = false;
            window.TTSController.removeFloatingButton();
            if (window.TTSController.speaking) {
                window.TTSController.stop();
            }
        }
        
        if (window.AltTextController) {
            window.AltTextController.enabled = false;
            window.AltTextController.disableAltText();
        }
        
        // Remove dark mode classes
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
        
        // Update button UI
        updateColorButtonUI();
        updateFontButtonsUI();
        
        // Update main toggle
        const mainToggle = document.getElementById('darkModeToggle');
        if (mainToggle) mainToggle.checked = false;
    }
});

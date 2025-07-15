// global-tts.js - include in all website pages

// TTS Controller
const TTSController = {
    synth: window.speechSynthesis,
    speaking: false, // CHANGED FROM TRUE TO FALSE
    enabled: false,
    volume: 0.5,
    utterance: null,
    floatingButton: null,

    // Initialize TTS from localStorage settings
    init: function () {
        this.enabled = localStorage.getItem('ttsEnabled') === 'true';
        this.volume = parseFloat(localStorage.getItem('speechVolume') || 0.5);

        // Set up TTS toggle and button if present
        const ttsToggle = document.getElementById('ttsToggle');
        const readTextButton = document.getElementById('readTextButton');
        const volumeSlider = document.getElementById('volumeSlider');

        if (ttsToggle) {
            // Initialize toggle state
            ttsToggle.checked = this.enabled;

            // Listen for toggle changes
            ttsToggle.addEventListener('change', () => {
                this.enabled = ttsToggle.checked;
                localStorage.setItem('ttsEnabled', this.enabled);
                
                // Create or remove floating button when toggled
                if (this.enabled) {
                    this.createFloatingButton();
                } else {
                    this.removeFloatingButton();
                    if (this.speaking) {
                        this.stop();
                    }
                }
            });
        }

        if (volumeSlider) {
            // Initialize volume slider
            volumeSlider.value = this.volume;
            
            // Listen for volume changes
            volumeSlider.addEventListener('input', () => {
                this.volume = parseFloat(volumeSlider.value);
                localStorage.setItem('speechVolume', this.volume);
                
                // Update current utterance if speaking
                if (this.speaking && this.utterance) {
                    this.utterance.volume = this.volume;
                }
            });
        }

        if (readTextButton) {
            // Handle "Read Aloud" button click
            readTextButton.addEventListener('click', () => {
                if (!this.enabled) {
                    alert('Please enable Text-to-Speech first.');
                    return;
                }

                if (this.speaking) {
                    this.stop();
                    readTextButton.textContent = 'Read Aloud';
                } else {
                    const textToRead = document.querySelector('main').innerText;
                    this.speak(textToRead);
                    readTextButton.textContent = 'Stop Reading';
                }
            });
        }

        // Add floating button if TTS is enabled
        if (this.enabled) {
            this.createFloatingButton();
        }

        // Listen for selection changes on document
        document.addEventListener('selectionchange', () => {
            if (this.enabled && this.floatingButton) {
                const selection = window.getSelection();
                if (selection && selection.toString().trim() !== '') {
                    this.floatingButton.textContent = 'Read Selected';
                } else {
                    this.floatingButton.textContent = 'Read Page';
                }
            }
        });
    },

    // Create floating button for TTS
    createFloatingButton: function() {
        if (this.floatingButton) {
            this.floatingButton.style.display = 'flex';
            return;
        }

        // Create the button with minimal styling in JS
        this.floatingButton = document.createElement('button');
        this.floatingButton.id = 'floating-tts-button';
        this.floatingButton.textContent = 'Read Page';
        
        // Add functionality
        this.floatingButton.addEventListener('click', () => {
            this.handleFloatingButtonClick();
        });
        
        // Add to document
        document.body.appendChild(this.floatingButton);
    },
    
    // Handle floating button click
    handleFloatingButtonClick: function() {
        if (this.speaking) {
            this.stop();
            this.floatingButton.textContent = 'Read Page';
            return;
        }
        
        const selection = window.getSelection();
        let textToRead = '';
        
        if (selection && selection.toString().trim() !== '') {
            // Read selected text
            textToRead = selection.toString();
            console.log("Selected text to read:", textToRead);
            this.floatingButton.textContent = 'Stop Reading';
        } else {
            // Read all page content - use a simple approach
            const mainElement = document.querySelector('main');
            
            // Fallback to a test message if no content is found
            if (mainElement && mainElement.innerText.trim().length > 10) {
                textToRead = mainElement.innerText;
            } else {
                textToRead = "This is a test of the text to speech system. If you can hear this, it is working correctly.";
            }
            
            this.floatingButton.textContent = 'Stop Reading';
        }
        
        // Use the direct method that we know works
        const success = this.speak(textToRead);
        
        if (!success) {
            this.floatingButton.textContent = 'Read Page';
            alert("Failed to start text-to-speech. Check console for details.");
        }
    },
    
    // Remove floating button
    removeFloatingButton: function() {
        if (this.floatingButton) {
            this.floatingButton.style.display = 'none';
        }
    },

    // Read text aloud
    speak: function (text) {
        if (!this.enabled) {
            console.log("TTS is disabled");
            return false;
        }

        // Check if speech synthesis is supported
        if (!window.speechSynthesis) {
            console.error("Speech synthesis not supported in this browser");
            alert("Text-to-speech is not supported in your browser");
            return false;
        }

        // Cancel any ongoing speech
        if (this.speaking) {
            this.stop();
        }

        try {
            // Use the direct approach that worked in the emergency test
            const msg = new SpeechSynthesisUtterance(text);
            msg.volume = this.volume;
            msg.rate = 1.0;   // Normal rate
            msg.pitch = 1.0;  // Normal pitch
            msg.lang = 'en-US';
            
            // Log before speaking
            console.log("🔊 Speaking text:", text.substring(0, 50) + "...");
            
            // Set up event handlers
            msg.onend = () => {
                console.log("Speech finished");
                this.speaking = false;
                
                // Reset buttons
                const readTextButton = document.getElementById('readTextButton');
                if (readTextButton) {
                    readTextButton.textContent = 'Read Aloud';
                }
                
                if (this.floatingButton) {
                    this.floatingButton.textContent = 'Read Page';
                }
            };
            
            msg.onerror = (event) => {
                console.error("Speech synthesis error:", event);
                this.speaking = false;
                if (this.floatingButton) {
                    this.floatingButton.textContent = 'Read Page';
                }
            };
            
            // Store the utterance
            this.utterance = msg;
            
            // Cancel any previous speech and speak the new text
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(msg);
            this.speaking = true;
            
            // Handle Chrome bug with resume
            setTimeout(() => {
                if (window.speechSynthesis.paused) {
                    console.log("Speech was paused, forcing resume");
                    window.speechSynthesis.resume();
                }
            }, 100);
            
            return true;
        } catch (error) {
            console.error("Error initializing speech:", error);
            return false;
        }
    },

    // Stop current speech
    stop: function () {
        if (this.speaking) {
            this.synth.cancel();
            this.speaking = false;
        }
    },
    
    // Toggle TTS on/off
    toggle: function() {
        this.enabled = !this.enabled;
        localStorage.setItem('ttsEnabled', this.enabled);
        
        // If turning off while speaking, stop speech
        if (!this.enabled && this.speaking) {
            this.stop();
        }
        
        // Show/hide floating button
        if (this.enabled) {
            this.createFloatingButton();
        } else {
            this.removeFloatingButton();
        }
        
        // Update the toggle button if it exists
        const ttsToggle = document.getElementById('ttsToggle');
        if (ttsToggle) {
            ttsToggle.checked = this.enabled;
        }
        
        return this.enabled;
    },

    // Simple test function for speech
    testSpeech: function() {
        try {
            // Cancel any current speech
            window.speechSynthesis.cancel();
            
            // Create a simple test utterance
            const testUtterance = new SpeechSynthesisUtterance("Testing speech synthesis. Can you hear this?");
            
            // Set language explicitly
            testUtterance.lang = 'en-US';
            
            // Log and speak
            console.log("Testing speech with simple utterance");
            window.speechSynthesis.speak(testUtterance);
            
            // For Chrome bug
            setTimeout(() => {
                if (window.speechSynthesis.paused) {
                    console.log("Speech synthesis was paused, resuming...");
                    window.speechSynthesis.resume();
                }
            }, 100);
            
            return true;
        } catch (error) {
            console.error("Speech test failed:", error);
            return false;
        }
    }
};

// Initialize TTS when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    TTSController.init();
});

// Make controller globally available
window.TTSController = TTSController;
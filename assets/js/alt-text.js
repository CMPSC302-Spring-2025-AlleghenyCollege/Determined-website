// global-alt-text.js - include this on all your website pages

// Alt Text Controller
const AltTextController = {
  enabled: false,

  // initialize Alt Text functionality from localStorage settings
  init: function () {
    this.enabled = localStorage.getItem('altTextEnabled') === 'true';

    // Set up Alt Text toggle if present
    const altTextToggle = document.getElementById('altTextToggle');
    if (altTextToggle) {
      altTextToggle.checked = this.enabled;
      
      // Listen for toggle changes
      altTextToggle.addEventListener('change', () => {
        this.enabled = altTextToggle.checked;
        localStorage.setItem('altTextEnabled', this.enabled);
        
        if (this.enabled) {
          this.enableAltText();
        } else {
          this.disableAltText();
        }
      });
    }

    // apply alt text visibility based on current setting
    if (this.enabled) {
      this.enableAltText();
    }

    // listen for changes to Alt Text settings
    window.addEventListener('storage', function (e) {
      if (e.key === 'altTextEnabled') {
        AltTextController.enabled = e.newValue === 'true';
        if (AltTextController.enabled) {
          AltTextController.enableAltText();
        } else {
          AltTextController.disableAltText();
        }
      }
    });
  },

  // Toggle alt text on/off
  toggle: function() {
    this.enabled = !this.enabled;
    localStorage.setItem('altTextEnabled', this.enabled);
    
    if (this.enabled) {
      this.enableAltText();
    } else {
      this.disableAltText();
    }
    
    // Update toggle in UI
    const altTextToggle = document.getElementById('altTextToggle');
    if (altTextToggle) {
      altTextToggle.checked = this.enabled;
    }
    
    return this.enabled;
  },

  // enable alt text display across the site
  enableAltText: function () {
    // find all images on the page
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      // skip if alt text display already exists
      if (img.nextElementSibling && img.nextElementSibling.classList.contains('alt-text-display')) {
        img.nextElementSibling.style.display = 'block';
        return;
      }

      // get alt text (if exists)
      const altText = img.getAttribute('alt');

      // only proceed if there's meaningful alt text
      if (altText && altText.trim() !== '' && altText !== 'image') {
        // create container for image and alt text
        const container = document.createElement('div');
        container.className = 'alt-text-container';
        container.style.position = 'relative';
        container.style.display = 'inline-block';

        // move img into container
        const parent = img.parentNode;
        parent.insertBefore(container, img);
        container.appendChild(img);

        // create alt text display element
        const altTextDisplay = document.createElement('div');
        altTextDisplay.className = 'alt-text-display';
        altTextDisplay.textContent = altText;

        // add to container
        container.appendChild(altTextDisplay);
      }

      // handle images without alt text but with title
      else if (img.getAttribute('title') && img.getAttribute('title').trim() !== '') {
        const titleText = img.getAttribute('title');

        // create container for image and title text
        const container = document.createElement('div');
        container.className = 'alt-text-container';
        container.style.position = 'relative';
        container.style.display = 'inline-block';

        // move img into container
        const parent = img.parentNode;
        parent.insertBefore(container, img);
        container.appendChild(img);

        // create title text display element
        const titleDisplay = document.createElement('div');
        titleDisplay.className = 'alt-text-display';
        titleDisplay.textContent = titleText;

        // add to container
        container.appendChild(titleDisplay);

        // add missing alt text for accessibility
        img.setAttribute('alt', titleText);
      }

      // for images without alt text or title, add a warning
      else if (this.enabled) {
        // create container
        const container = document.createElement('div');
        container.className = 'alt-text-container';
        container.style.position = 'relative';
        container.style.display = 'inline-block';

        // move img into container
        const parent = img.parentNode;
        parent.insertBefore(container, img);
        container.appendChild(img);

        // create warning display
        const warningDisplay = document.createElement('div');
        warningDisplay.className = 'alt-text-display alt-text-warning';
        warningDisplay.textContent = 'No alt text provided for this image';

        // add custom style for warning
        warningDisplay.style.borderLeftColor = '#ff6b6b';
        warningDisplay.style.color = '#ff6b6b';

        // add to container
        container.appendChild(warningDisplay);
      }
    });

    // also process SVG elements which often don't have alt text
    const svgs = document.querySelectorAll('svg:not(.alt-text-processed)');
    svgs.forEach(svg => {
      // mark as processed
      svg.classList.add('alt-text-processed');

      const title = svg.querySelector('title');
      const desc = svg.querySelector('desc');

      // if SVG has title or description, display it
      if ((title && title.textContent.trim() !== '') ||
        (desc && desc.textContent.trim() !== '')) {

        // create container
        const container = document.createElement('div');
        container.className = 'alt-text-container';
        container.style.position = 'relative';
        container.style.display = 'inline-block';

        // move SVG into container
        const parent = svg.parentNode;
        parent.insertBefore(container, svg);
        container.appendChild(svg);

        // create alt text display
        const svgAltText = document.createElement('div');
        svgAltText.className = 'alt-text-display';

        // get text from title or desc
        let displayText = '';
        if (title && title.textContent.trim() !== '') {
          displayText = title.textContent;
        }
        if (desc && desc.textContent.trim() !== '') {
          displayText = displayText ? `${displayText}: ${desc.textContent}` : desc.textContent;
        }

        svgAltText.textContent = displayText;

        // add to container
        container.appendChild(svgAltText);
      }
    });
  },

  // disable alt text display across the site
  disableAltText: function () {
    const altTextDisplays = document.querySelectorAll('.alt-text-display');
    altTextDisplays.forEach(display => {
      display.style.display = 'none';
    });
  },

  // method to be called when new content is loaded dynamically
  refreshAltText: function () {
    if (this.enabled) {
      this.enableAltText();
    } else {
      this.disableAltText();
    }
  }
};

// initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  AltTextController.init();
});

// add event listener for dynamic content
// this can be customized based on how your site loads content
document.addEventListener('contentLoaded', function () {
  AltTextController.refreshAltText();
});

// Make controller globally available
window.AltTextController = AltTextController;
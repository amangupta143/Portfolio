// Get the load more button
const loadMoreButton = document.querySelector('.load-more');

// Check if we're on the blog or project page and set appropriate selector
const isBlogPage = document.querySelector('.lg\\:col-4.init-delay') !== null;
const isProjectPage = document.querySelector('.lg\\:col-4 [data-aos]') !== null;

// Set the appropriate selector based on the page type
let items;
if (isBlogPage) {
    items = document.querySelectorAll('.lg\\:col-4.init-delay');
} else if (isProjectPage) {
    items = document.querySelectorAll('.lg\\:col-4');
}

const postsPerPage = 6;
const addOnLoad = 3;
let currentlyShown = postsPerPage;

// Initially hide all items beyond the first 6
if (items) {
    items.forEach((item, index) => {
        if (index >= postsPerPage) {
            item.style.display = 'none';
        }
    });
}

// Function to handle blog animations
function setupBlogAnimations(item, index) {
    // Remove the item from view initially
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    // Calculate delays based on position
    const positionInBatch = index % postsPerPage;
    const lgDelay = (positionInBatch % 3) * 75;
    const mdDelay = Math.floor(positionInBatch / 2) * 75;
    const smDelay = (positionInBatch % 2) * 75;

    // Set the delays
    item.style.setProperty('--lg-delay', `${lgDelay}ms`);
    item.style.setProperty('--md-delay', `${mdDelay}ms`);
    item.style.setProperty('--sm-delay', `${smDelay}ms`);

    // Reset AOS attributes
    item.setAttribute('data-aos', 'fade-up-sm');
    item.setAttribute('data-aos-duration', '500');
    
    // Trigger animation after a small delay
    setTimeout(() => {
        item.style.transition = 'opacity 500ms ease, transform 500ms ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, lgDelay + 100); // Add 100ms base delay
}

// Function to handle project animations
function setupProjectAnimations(item, index) {
    const projectItem = item.querySelector('[data-aos]');
    if (projectItem) {
        const delay = (index % postsPerPage) * 1;
        projectItem.setAttribute('data-aos-delay', delay);
        
        const overlaySpan = item.querySelector('span.absolute.h-full');
        if (overlaySpan) {
            overlaySpan.style.transitionDelay = `${delay}ms`;
            overlaySpan.style.height = '100%';
            setTimeout(() => {
                overlaySpan.style.height = '0';
            }, 50);
        }
    }
}

// Handle load more button click
if (loadMoreButton && items) {
    loadMoreButton.addEventListener('click', () => {
        // Show next batch of items
        for (let i = currentlyShown; i < currentlyShown + addOnLoad && i < items.length; i++) {
            const item = items[i];
            item.style.display = 'block';
            
            if (isBlogPage) {
                setupBlogAnimations(item, i);
            } else if (isProjectPage) {
                setupProjectAnimations(item, i);
            }
        }
        
        // Refresh AOS animations for both types
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        }
        
        // Update counter
        currentlyShown += postsPerPage;
        
        // Hide button if all items are shown
        if (currentlyShown >= items.length) {
            loadMoreButton.style.display = 'none';
        }
    });

    // Hide load more button initially if there are 6 or fewer items
    if (items.length <= postsPerPage) {
        loadMoreButton.style.display = 'none';
    }
}
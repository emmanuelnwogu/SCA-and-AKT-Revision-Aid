// script.js

document.addEventListener('DOMContentLoaded', function() {
        const searchBox = document.getElementById('searchBox');
        const searchButton = document.getElementById('searchButton');
        const searchInfo = document.getElementById('searchInfo');
        let currentHighlightIndex = 0;
        let highlightedElements = [];
    
        searchButton.addEventListener('click', function() {
            performSearch();
        });
    
        searchBox.addEventListener('input', function() {
            performSearch();
        });
    
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' && highlightedElements.length > 0) {
                navigateHighlights((currentHighlightIndex + 1) % highlightedElements.length);
            }
        });
    
        function performSearch() {
            const searchText = searchBox.value.trim().toLowerCase();
            if (searchText) {
                highlightText(document.body, searchText);
                if (highlightedElements.length > 0) {
                    searchInfo.textContent = `Found ${highlightedElements.length} instances of "${searchText}". Use 'Enter' to navigate.`;
                    navigateHighlights(0);
                } else {
                    searchInfo.textContent = `No instances of "${searchText}" found.`;
                }
            } else {
                removeHighlights(document.body);
            }
        }
    
        function highlightText(element, searchText) {
            removeHighlights(document.body);
    
            const regex = new RegExp(`(${searchText}).*`, 'gi'); // Match partial word matches
            traverseAndHighlight(element, regex);
    
            currentHighlightIndex = 0;
            highlightedElements = Array.from(document.querySelectorAll('.highlight'));
        }
    
        function traverseAndHighlight(element, regex) {
            if (element.nodeType === Node.TEXT_NODE) {
                const matches = element.textContent.match(regex);
                if (matches) {
                    const parent = element.parentNode;
                    const fragment = document.createDocumentFragment();
    
                    let lastIndex = 0;
                    matches.forEach(match => {
                        const index = element.textContent.indexOf(match, lastIndex);
                        fragment.appendChild(document.createTextNode(element.textContent.slice(lastIndex, index)));
    
                        const span = document.createElement('span');
                        span.className = 'highlight';
                        span.textContent = match;
                        fragment.appendChild(span);
    
                        lastIndex = index + match.length;
                    });
    
                    fragment.appendChild(document.createTextNode(element.textContent.slice(lastIndex)));
                    parent.replaceChild(fragment, element);
                }
            } else if (element.nodeType === Node.ELEMENT_NODE) {
                element.childNodes.forEach(child => traverseAndHighlight(child, regex));
            }
        }
    
        function removeHighlights(element) {
            element.querySelectorAll('.highlight').forEach(span => {
                span.replaceWith(document.createTextNode(span.textContent));
            });
            highlightedElements = [];
            searchInfo.textContent = '';
        }
    
        function navigateHighlights(index) {
            if (highlightedElements.length > 0) {
                highlightedElements[currentHighlightIndex].classList.remove('current');
                currentHighlightIndex = index;
                highlightedElements[currentHighlightIndex].classList.add('current');
                highlightedElements[currentHighlightIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
});
    
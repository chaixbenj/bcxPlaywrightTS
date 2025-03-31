function levenshteinDistance(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
}

function safeToLowerCase(value) {
    return String(value || "").toLowerCase(); // Convertit en chaîne et applique toLowerCase
}

function getNearbyText(element) {
    const nearbyText = [];
    if (element.textContent) {
        nearbyText.push(element.textContent.trim());
    }
    const parent = element.closest('label, div, span, td');
    if (parent && parent.textContent) {
        nearbyText.push(parent.textContent.trim());
    }
    const previousSibling = element.previousElementSibling;
    if (previousSibling && previousSibling.textContent) {
        nearbyText.push(previousSibling.textContent.trim());
    }
    const nextSibling = element.nextElementSibling;
    if (nextSibling && nextSibling.textContent) {
        nearbyText.push(nextSibling.textContent.trim());
    }
    return nearbyText.filter(text => !!text); // Filtrer les valeurs vides
}

function findClosestElementByText(searchText) {
    const allElements = document.querySelectorAll('{ELEMENT_TYPES}');
    const visibleElements = Array.from(allElements).filter(element => {
        const style = window.getComputedStyle(element);
        return (
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            element.offsetParent !== null
        );
    });

    const matches = [];

    visibleElements.forEach(input => {
        const attributesToCheck = [
            input.getAttribute('id'),
            input.getAttribute('name'),
            input.getAttribute('placeholder'),
            input.getAttribute('data-qa'),
            input.getAttribute('data-test-id'),
            input.getAttribute('aria-label'),
            input.getAttribute('title'),
            input.getAttribute('href'),
        ];

        attributesToCheck.forEach(attr => {
            const distance = levenshteinDistance(
                safeToLowerCase(searchText),
                safeToLowerCase(attr) // Utilisation de safeToLowerCase
            );
            if (distance <= 100) {
                matches.push({ input, distance, source: 'attribute', value: attr });
            }
        });

        const nearbyText = getNearbyText(input);
        nearbyText.forEach(text => {
            const distance = levenshteinDistance(
                safeToLowerCase(searchText),
                safeToLowerCase(text) // Utilisation de safeToLowerCase
            );
            if (distance <= 100) {
                matches.push({ input, distance, source: 'nearby', value: text });
            }
        });
    });

    matches.sort((a, b) => a.distance - b.distance);
    return matches.length > 0 ? matches[0].input : null;
}

//return findClosestInputByText(arguments[0], 100);

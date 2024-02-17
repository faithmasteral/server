
async function removeDuplicates(queryResult, fieldsToCheck) {
    // Discover unique key-value pairs
    const keyPairs = discoverKeyPairs(queryResult, fieldsToCheck);

    // Remove duplicates based on discovered key-value pairs
    const uniqueResult = removeDuplicatesRecursive(queryResult, keyPairs);

    return uniqueResult;
}

function discoverKeyPairs(array, fields) {
    const keyPairs = [];
    const seenPairs = new Set();

    array.forEach(obj => {
        fields.forEach(field => {
            const value = obj[field];
            const pair = { field, value };
            const pairString = JSON.stringify(pair);

            if (!seenPairs.has(pairString)) {
                keyPairs.push(pair);
                seenPairs.add(pairString);
            }
        });
    });

    return keyPairs;
}

function removeDuplicatesRecursive(array, keyPairs) {
    const seen = new Set();
    return array.filter(obj => {
        const key = keyPairs.map(pair => {
            if (Array.isArray(pair)) {
                return removeDuplicatesRecursive([obj], pair).map(o => Object.values(o).join('|')).join(',');
            } else {
                return obj[pair.field] + '|' + obj[pair.value];
            }
        }).join(',');

        if (seen.has(key)) {
            return false; // Duplicate, filter it out
        }
        seen.add(key);
        return true; // Not a duplicate, keep it
    });
}

module.exports = {
    removeDuplicates
};

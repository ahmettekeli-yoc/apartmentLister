function arrayItemDiffChecker(arr1, arr2) {
    let diff = [];
    for (let i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) === -1) {
            diff.push(arr1[i]);
        }
    }
    return diff;
}

function arrayConcat(arr1, arr2) {
    let concat = arr1.concat(arr2);
    return concat;
}

function isObjectEqual(obj1, obj2) {
    for (let key in obj1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }
    return true;
}

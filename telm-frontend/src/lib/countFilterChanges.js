function countChangedValues(object1, object2) {
    let count = 0;

    for (const key in object1) {
        if (object1[key] !== object2[key]) {
            count++;
        }
    }

    return count;
}

export default countChangedValues
/**
 * This runs a sequence of asynchronous functions, one after the other.
 * @param {*} items 
 * @param {*} consumer 
 * @returns 
 */
export default function sequence(items, consumer) {
    const results = [];
    const iterator = items.values();
    let index = 0;
    const runner = function() {
        const item = iterator.next().value;
        if (item) {
            index++;
            return consumer(item, index)
                .then(function(result) {
                    results.push(result);
                })
                .then(runner);
        }
        return Promise.resolve(results);
    };
    return runner();
};

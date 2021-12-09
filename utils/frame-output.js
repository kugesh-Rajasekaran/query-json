function frameOutput(resultObj) {
    return `
    *** RESULT ***
    ${
        iterateArr(resultObj).join('')
    }
    **************
    `;
}

const iterateArr = (resultObj) => {
    let itr = 1;
    return resultObj.map((v) => `
    ${itr++} [seq-no]       ${v.name} [name]        ${v.size} [size(bytes)]        ${v.isFieldValExist} [is-given-value-found]     ${v.isConditionsSatisfied} [is-given-conditions-satisfied]
    `);
}

module.exports = frameOutput;
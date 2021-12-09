function frameOutput(resultObj) {
    return `
    ${
        iterateArr(resultObj).join('')
    }
    `;
}

const iterateArr = (resultObj) => {
    let itr = 1;
    return resultObj.map((v) => `
    ${itr++} [seq-no]       ${v.name} [name]        ${v.size} [size]        ${v.isFieldValExist} [is-given-value-found]     ${v.isConditionsSatisfied} [is-given-condition-satisfied]
    `);
}

module.exports = frameOutput;
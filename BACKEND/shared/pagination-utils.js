exports.preparePagination = (query) => {
    const permitedQueryParams = ['limit', 'page'];

    var displayParameters = Object.fromEntries(
        Object.entries(query)
            .filter(([key]) => permitedQueryParams.includes(key))
    )

    if (!displayParameters?.limit) {
        displayParameters.limit = 10;
    }
    if (!displayParameters?.page || displayParameters.page < 1) {
        displayParameters.page = 1;
    }

    return displayParameters;
}

exports.prepareSort = (query) => {
    if (!query.sort) {
        return {};
    }

    let sort = {};
    let sortSplit = query.sort.split(':');
    sort[sortSplit[0]] = sortSplit[1];

    return sort;
}

exports.prepareFilter = (query, model) => {
    const properties = Object.keys(model.schema.paths)
        .filter(p => !['_id', '__v'].includes(p));

    var filter = Object.fromEntries(
        Object.entries(query)
            .filter(([key]) => properties.includes(key))
    );

    var finalFilter = {};
    for (const [field, condition] of Object.entries(filter)) {
        if (typeof condition === 'object'
            && condition != null
        ) {
            let newFilter = {};
            for (const [op, value] of Object.entries(condition)) {
                let newCondition = '$' + op;
                newFilter[newCondition] = value;
            }
            finalFilter[field] = newFilter;
        }
        else {
            finalFilter[field] = condition;
        }
    }
    return finalFilter;
}

// Filtragem e ordenação do feed feita em be. func traduz os params que o user escolheu para query no be

export const EMPTY_FILTERS = {
    search: '',
    category: '',
    postType: '',
    priceMin: '',
    priceMax: '',
    viewsMin: '',
    viewsMax: '',
    sort: 'createdAt:desc',
};

export const SORT_OPTIONS = [
    { value: 'createdAt:desc', label: 'Most recent' },
    { value: 'createdAt:asc', label: 'Oldest' },
    { value: 'price:asc', label: 'Price (lowest first)' },
    { value: 'price:desc', label: 'Price (highest first)' },
    { value: 'views:desc', label: 'Most viewed' },
    { value: 'title:asc', label: 'Title (A → Z)' },
];

export function buildPostQuery(filters) {
    const params = { sort: filters.sort };

    if (filters.search) params.search = filters.search;

    if (filters.category) params.category = filters.category;
    if (filters.postType) params.postType = filters.postType;
    if (filters.priceMin !== '') params['price[gte]'] = filters.priceMin;
    if (filters.priceMax !== '') params['price[lte]'] = filters.priceMax;
    if (filters.viewsMin !== '') params['views[gte]'] = filters.viewsMin;
    if (filters.viewsMax !== '') params['views[lte]'] = filters.viewsMax;

    return params;
}

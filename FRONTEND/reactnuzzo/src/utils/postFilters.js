// Filtragem e ordenação do feed de Posts.
// Nota: quando a listagem passar a vir paginada do backend, estas funções
// deixam de ser necessárias no cliente — ficam prontas para uso local
// (ex.: "My Posts", "Favorites"), onde as listas são pequenas.

export const DEFAULT_SORT = 'date_desc';

export const EMPTY_FILTERS = {
    search: '',      // filtro de texto (título/categoria)
    priceMin: '',    // 1.º intervalo numérico
    priceMax: '',
    viewsMin: '',    // 2.º intervalo numérico
    viewsMax: '',
    type: '',
    sortBy: DEFAULT_SORT,
};

export const SORT_OPTIONS = [
    { value: 'date_desc', label: 'Most recent' },
    { value: 'date_asc', label: 'Oldest' },
    { value: 'price_asc', label: 'Price (ascending)' },
    { value: 'price_desc', label: 'Price (descending)' },
    { value: 'views_desc', label: 'Most viewed' },
    { value: 'title_asc', label: 'Title (A → Z)' },
];

function matchesFilters(post, filters) {
    const { search, priceMin, priceMax, viewsMin, viewsMax, type } = filters;

    if (search && search.trim() !== '') {
        const term = search.trim().toLowerCase();
        const haystack = [post.title, post.category].filter(Boolean).join(' ').toLowerCase();
        if (!haystack.includes(term)) return false;
    }

    if (type && post.type !== type) return false;

    const price = post.price !== null && post.price !== undefined ? Number(post.price) : null;
    if (priceMin !== '' && (price === null || price < Number(priceMin))) return false;
    if (priceMax !== '' && (price === null || price > Number(priceMax))) return false;

    const views = Number(post.views) || 0;
    if (viewsMin !== '' && views < Number(viewsMin)) return false;
    if (viewsMax !== '' && views > Number(viewsMax)) return false;

    return true;
}

function comparePosts(a, b, sortBy) {
    switch (sortBy) {
        case 'date_asc':
            return new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0);
        case 'price_asc':
            return (Number(a.price) || 0) - (Number(b.price) || 0);
        case 'price_desc':
            return (Number(b.price) || 0) - (Number(a.price) || 0);
        case 'views_desc':
            return (Number(b.views) || 0) - (Number(a.views) || 0);
        case 'title_asc':
            return (a.title || '').localeCompare(b.title || '');
        case 'date_desc':
        default:
            return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
    }
}

export function filterAndSortPosts(posts, filters) {
    const merged = { ...EMPTY_FILTERS, ...filters };
    return posts
        .filter((post) => matchesFilters(post, merged))
        .sort((a, b) => comparePosts(a, b, merged.sortBy));
}

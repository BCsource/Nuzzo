import { POST_TYPE_LABELS } from './postOptions';

export function postTypeLabel(postType) {
    return POST_TYPE_LABELS[postType] || postType;
}

export function formatPrice(price) {
    if (price === null || price === undefined || price === '') return '—';
    return `${Number(price).toFixed(2)} €`;
}

export function formatDate(value, withTime = false) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return withTime ? date.toLocaleString('pt-PT') : date.toLocaleDateString('pt-PT');
}

// para descrições grandes

export function truncateText(text, maxLength = 160) {
    if (!text || text.length <= maxLength) return text || '';
    const cut = text.slice(0, maxLength);
    const lastSpace = cut.lastIndexOf(' ');
    return `${lastSpace > 0 ? cut.slice(0, lastSpace) : cut}…`;
}

// Conta disabled/softdelete
export function authorLabel(author) {
    if (!author) return 'Removed user';
    return `${author.fName || ''} ${author.lName || ''}`.trim() || 'User';
}


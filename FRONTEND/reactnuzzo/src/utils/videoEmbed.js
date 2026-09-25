
export function getVideoEmbedUrl(videoUrl) {
    if (!videoUrl) {
        return null;
    }

    // youtube.com/watch?v=ID
    if (videoUrl.includes('youtube.com/watch')) {
        const id = videoUrl.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${id}`;
    }
    // youtu.be/ID
    if (videoUrl.includes('youtu.be/')) {
        const id = videoUrl.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${id}`;
    }
    // vimeo.com/ID
    if (videoUrl.includes('vimeo.com/')) {
        const id = videoUrl.split('vimeo.com/')[1].split('?')[0];
        return `https://player.vimeo.com/video/${id}`;
    }

    return null;
}

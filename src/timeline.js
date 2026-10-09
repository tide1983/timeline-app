import { format } from 'date-fns';
import { icons } from './icons.js';

export class Timeline {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.posts = [];
    }

    addPost(type, content, coords) {
        const post = {
            id: Date.now() + Math.random(),
            type,
            content,
            coords,
            timestamp: new Date(),
        };
        this.posts.push(post);
        this.renderPost(post);
    }

    renderPost(post) {
        const el = document.createElement('div');
        el.className = `post post-${post.type}`;

        const timeStr = format(post.timestamp, 'dd.MM.yy HH:mm');
        const coordStr = `[${post.coords.latitude.toFixed(5)}, ${post.coords.longitude.toFixed(5)}]`;

        let contentHtml = '';

        if (post.type === 'text') {
            contentHtml = `<p class="post-text">${escapeHtml(post.content)}</p>`;
        } else if (post.type === 'audio') {
            contentHtml = `<audio controls src="${post.content}"></audio>`;
        } else if (post.type === 'video') {
            contentHtml = `<video controls src="${post.content}"></video>`;
        }

        el.innerHTML = `
            <div class="post-header">
                <span class="post-time">${timeStr}</span>
            </div>
            <div class="post-body">
                ${contentHtml}
            </div>
            <div class="post-footer">
                <span class="post-coords">${coordStr}</span>
                <span class="post-eye">${icons.eye}</span>
            </div>
        `;

        // Добавляем сверху — новые посты выше старых
        this.container.prepend(el);
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
import './style.css';
import { icons } from './icons.js';
import { Timeline } from './timeline.js';
import { getCoordinates } from './geolocation.js';
import { startRecording } from './recorder.js';

// ==== Инициализация ====
const timeline = new Timeline('timeline');

// Вставляем SVG-иконки в кнопки
document.getElementById('mic-btn').innerHTML = icons.mic;
document.getElementById('cam-btn').innerHTML = icons.camera;
document.getElementById('rec-ok').innerHTML = icons.check;
document.getElementById('rec-cancel').innerHTML = icons.close;

// ==== Текстовые посты ====
const textInput = document.getElementById('text-input');

textInput.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;

    const text = textInput.value.trim();
    if (!text) return;

    textInput.value = '';
    textInput.disabled = true;

    try {
        const coords = await getCoordinates();
        timeline.addPost('text', text, coords);
    } catch (err) {
        console.log('Текстовый пост отменён:', err.message);
    } finally {
        textInput.disabled = false;
        textInput.focus();
    }
});

// ==== Аудио ====
document.getElementById('mic-btn').addEventListener('click', () => {
    startRecording('audio', (type, url, coords) => {
        timeline.addPost(type, url, coords);
    });
});

// ==== Видео ====
document.getElementById('cam-btn').addEventListener('click', () => {
    startRecording('video', (type, url, coords) => {
        timeline.addPost(type, url, coords);
    });
});
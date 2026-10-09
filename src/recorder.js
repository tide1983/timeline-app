import { icons } from './icons.js';
import { getCoordinates } from './geolocation.js';

/**
 * @param {'audio'|'video'} type
 * @param {(type: string, url: string, coords: object) => void} onFinish
 */
export async function startRecording(type, onFinish) {
    // ==== 1. Получаем поток с fallback для видео ====
    let stream;

    try {
        if (type === 'audio') {
            // Для аудио нужен только микрофон
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } else {
            // Для видео: сначала пробуем видео+аудио, если не выходит — только видео
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
            } catch (err) {
                console.warn(
                    '[Recorder] Не удалось получить видео+аудио, пробуем только видео:',
                    err.name
                );
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
            }
        }
    } catch (e) {
        // Совсем ничего не получилось
        alert(
            type === 'audio'
                ? 'Не удалось получить доступ к микрофону. Проверьте разрешения и попробуйте другой браузер.'
                : 'Не удалось получить доступ к камере. Проверьте разрешения и попробуйте другой браузер.'
        );
        return;
    }

    // ==== 2. UI: переключаем поле ввода на режим записи ====
    const inputArea = document.getElementById('input-area');
    const recordingArea = document.getElementById('recording-area');
    const timerEl = document.getElementById('timer');
    const okBtn = document.getElementById('rec-ok');
    const cancelBtn = document.getElementById('rec-cancel');
    const previewEl = document.getElementById('video-preview');

    inputArea.classList.add('hidden');
    recordingArea.classList.remove('hidden');
    previewEl.classList.add('hidden');
    timerEl.textContent = '00:00';

    // Если видео — показываем превью БЕЗ звука (чтобы не было эха)
    if (type === 'video') {
        previewEl.srcObject = stream;
        previewEl.muted = true;
        previewEl.classList.remove('hidden');
        previewEl.play();
    }

    // ==== 3. Таймер ====
    let seconds = 0;
    const timerInterval = setInterval(() => {
        seconds++;
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        timerEl.textContent = `${mm}:${ss}`;
    }, 1000);

    // ==== 4. MediaRecorder ====
    const chunks = [];
    const recorder = new MediaRecorder(stream);

    recorder.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) chunks.push(e.data);
    });

    recorder.addEventListener('stop', async () => {
        clearInterval(timerInterval);
        stream.getTracks().forEach((track) => track.stop());

        // Восстанавливаем UI
        inputArea.classList.remove('hidden');
        recordingArea.classList.add('hidden');
        previewEl.srcObject = null;
        previewEl.classList.add('hidden');

        // Если пользователь нажал отмену — chunks пустые, ничего не сохраняем
        if (chunks.length === 0) return;

        const blob = new Blob(chunks, {
            type: type === 'audio' ? 'audio/webm' : 'video/webm',
        });
        const url = URL.createObjectURL(blob);

        // Запрашиваем координаты и добавляем пост
        try {
            const coords = await getCoordinates();
            onFinish(type, url, coords);
        } catch (e) {
            console.log('Запись отменена:', e.message);
        }
    });

    // ==== 5. Кнопки OK / Cancel ====
    const onOk = () => {
        cleanup();
        if (recorder.state !== 'inactive') recorder.stop();
    };

    const onCancel = () => {
        cleanup();
        // Очищаем chunks, чтобы пост не создался
        chunks.length = 0;
        if (recorder.state !== 'inactive') recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        clearInterval(timerInterval);
        inputArea.classList.remove('hidden');
        recordingArea.classList.add('hidden');
        previewEl.srcObject = null;
        previewEl.classList.add('hidden');
    };

    const cleanup = () => {
        okBtn.removeEventListener('click', onOk);
        cancelBtn.removeEventListener('click', onCancel);
    };

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);

    recorder.start();
}
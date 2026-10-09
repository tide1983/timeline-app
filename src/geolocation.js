import { parseCoordinates } from './coordinates.js';

/**
 * Возвращает Promise с координатами.
 * Если Geolocation недоступна или пользователь запретил — показывает модалку.
 */
export function getCoordinates() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            // API нет — сразу модалка
            return resolve(getManualCoordinates());
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                resolve({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            },
            () => {
                // Ошибка — модалка
                resolve(getManualCoordinates());
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    });
}

/**
 * Показывает модальное окно для ручного ввода координат.
 * Возвращает Promise с координатами или reject при отмене.
 */
function getManualCoordinates() {
    return new Promise((resolve, reject) => {
        const modal = document.getElementById('modal');
        const input = document.getElementById('manual-coords');
        const okBtn = document.getElementById('ok-modal');
        const cancelBtn = document.getElementById('cancel-modal');

        input.value = '';
        modal.classList.remove('hidden');
        input.focus();

        const cleanup = () => {
            modal.classList.add('hidden');
            okBtn.removeEventListener('click', onOk);
            cancelBtn.removeEventListener('click', onCancel);
        };

        const onOk = () => {
            try {
                const coords = parseCoordinates(input.value);
                cleanup();
                resolve(coords);
            } catch (e) {
                alert('Неверный формат: ' + e.message);
            }
        };

        const onCancel = () => {
            cleanup();
            reject(new Error('Пользователь отменил ввод координат'));
        };

        okBtn.addEventListener('click', onOk);
        cancelBtn.addEventListener('click', onCancel);
    });
}
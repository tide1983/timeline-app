/**
 * Парсит строку с координатами.
 * Поддерживает форматы:
 *   "51.50851, -0.12572"
 *   "51.50851,-0.12572"
 *   "[51.50851, -0.12572]"
 * @param {string} str
 * @returns {{latitude: number, longitude: number}}
 * @throws {Error} при неверном формате
 */
export function parseCoordinates(str) {
    if (typeof str !== 'string' || str.trim() === '') {
        throw new Error('Пустая строка');
    }

    // Убираем квадратные скобки и пробелы по краям
    const clean = str.trim().replace(/^\[\s*|\s*\]$/g, '').trim();

    const parts = clean.split(',');

    if (parts.length !== 2) {
        throw new Error('Ожидался формат "широта, долгота"');
    }

    const lat = parseFloat(parts[0].trim());
    const lon = parseFloat(parts[1].trim());

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
        throw new Error('Координаты должны быть числами');
    }

    if (lat < -90 || lat > 90) {
        throw new Error('Широта должна быть в диапазоне [-90, 90]');
    }

    if (lon < -180 || lon > 180) {
        throw new Error('Долгота должна быть в диапазоне [-180, 180]');
    }

    return { latitude: lat, longitude: lon };
}
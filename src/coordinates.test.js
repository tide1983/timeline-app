import { parseCoordinates } from './coordinates.js';

describe('parseCoordinates', () => {
    test('с пробелом после запятой', () => {
        expect(parseCoordinates('51.50851, -0.12572')).toEqual({
            latitude: 51.50851,
            longitude: -0.12572,
        });
    });

    test('без пробела', () => {
        expect(parseCoordinates('51.50851,-0.12572')).toEqual({
            latitude: 51.50851,
            longitude: -0.12572,
        });
    });

    test('в квадратных скобках', () => {
        expect(parseCoordinates('[51.50851, -0.12572]')).toEqual({
            latitude: 51.50851,
            longitude: -0.12572,
        });
    });

    test('бросает исключение на мусор', () => {
        expect(() => parseCoordinates('abc, def')).toThrow();
        expect(() => parseCoordinates('51.50851')).toThrow();
        expect(() => parseCoordinates('')).toThrow();
    });

    test('бросает исключение при выходе за диапазон', () => {
        expect(() => parseCoordinates('200, 0')).toThrow();
        expect(() => parseCoordinates('0, 200')).toThrow();
    });
});
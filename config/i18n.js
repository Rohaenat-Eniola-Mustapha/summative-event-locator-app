const i18next = require('i18next');
const Backend = require('i18next-fs-backend');

i18next
    .use(Backend)
    .init({
        fallbackLng: 'en', // Default language
        backend: {
            loadPath: './locales/{{lng}}/translation.json', // Path to translation files
        },
        interpolation: {
            escapeValue: false,
        },
    });

module.exports = i18next;
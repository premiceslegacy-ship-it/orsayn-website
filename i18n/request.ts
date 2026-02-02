import { getRequestConfig } from 'next-intl/server';

const locales = ['fr', 'en'];

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    // If not valid, use 'fr' as fallback instead of calling notFound()
    const validLocale = locales.includes(locale as string) ? locale as string : 'fr';

    return {
        locale: validLocale,
        messages: (await import(`../messages/${validLocale}.json`)).default
    };
});

require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const env = (key, defaultValue = null) => process.env[key] || defaultValue;
const isEnabled = key => env(key) && env(key) === 'true';

if (!['production', 'development', 'test'].includes(env('NODE_ENV'))) {
    console.log(`NODE_ENV has wrong option ${env('NODE_ENV')}`);
    process.exit();
}

const config = {
    app: {
        env: env('NODE_ENV'),
        url: env('APP_URL', 'http://localhost:8082'),
        port: parseInt(env('PORT', 8082)),
        routesWithoutBodyParser: env('APP_ROUTES_WITHOUT_BODY_PARSER', ''),
        jsonRequestSizeLimit: env('APP_JSON_REQUEST_SIZE_LIMIT', '1mb'),
        frontendUrl: env('APP_FRONTEND_URL'),
        corsSites: env('APP_CORS_SITES', ''),
        adminUrl: env('APP_ADMIN_URL')
    },
    session: {
        secret: 'My sercret'
    },
    db: {
        url: env('DATABASE_URL'),
        host: env('DATABASE_HOST'),
        name: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        port: parseInt(env('DATABASE_PORT', 9999)),
        logging: env('NODE_ENV') !== 'test' ? console.log : false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false
        },
        dialect: 'mysql'
    },
    redis: {
        host: env('REDIS_HOST'),
        port: env('REDIS_PORT'),
        pass: env('REDIS_PASS') || undefined,
        password: env('REDIS_PASS') || undefined,
        ttl: env('REDIS_TTL')
    },
    email: {
        useQueue: isEnabled('EMAILS_USE_QUEUE'),
        host: env('EMAIL_HOST'),
        port: env('EMAIL_PORT'),
        secure: isEnabled('EMAIL_SECURE'),
        auth: {
            user: env('EMAIL_AUTH_USER'),
            pass: env('EMAIL_AUTH_PASSWORD')
        },
        from: {
            name: env('EMAIL_FROM_NAME'),
            address: `"Employee ERP" <${env('EMAIL_FROM_ADDRESS')}>`
        }
    },
    rabbitmq: {
        url: env('RABBITMQ_URL'),
        timeout: env('RABBITMQ_TIMEOUT', 10000),
        queues: {
            emails: 'emails'
        }
    }
};

module.exports = config;

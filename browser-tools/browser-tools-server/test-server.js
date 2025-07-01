console.log('Starting browser-tools-server...');
try {
    require('./dist/browser-connector.js');
} catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
}
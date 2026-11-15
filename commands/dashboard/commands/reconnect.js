module.exports = { name: 'reconnect', description: 'Force a reconnect', execute: ({ manager }) => { manager.leave('Manual reconnect'); return manager.join(); } };

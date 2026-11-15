const express = require('express');
const path = require('path');
const dashboardRoutes = require('./routes');
function startDashboard(manager) {
  const app = express();
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: false, limit: '16kb' }));
  app.use('/public', express.static(path.join(__dirname, '..', 'public')));
  app.locals.manager = manager;
  const dashboardController = require('./controllers/dashboard');
  manager.on('message', message => {
    if (!message.includes('start Keep Alive Request Received')) dashboardController.addMessage(message, 'minecraft');
  });
  app.use('/', dashboardRoutes);
  app.use((req, res) => res.status(404).render('errors/404', { title: 'Not found' }));
  app.use((error, req, res, next) => { console.error('[WEB]', error); res.status(500).json({ error: 'Internal server error' }); });
  const port = Number(process.env.PORT) || 3000;
  const server = app.listen(port, '0.0.0.0', () => console.log(`[WEB] Dashboard listening on ${port}`));
  return { app, server };
}
module.exports = startDashboard;

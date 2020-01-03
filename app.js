const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const pv = require('./middleware/koa-pv');
const dbConfig = require('./config/dbConfig');
const redisConfig = require('./config/redisConfig');
const mongoose = require('mongoose');
const session = require('koa-session');
const redisStore = require('koa-redis');

const index = require('./routes/index');
const users = require('./routes/users');

// error handler
onerror(app);

//redis
//session加密处理用的
app.keys = ['keys', 'keykeys'];
const store = new redisStore(redisConfig);
app.use(
  session(
    {
      key: 'demo',
      prefix: 'demo_',
      store,
    },
    app
  )
);

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
);

//中间件依次执行
app.use(pv());

app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(
  views(__dirname + '/views', {
    extension: 'ejs',
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

mongoose.connect(
  dbConfig.dbs,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, info) => {
    if (!err) {
      console.log('mongodb连接成功');
    } else {
      console.log('数据库连接异常！');
      console.log(err);
    }
  }
);

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;

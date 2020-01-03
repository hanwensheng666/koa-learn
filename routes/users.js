const router = require('koa-router')()
const Person = require('../dbs/models/person')


const Redis = require('koa-redis')
const redisConfig = require('../config/redisConfig')
const Store = new Redis(redisConfig).client



router.prefix('/users')

router.get('/', function(ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function(ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.post('/addPerson', async (ctx, next) => {
  // console.log(ctx.request)
  const person = new Person({
    name: ctx.request.body.name,
    age: ctx.request.body.age,
  })
  let code
  try {
    let p = await person.save()
    code = 0
  } catch (error) {
    code = -1
  }
  ctx.body = {
    code,
    msg: '操作成功',
  }
})

router.post('/getPerson', async (ctx, next) => {
  let code
  let res
  try {
    res = await Person.findOne({ name: ctx.request.body.name })
    code = 1
  } catch (error) {
    code = -1
  }
  ctx.body = {
    code,
    data: res,
  }
})

router.post('/updatePerson', async (ctx, next) => {
  let code
  let res
  try {
    res = await Person.where({ name: ctx.request.body.name }).update({
      age: ctx.request.body.age,
    })
    code = 1
  } catch (error) {
    code = -1
  }
  ctx.body = {
    code,
    data:res,
  }
})

router.post('/removePerson', async (ctx, next) => {
  let code
  let res
  try {
    res = await Person.where({ name: ctx.request.body.name }).remove()
    code = 1
  } catch (error) {
    code = -1
  }
  ctx.body = {
    code,
    data:res,
  }
})


router.get('/fix',async (ctx,next)=>{
  //直接读写redis
  //hget 是
  const st = await Store.hset('fix','name',Math.random())
  ctx.body = {
    code:0
  }
})
module.exports = router

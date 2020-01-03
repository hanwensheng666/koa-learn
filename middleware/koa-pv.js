function pv(ctx){
  ctx.session.count++
}

module.exports = function(){
  return async (ctx,next)=>{
    pv(ctx)
    await next()
  }
}
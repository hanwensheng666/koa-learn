function m2(ctx){
  console.log('m2---------')
}

module.exports = function(){
  return async (ctx,next)=>{
    m2(ctx)
    await next()
  }
}
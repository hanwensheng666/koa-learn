function m1(ctx){
  console.log('m1---------')
}

module.exports = function(){
  return async (ctx,next)=>{
    m1(ctx)
    await next()
  }
}
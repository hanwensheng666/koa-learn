function m3(ctx){
  console.log('m3---------')
}

module.exports = function(){
  return async (ctx,next)=>{
    m3(ctx)
    await next()
  }
}
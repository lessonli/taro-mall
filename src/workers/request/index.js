//@ts-ignore
let timer = null
let timer2 = null
let timer3 = null
let timer4 = null
worker.onMessage(data=>{
  if(data.type === 'productCard') {
    let time = data.msg
    clearInterval(timer)
    let times = 1000
    if(time - Date.parse(new Date()) < 10 * 1000) {
      times = 50
      worker.postMessage({
        msg: {
          m: Math.floor((time- Date.parse(new Date())) / 1000 / 60 % 60),
          s:Math.floor((time- Date.parse(new Date()))/ 1000 % 60),
          ms:Math.abs(Math.floor((time- new Date().getTime()) % 1000)).toString().substring(0,2),
          isMs: true
        },
        type: 'productCard'
      });
    } else {
      times = 1000
      worker.postMessage({
        msg: {
          m: Math.floor((time- Date.parse(new Date())) / 1000 / 60 % 60),
          s:Math.floor((time- Date.parse(new Date()))/ 1000 % 60),
          ms:Math.floor((time- new Date().getTime()) % 1000).toString().substring(0,2),
          isMs: false
        },
        type: 'productCard'
      });
    }


      timer = setInterval(() => {
        if(time - Date.parse(new Date()) < 10 * 1000) { 
          clearInterval(timer)
          timer=setInterval(() => {
            // console.log(time -  Date.parse(new Date()));
            if(time -  Date.parse(new Date()) <=0) {
              clearInterval(timer)
              worker.postMessage({
                msg: null,
                type: 'productCard'
              });
            } else {
              // console.log(`${Math.floor((time- Date.parse(new Date())) / 1000 / 60 % 60)}分${Math.floor((time- Date.parse(new Date()) )/ 1000 % 60)}秒`);
                worker.postMessage({
                  msg: {
                    m: Math.floor((time- Date.parse(new Date())) / 1000 / 60 % 60),
                    s:Math.floor((time- Date.parse(new Date()))/ 1000 % 60),
                    ms:Math.abs(Math.floor((time- new Date().getTime()) % 1000)).toString().substring(0,2),
                    isMs: true
                  },
                  type: 'productCard'
                });
              }
      
          }, 50);
        } else {
          console.log('拍卖倒计时', 999999999999);
          worker.postMessage({
            msg: {
              m: Math.floor((time- Date.parse(new Date())) / 1000 / 60 % 60),
              s:Math.floor((time- Date.parse(new Date()))/ 1000 % 60),
              ms:Math.floor((time- new Date().getTime()) % 1000).toString().substring(0,2),
              isMs: false
            },
            type: 'productCard'
          });
        }
        // console.log(time -  Date.parse(new Date()));
  
      }, times);
  } else if(data.type === 'productList') {
    clearInterval(timer2)
    timer2 = setInterval(() => {
      worker.postMessage({
        msg: data.msg.map(item=> {return item.auction.endTime - Date.parse(new Date()) > 0 ? `${Math.floor((item.auction.endTime - Date.parse(new Date())) / 1000 / 60 % 60)}分${Math.floor((item.auction.endTime-Date.parse(new Date())) / 1000 % 60)}秒`: null}),
        type: 'productList'
      })
    }, 1000);
  } else  if(data.type === 'preView'){
    clearInterval(timer3)

    timer3 = setInterval(() => {
      if(data.msg -  Date.parse(new Date()) <=0) {
        clearInterval(timer3)
        worker.postMessage({
          msg: null,
          type: 'preView',
          status: 2 // 2 倒计时结束
        });
      } else {
        worker.postMessage({
          msg: {h:Math.floor((data.msg - Date.parse(new Date())) / 1000 / 60 / 60),
                m:Math.floor((data.msg - Date.parse(new Date())) / 1000 / 60 % 60),
                s: Math.floor((data.msg -Date.parse(new Date())) / 1000 % 60)},
          type: 'preView'
        })
      }
    }, 1000);
  }else if (data.type === 'hide') {
    clearInterval(timer2)
  } else if(data.type === 'redPacket') {
    clearInterval(timer4)
    worker.postMessage({
      msg: {h:Math.floor((data.msg - Date.parse(new Date())) / 1000 / 60 / 60),
            m:Math.floor((data.msg - Date.parse(new Date())) / 1000 / 60 % 60),
            s: Math.floor((data.msg -Date.parse(new Date())) / 1000 % 60)},
      type: 'redPacket',
      status:1
    })
    timer4 = setInterval(() => {
      if(data.msg -  Date.parse(new Date()) <=0) {
        clearInterval(timer4)
        worker.postMessage({
          msg: {h:0,m:0,s:0},
          type: 'redPacket',
          status: 2 // 2 倒计时结束
        });
      } else {
        worker.postMessage({
          msg: {h:Math.floor((data.msg - Date.parse(new Date())) / 1000 / 60 / 60),
                m:Math.floor((data.msg - Date.parse(new Date())) / 1000 / 60 % 60),
                s: Math.floor((data.msg -Date.parse(new Date())) / 1000 % 60)},
          type: 'redPacket',
          status:1
        })
      }
    }, 1000);

  } else if(data.type === 'redPacketHide') {
    clearInterval(timer4)
  }
})


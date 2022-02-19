const originPush = window.history.pushState;
const originReplace = window.history.replaceState;
 
const beforeBack = (args) => {

  const currentUrl = window.location.href

 // 根据 url 匹配相应的微应用
 console.log('beforeBack', args, currentUrl);
 
}
 
// 劫持 history 的 pushState 方法
const hajackHistory = () => {
 window.history.pushState = (...rest) => {
  // beforeBack(rest);
   originPush.apply(window.history, [...rest]);
  }
  
  window.addEventListener('popstate', beforeBack, false);
}

// hajackHistory()
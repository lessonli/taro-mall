const workercode = () => {

  self.onmessage = function (e) {
    var workerResult
    setTimeout(() => {
      workerResult = e.data + 1000
      self.postMessage(workerResult); // here it's working without self
    }, 1000);
  }
};
// 把脚本代码转为string
let code = workercode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
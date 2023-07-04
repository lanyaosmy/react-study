// 职责链

function Axios() {
  this.interceptors = {
    request: new InterceptionManager(),
    response: new InterceptionManager(),
  };
}

function InterceptionManager() {
  this.handlers = [];
}

InterceptionManager.prototype.use = function (fulfilled, rejected) {
  this.handlers.push({ fulfilled, rejected });
};
function dispatchRequest() {
  // 发送请求
}
Axios.prototype.request = function (config) {
  const chain = [dispatchRequest, null];

  this.interceptors.request.handlers.forEach(({ fulfilled, rejected }) => {
    chain.unshift(fulfilled, rejected);
  });

  this.interceptors.response.handlers.forEach(({ fulfilled, rejected }) => {
    chain.push(fulfilled, rejected);
  });
  let promise = Promise.resolve(config);
  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }
  return promise;
};

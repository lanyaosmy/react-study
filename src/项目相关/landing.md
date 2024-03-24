# C端

- require.context
- render(h)
  - 相当于createElement


# B端

## 拖拽组件

可拖拽
- draggable
- onDragStart：e.dataTransfer.setData('key',value)
- onDragEnd

目标区域
- handleDrop = (e) => const kitName = e.dataTransfer.getData('kit');
- dragOver：preventDefault

## postMessage通信

```js
/**
 * Iframe 双端通讯
 *
 * Messenger.init(父页面window, 子页面window, 通讯域名)
 * Messenger.on(eventname, callback)
 * Messenger.send(eventname, data)
 */
interface Handler {
  originWindow: Window | null;
  targetWindow: Window | null;
  origin: string;
  listener: any;
  initFlag: boolean;
  fn: any;
}

const handler: Handler = {
  originWindow: window,
  targetWindow: window,
  origin: '*',
  listener: {},
  initFlag: false,
  fn: () => {},
};

const isMessenger = (event) => {
  const v = event.data;

  return (
    isPlainObject(v) &&
    isString(v.event) &&
    !!Object.prototype.hasOwnProperty.call(v, 'data')
  );
};

function on(eventname, feedback): void {
  if (!isString(eventname) || !isFunction(feedback)) {
    console.info('error _listen');
  } else {
    const { listener } = handler;

    if (!Array.isArray(listener[eventname])) {
      listener[eventname] = [];
    }

    listener[eventname].push(feedback);
  }
}

function send(eventname, data = {}) {
  // console.log('eventname, data', eventname, data);
  if (isString(eventname)) {
    const payload = {
      tag: 'xxx',
      event: eventname,
      data: JSON.stringify(data),
    };
    if (handler && handler.targetWindow) handler.targetWindow.postMessage(payload, handler.origin);
  }
}

function listen() {
  const { originWindow, listener } = handler;
  if (originWindow) {
    const fn = (event) => {
      if (isMessenger(event)) {
        const { data, source } = event;
        const eventname = data.event;
        const eventdata = JSON.parse(data.data);

        if (Array.isArray(listener[eventname])) {
          for (const feedback of listener[eventname]) {
            feedback(eventdata, source);
          }
        }
      }
    };
    originWindow.addEventListener('message', fn);
    handler.fn = fn;
  }
}

function init(parentWin, childWin, origin) {
  if (handler.initFlag === true) {
    console.warn('Message already init');
  } else {
    const currentWindow = window;

    if (currentWindow === parentWin) {
      handler.originWindow = parentWin;
      handler.targetWindow = childWin;
      handler.origin = origin;
    }
    if (currentWindow === childWin) {
      handler.originWindow = childWin;
      handler.targetWindow = parentWin;
      handler.origin = origin;
    }

    listen();

    handler.initFlag = true;
  }
}

function destroy() {
  // 删除监听器
  handler.originWindow?.removeEventListener('message', handler.fn);
  handler.originWindow = null;
  handler.targetWindow = null;
  handler.origin = '*';
  handler.listener = {};
  handler.initFlag = false;
  handler.fn = () => {};
}

export default {
  on,
  send,
  init,
  destroy,
  handler,
};

```

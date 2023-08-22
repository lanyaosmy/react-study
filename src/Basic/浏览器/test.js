function createGenerator(list) {
  let i = 0;
  return {
    next: () => {
      const done = i >= list.length;
      const value = !done ? list[i++] : undefined;
      return {
        value,
        done,
      };
    },
  };
}

function asyncFn(gen) {
  return function () {
    return new Promise((resolve, reject) => {
      const g = gen();
      function next(param) {
        const res = g.next(param);
        if (res.done) {
          resolve(res.value);
        } else {
          return res.value.then((val) => next(val));
        }
      }
      next();
    });
  };
}

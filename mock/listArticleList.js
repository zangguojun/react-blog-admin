// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import { parse } from 'url'; // mock articleListDataSource

const genList = (current, pageSize) => {
  const articleListDataSource = [];
  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    articleListDataSource.push({
      id: index,
      category: 97,
      title: "React 关于setState调用次数问题的个人理解",
      href: 'https://www.ltbuchiyu.top',
      content: '# 1. 两个setState，调用几次？\n\n如下代码所示，`state`中有一个`count`。对按钮绑定了点击事件，事件中执行了两次`setState`，每次都将`count`的值加`1`。\n\n当点击按钮时，`setState`会执行几次？`render()`会执行几次？\n\n答案：都是`1`次。\n\n```javascript\nstate = { count: 0 };\nhandleClick = () => {\n    this.setState({ count: this.state.count + 1 });\n    this.setState({ count: this.state.count + 1 });\n};\nrender() {\n    console.log(`render`);\n    return (\n        <>\n            <div>当前计数：{this.state.count}</div>\n            <button onClick={this.handleClick}>add</button>\n        </>\n    );\n}\n```\n\n按照常理来说，第一次点击按钮时，由于执行了两次两次`setState`，每次都将`count`的值进行加`1`，`render()`应该会执行两次，最后`count`的值应该是2。但是 React 并不是这么执行的。\n\n以上代码放到浏览器运行一下即可：\n\n![](https://jack-img.oss-cn-hangzhou.aliyuncs.com/img/20211110135610.gif)\n\n最开始时，页面显示`count`的值为`0`，控制台打印出`render`，这是 React 首次渲染时打印的。当点击完按钮后，页面显示`count`值是`1`，同时也只打印了`1`个`render`，说明在这过程中 React 只执行了一次`setState`，只执行了一次`render()`渲染操作。\n\n原因在于，React 内部将**同一事件响应函数**中的多个`setState`进行合并，减少`setState`的调用次数，也就能减少渲染的次数，提高性能。\n\n这也就解释了上述代码，为什么最后`count`的值是`1`，因为 React 将两个`setState`进行了合并，最终只执行了`1`次，`render()`也只执行了一次。\n\n# 2. 两个setState，调用的是哪一个？\n\n但上述代码没有验证，React 合并后，到底执行的是哪一次`setState`。如下代码所示，将第二个`setState`中，对`count`的操作改为加`2`，其余代码保持不变：\n\n```javascript\nstate = { count: 0 };\nhandleClick = () => {\n    this.setState({ count: this.state.count + 1 });\n    this.setState({ count: this.state.count + 2 }); // 改为+2\n};\nrender() {\n    console.log(`render`);\n    return (\n        <>\n            <div>当前计数：{this.state.count}</div>\n            <button onClick={this.handleClick}>add</button>\n        </>\n    );\n}\n```\n\n再次放到浏览器中执行：\n\n![](https://jack-img.oss-cn-hangzhou.aliyuncs.com/img/20211110141434.gif)\n\n结果显示，点击按钮后，`count`的值最终变成了`2`，也就是进行了`+2`的操作，`render()`也只执行了`1`次。这就说明 React 在合并多个`setState`时，若出现同名属性，会将**后面的同名属性**覆盖掉**前面的同名属性**。可以这么理解，对于同名属性，最终执行的的是**最后**的`setState`中的属性。\n\n# 3. 两个setState放在setTimeout中？\n\n若在点击事件函数中，添加一个定时器`setTimeout`，在定时器中执行两次`setState`操作，结果又将如何？如下代码，事件处理函数中，写了一个定时器`setTimeout`，将两次`setState`放入`setTimeout`中。\n\n```javascript\nstate = { count: 0 };\nhandleClick = () => {\n    setTimeout(() => {\n        this.setState({ count: this.state.count + 1 });\n        this.setState({ count: this.state.count + 2 });\n    }, 0);\n};\nrender() {\n    console.log(`render`);\n    return (\n        <>\n            <div>当前计数：{this.state.count}</div>\n            <button onClick={this.handleClick}>add</button>\n        </>\n    );\n}\n```\n\n运行结果：\n\n![](https://jack-img.oss-cn-hangzhou.aliyuncs.com/img/20211110142842.gif)\n\n结果显示，点击按钮后，`count`的值最终变成了`3`，也就`+1`和`+2`的操作都执行了，`render()`也执行了`2`次。\n\n这是因为在 React 的**合成事件**和**生命周期函数**中直接调用`setState`，会交由 React 的**性能优化机制**管理，合并多个`setState`。而在**原生事件**、`setTimeout`中调用`setState`，是不受 React 管理的，故并**不会**合并多个`setState`，写了几次`setState`，就会调用几次`setState`。\n\n# 4. 总结\n\n在 React 中直接使用的事件，如`onChange`、`onClick`等，都是由 React 封装后的事件，是**合成事件**，由 React 管理。\n\nReact 对于合成事件和生命周期函数，有一套**性能优化机制**，会合并多个`setState`，若出现同名属性，会将**后面的同名属性**覆盖掉**前面的同名属性**。\n\n若越过 React 的**性能优化机制**，在**原生事件**、`setTimeout`中使用`setState`，就不归 React 管理了，写了几次`setState`，就会调用几次`setState`。\n\n\n\n> 以上是本人学习所得之拙见，若有不妥，欢迎指出交流！',
      tags: [
        '96',
        '98'
      ],
      updatedAt: moment().format("YYYY-MM-DD HH:mm"),
      createdAt: moment().format("YYYY-MM-DD HH:mm"),
    });
  }

  articleListDataSource.reverse();
  return articleListDataSource;
};

let articleListDataSource = genList(1, 100);

function getArticle(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }
  if (req.query?.id) {
    return res.json({
      id: 99,
      category: 98,
      title: "React 关于setState调用次数问题的个人理解",
      href: 'https://www.ltbuchiyu.top',
      content: '# 1. 两个setState，调用几次？\n\n如下代码所示，`state`中有一个`count`。对按钮绑定了点击事件，事件中执行了两次`setState`，每次都将`count`的值加`1`。\n\n当点击按钮时，`setState`会执行几次？`render()`会执行几次？\n\n答案：都是`1`次。\n\n```javascript\nstate = { count: 0 };\nhandleClick = () => {\n    this.setState({ count: this.state.count + 1 });\n    this.setState({ count: this.state.count + 1 });\n};\nrender() {\n    console.log(`render`);\n    return (\n        <>\n            <div>当前计数：{this.state.count}</div>\n            <button onClick={this.handleClick}>add</button>\n        </>\n    );\n}\n```\n\n按照常理来说，第一次点击按钮时，由于执行了两次两次`setState`，每次都将`count`的值进行加`1`，`render()`应该会执行两次，最后`count`的值应该是2。但是 React 并不是这么执行的。\n\n以上代码放到浏览器运行一下即可：\n\n![](https://jack-img.oss-cn-hangzhou.aliyuncs.com/img/20211110135610.gif)\n\n最开始时，页面显示`count`的值为`0`，控制台打印出`render`，这是 React 首次渲染时打印的。当点击完按钮后，页面显示`count`值是`1`，同时也只打印了`1`个`render`，说明在这过程中 React 只执行了一次`setState`，只执行了一次`render()`渲染操作。\n\n原因在于，React 内部将**同一事件响应函数**中的多个`setState`进行合并，减少`setState`的调用次数，也就能减少渲染的次数，提高性能。\n\n这也就解释了上述代码，为什么最后`count`的值是`1`，因为 React 将两个`setState`进行了合并，最终只执行了`1`次，`render()`也只执行了一次。\n\n# 2. 两个setState，调用的是哪一个？\n\n但上述代码没有验证，React 合并后，到底执行的是哪一次`setState`。如下代码所示，将第二个`setState`中，对`count`的操作改为加`2`，其余代码保持不变：\n\n```javascript\nstate = { count: 0 };\nhandleClick = () => {\n    this.setState({ count: this.state.count + 1 });\n    this.setState({ count: this.state.count + 2 }); // 改为+2\n};\nrender() {\n    console.log(`render`);\n    return (\n        <>\n            <div>当前计数：{this.state.count}</div>\n            <button onClick={this.handleClick}>add</button>\n        </>\n    );\n}\n```\n\n再次放到浏览器中执行：\n\n![](https://jack-img.oss-cn-hangzhou.aliyuncs.com/img/20211110141434.gif)\n\n结果显示，点击按钮后，`count`的值最终变成了`2`，也就是进行了`+2`的操作，`render()`也只执行了`1`次。这就说明 React 在合并多个`setState`时，若出现同名属性，会将**后面的同名属性**覆盖掉**前面的同名属性**。可以这么理解，对于同名属性，最终执行的的是**最后**的`setState`中的属性。\n\n# 3. 两个setState放在setTimeout中？\n\n若在点击事件函数中，添加一个定时器`setTimeout`，在定时器中执行两次`setState`操作，结果又将如何？如下代码，事件处理函数中，写了一个定时器`setTimeout`，将两次`setState`放入`setTimeout`中。\n\n```javascript\nstate = { count: 0 };\nhandleClick = () => {\n    setTimeout(() => {\n        this.setState({ count: this.state.count + 1 });\n        this.setState({ count: this.state.count + 2 });\n    }, 0);\n};\nrender() {\n    console.log(`render`);\n    return (\n        <>\n            <div>当前计数：{this.state.count}</div>\n            <button onClick={this.handleClick}>add</button>\n        </>\n    );\n}\n```\n\n运行结果：\n\n![](https://jack-img.oss-cn-hangzhou.aliyuncs.com/img/20211110142842.gif)\n\n结果显示，点击按钮后，`count`的值最终变成了`3`，也就`+1`和`+2`的操作都执行了，`render()`也执行了`2`次。\n\n这是因为在 React 的**合成事件**和**生命周期函数**中直接调用`setState`，会交由 React 的**性能优化机制**管理，合并多个`setState`。而在**原生事件**、`setTimeout`中调用`setState`，是不受 React 管理的，故并**不会**合并多个`setState`，写了几次`setState`，就会调用几次`setState`。\n\n# 4. 总结\n\n在 React 中直接使用的事件，如`onChange`、`onClick`等，都是由 React 封装后的事件，是**合成事件**，由 React 管理。\n\nReact 对于合成事件和生命周期函数，有一套**性能优化机制**，会合并多个`setState`，若出现同名属性，会将**后面的同名属性**覆盖掉**前面的同名属性**。\n\n若越过 React 的**性能优化机制**，在**原生事件**、`setTimeout`中使用`setState`，就不归 React 管理了，写了几次`setState`，就会调用几次`setState`。\n\n\n\n> 以上是本人学习所得之拙见，若有不妥，欢迎指出交流！',
      tags: [
        '96',
        '98'
      ],
      updatedAt: moment().format("YYYY-MM-DD HH:mm"),
      createdAt: moment().format("YYYY-MM-DD HH:mm"),
    })
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  let dataSource = [...articleListDataSource].slice((current - 1) * pageSize, current * pageSize);

  if (params.sorter) {
    const sorter = JSON.parse(params.sorter);
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      Object.keys(sorter).forEach((key) => {
        if (sorter[key] === 'descend') {
          if (prev[key] - next[key] > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }

          return;
        }

        if (prev[key] - next[key] > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }

  if (params.filter) {
    const filter = JSON.parse(params.filter);

    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return Object.keys(filter).some((key) => {
          if (!filter[key]) {
            return true;
          }

          if (filter[key].includes(`${item[key]}`)) {
            return true;
          }

          return false;
        });
      });
    }
  }

  if (params.name) {
    dataSource = dataSource.filter((data) => data?.name?.includes(params.name || ''));
  }

  const result = {
    data: dataSource,
    total: articleListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };
  return res.json(result);
}

function postArticle(req, res, u, b) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { id, ...rest } = body;

  switch (req.method) {
    /* eslint no-case-declarations:0 */
    case 'DELETE':
      articleListDataSource = articleListDataSource.filter((item) => item.id !== id);
      break;

    case 'POST':
      (() => {
        const newArticle = {
          ...rest,
          id: articleListDataSource.length,
          updatedAt: moment().format("YYYY-MM-DD HH:mm"),
          createdAt: moment().format("YYYY-MM-DD HH:mm"),
        };
        articleListDataSource.unshift(newArticle);
        return res.json(newArticle);
      })();

      return;

    case 'PUT':
      (() => {
        let newArticle = {};
        articleListDataSource = articleListDataSource.map((item) => {
          if (item.id === id) {
            newArticle = { ...item, ...rest };
            return { ...item, ...rest };
          }
          return item;
        });
        return res.json(newArticle);
      })();

      return;

    default:
      break;
  }

  const result = {
    list: articleListDataSource,
    pagination: {
      total: articleListDataSource.length,
    },
  };
  res.json(result);
}

export default {
  'GET /api/article': getArticle,
  'POST /api/article': postArticle,
  'DELETE /api/article': postArticle,
  'PUT /api/article': postArticle,
};

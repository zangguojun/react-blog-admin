// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'url'; // mock linkListDataSource
const genList = (current, pageSize) => {
  const linkListDataSource = [];
  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    linkListDataSource.push({
      id: index,
      avatar: 'https://www.ltbuchiyu.top/wp-content/uploads/2021/03/pic.png',
      name: 'React 学习笔记',
      link: 'https://github.com/zangguojun',
      desc: 'Buchiyu',
    });
  }

  linkListDataSource.reverse();
  return linkListDataSource;
};

let linkListDataSource = genList(1, 100);

function getLink(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  let dataSource = [...linkListDataSource].slice((current - 1) * pageSize, current * pageSize);

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
    total: linkListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };
  return res.json(result);
}

function postLink(req, res, u, b) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { id, ...rest } = body;

  switch (req.method) {
    /* eslint no-case-declarations:0 */
    case 'DELETE':
      linkListDataSource = linkListDataSource.filter((item) => item.id !== id);
      break;

    case 'POST':
      (() => {
        const newLink = {
          id: linkListDataSource.length,
          ...rest,
        };
        linkListDataSource.unshift(newLink);
        return res.json(newLink);
      })();

      return;

    case 'PUT':
      (() => {
        let newLink = {};
        linkListDataSource = linkListDataSource.map((item) => {
          if (item.id === id) {
            newLink = { ...item, ...rest };
            return { ...item, ...rest };
          }
          return item;
        });

        return res.json(newLink);
      })();

      return;

    default:
      break;
  }

  const result = {
    list: linkListDataSource,
    pagination: {
      total: linkListDataSource.length,
    },
  };
  res.json(result);
}

export default {
  'GET /api/link': getLink,
  'POST /api/link': postLink,
  'DELETE /api/link': postLink,
  'PUT /api/link': postLink,
};

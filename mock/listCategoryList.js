// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import { parse } from 'url'; // mock categoryListDataSource

const genList = (current, pageSize) => {
  const categoryListDataSource = [];
  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    categoryListDataSource.push({
      id: index,
      name: 'React 学习笔记',
      count: 10
    });
  }

  categoryListDataSource.reverse();
  return categoryListDataSource;
};

let categoryListDataSource = genList(1, 100);

function getCategory(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  let dataSource = [...categoryListDataSource].slice((current - 1) * pageSize, current * pageSize);

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
    total: categoryListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };
  return res.json(result);
}

function postCategory(req, res, u, b) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { id, name } = body;

  switch (req.method) {
    /* eslint no-case-declarations:0 */
    case 'DELETE':
      categoryListDataSource = categoryListDataSource.filter((item) => item.id !== id);
      break;

    case 'POST':
      (() => {
        const newCategory = {
          id: categoryListDataSource.length,
          name,
          count: 0
        };
        categoryListDataSource.unshift(newCategory);
        return res.json(newCategory);
      })();

      return;

    case 'PUT':
      (() => {
        let newCategory = {};
        categoryListDataSource = categoryListDataSource.map((item) => {
          if (item.id === id) {
            newCategory = { ...item, name };
            return { ...item, name };
          }
          return item;
        });

        return res.json(newCategory);
      })();

      return;

    default:
      break;
  }

  const result = {
    list: categoryListDataSource,
    pagination: {
      total: categoryListDataSource.length,
    },
  };
  res.json(result);
}

export default {
  'GET /api/category': getCategory,
  'POST /api/category': postCategory,
  'DELETE /api/category': postCategory,
  'PUT /api/category': postCategory,
};

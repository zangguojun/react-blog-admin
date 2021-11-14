// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import { parse } from 'url'; // mock tagListDataSource

const genList = (current, pageSize) => {
  const tagListDataSource = [];
  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tagListDataSource.push({
      id: index,
      name: 'React 学习笔记',
      count: 10
    });
  }

  tagListDataSource.reverse();
  return tagListDataSource;
};

let tagListDataSource = genList(1, 100);

function getTag(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  let dataSource = [...tagListDataSource].slice((current - 1) * pageSize, current * pageSize);

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
    total: tagListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };
  return res.json(result);
}

function postTag(req, res, u, b) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { id, name } = body;

  switch (req.method) {
    /* eslint no-case-declarations:0 */
    case 'DELETE':
      tagListDataSource = tagListDataSource.filter((item) => item.id !== id);
      break;

    case 'POST':
      (() => {
        const newTag = {
          id: tagListDataSource.length,
          name,
          count: 0
        };
        tagListDataSource.unshift(newTag);
        return res.json(newTag);
      })();

      return;

    case 'PUT':
      (() => {
        let newTag = {};
        tagListDataSource = tagListDataSource.map((item) => {
          if (item.id === id) {
            newTag = { ...item, name };
            return { ...item, name };
          }
          return item;
        });

        return res.json(newTag);
      })();

      return;

    default:
      break;
  }

  const result = {
    list: tagListDataSource,
    pagination: {
      total: tagListDataSource.length,
    },
  };
  res.json(result);
}

export default {
  'GET /api/tag': getTag,
  'POST /api/tag': postTag,
  'DELETE /api/tag': postTag,
  'PUT /api/tag': postTag,
};

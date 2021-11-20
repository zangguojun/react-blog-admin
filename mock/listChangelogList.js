// eslint-disable-next-line import/no-extraneous-dependencies
import moment from 'moment';
import { parse } from 'url'; // mock changelogListDataSource

const genList = (current, pageSize) => {
  const changelogListDataSource = [];
  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    changelogListDataSource.push({
      id: index,
      log: 'React 学习笔记',
      createdAt: moment().format("YYYY-MM-DD HH:mm"),
    });
  }

  changelogListDataSource.reverse();
  return changelogListDataSource;
};

let changelogListDataSource = genList(1, 100);

function getChangelog(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  let dataSource = [...changelogListDataSource].slice((current - 1) * pageSize, current * pageSize);

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
    total: changelogListDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.current}`, 10) || 1,
  };
  return res.json(result);
}

function postChangelog(req, res, u, b) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { id, log } = body;

  switch (req.method) {
    /* eslint no-case-declarations:0 */
    case 'DELETE':
      changelogListDataSource = changelogListDataSource.filter((item) => item.id !== id);
      break;

    case 'POST':
      (() => {
        const newChangelog = {
          id: changelogListDataSource.length,
          log,
          createdAt: moment().format("YYYY-MM-DD HH:mm"),
        };
        changelogListDataSource.unshift(newChangelog);
        return res.json(newChangelog);
      })();

      return;

    case 'PUT':
      (() => {
        let newChangelog = {};
        changelogListDataSource = changelogListDataSource.map((item) => {
          if (item.id === id) {
            newChangelog = { ...item, log };
            return { ...item, log };
          }
          return item;
        });

        return res.json(newChangelog);
      })();

      return;

    default:
      break;
  }

  const result = {
    list: changelogListDataSource,
    pagination: {
      total: changelogListDataSource.length,
    },
  };
  res.json(result);
}

export default {
  'GET /api/changelog': getChangelog,
  'POST /api/changelog': postChangelog,
  'DELETE /api/changelog': postChangelog,
  'PUT /api/changelog': postChangelog,
};

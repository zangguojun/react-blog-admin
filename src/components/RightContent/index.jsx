import { Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel } from 'umi';
import Avatar from '../AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

const GlobalHeaderRight = () => {
  const { initialState } = useModel('@@initialState');
  console.log('🚀 ~ GlobalHeaderRight ~ initialState', initialState);

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="搜索"
        options={[]}
        onSearch={(value) => {
          console.log('input', value);
        }}
      />
      <span
        className={styles.action}
        onClick={() => {
          window.open('https://www.ltbuchiyu.top');
        }}
      >
        <HomeOutlined />
      </span>
      <Avatar />
    </Space>
  );
};

export default GlobalHeaderRight;

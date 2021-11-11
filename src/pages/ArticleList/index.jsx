import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import { article, addArticle, updateArticle, removeArticle } from '@/services/article';

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await addArticle({ ...fields });
    hide();
    message.success('Added successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeArticle({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Deleted successfully and will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const ArticleList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: 'id',
      valueType: 'indexBorder',
    },
    {
      title: "标题",
      dataIndex: 'title',
      render: (val, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              window.open(record.href)
            }}
          >
            {val}
          </Button>
        );
      },
    },
    {
      title: '分类',
      dataIndex: 'category',
      valueType: 'select',
    },
    {
      title: '标签',
      hideInForm: true,
      dataIndex: 'tags',
      render: (val) => {
        return val.map(i => <Tag color="cyan" key={i} >{i}</Tag>)
      },
    },
    {
      title: '更新时间',
      hideInForm: true,
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      hideInForm: true,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}
        >
          快速编辑
        </Button>,
        <Button
          key="edit"
          type="link"
          onClick={() => {
            window.open('')
          }}
        >
          编辑
        </Button>
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="文章列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 50,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined />
            写文章
          </Button>,
        ]}
        request={article}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              选择了
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>
              项
              &nbsp;&nbsp;
              <span>
                {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)}{' '}
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            删除
          </Button>
          <Button type="primary">
            批准
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="新文章"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: "文章标题为必填项",
            },
          ]}
          width="md"
          name="title"
        />
        <ProFormTextArea width="md" name="content" />
      </ModalForm>

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default ArticleList;

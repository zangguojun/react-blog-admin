import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Tag, Space, Select } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import { article, addArticle, updateArticle, removeArticle } from '@/services/article';

const handleAdd = async (fields) => {
  const hide = message.loading('添加中');

  try {
    await addArticle({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试');
    return false;
  }
};

const handleRemove = async (selectedRows) => {
  const hide = message.loading('删除中');
  if (!selectedRows) return true;

  try {
    await removeArticle({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
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
      width: 48,
      hideInSearch: true,
    },
    {
      title: "标题",
      dataIndex: 'title',
      ellipsis: true,
      copyable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      // render: (val, record) => {
      //   return (
      //     <Button
      //       type="link"
      //       onClick={() => {
      //         window.open(record.href)
      //       }}
      //     >
      //       {val}
      //     </Button>
      //   );
      // },
    },
    {
      title: '分类',
      dataIndex: 'category',
      valueType: 'select',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      renderFormItem: (_, { type, defaultRender, formItemProps, fieldProps, ...rest }, form) => {
        return defaultRender(_);
        // return (
        //   <Select
        //     {...fieldProps}
        //     placeholder="请输入test"
        //   />
        // );
      },
      render: (val) => {
        return (
          <Space>
            {
              val.map(i => <Tag color="cyan" key={i} >{i}</Tag>)
            }
          </Space>
        )
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
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
        rowKey="id"
        request={article}
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
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
        columnsState={{
          defaultValue: {
            updatedAt: { show: false }
          },
        }}
        search={{
          labelWidth: 'auto',
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
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

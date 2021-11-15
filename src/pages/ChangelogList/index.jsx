import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-form';
import { changelog, addChangelog, updateChangelog, removeChangelog } from '@/services/changelog';

const handleAdd = async (fields) => {
  const hide = message.loading('添加中');
  try {
    await addChangelog(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

const handleUpdate = async (fields) => {
  const hide = message.loading('修改中');
  try {
    await updateChangelog(fields);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败，请重试');
    return false;
  }
};

const handleRemove = async (selectedRows) => {
  const hide = message.loading('删除中');
  if (!selectedRows) return true;
  try {
    await removeChangelog(selectedRows);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const ChangelogList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const actionRef = useRef();

  const columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      editable: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'date',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      hideInTable: true,
      hideInDescriptions: true,
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
      title: "日志",
      dataIndex: 'log',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '操作',
      hideInForm: true,
      dataIndex: 'option',
      valueType: 'option',
      render: (val, record, _, action) => [
        <Button
          type="link"
          key="edit"
          onClick={() => {
            action?.startEditable?.(record.id);
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
        rowKey="id"
        headerTitle="日志列表"
        request={changelog}
        columns={columns}
        actionRef={actionRef}
        editable={{
          onSave: async (_, data) => {
            await handleUpdate(data)
          },
          onDelete: async (_, data) => {
            await handleRemove(data)
          },
        }}
        search={{
          labelWidth: 'auto',
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
            新日志
          </Button>,
        ]}
      // form={{
      //   // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
      //   syncToUrl: (values, type) => {
      //     if (type === 'get') {
      //       return {
      //         ...values,
      //         created_at: [values.startTime, values.endTime],
      //       };
      //     }
      //     return values;
      //   },
      // }}
      />
      <ModalForm
        title="新日志"
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
        <ProFormTextArea
          label="日志信息"
          rules={[
            {
              required: true,
              message: "日志名为必填项",
            },
          ]}
          width="xl"
          name="log"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default ChangelogList;

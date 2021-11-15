import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { link, addLink, updateLink, removeLink } from '@/services/link';

const handleAdd = async (fields) => {
  const hide = message.loading('添加中');
  try {
    await addLink(fields);
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
    await updateLink(fields);
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
    await removeLink(selectedRows);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const LinkList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const actionRef = useRef();

  const columns = [
    {
      dataIndex: 'id',
      hideInSearch: true,
      editable: false,
    },
    {
      dataIndex: 'avatar',
      hideInSearch: true,
      valueType: 'avatar'
    },
    {
      title: "作者名",
      dataIndex: 'name',
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
      title: "链接",
      dataIndex: 'link',
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
      title: "描述",
      dataIndex: 'desc',
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
        headerTitle="友链列表"
        request={link}
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
            新友链
          </Button>,
        ]}
      />
      <ModalForm
        title="新友链"
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
              message: "作者名为必填项",
            },
          ]}
          label="作者"
          width="md"
          name="name"
        />
        <ProFormText
          label="头像链接"
          width="md"
          name="avatar"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: "博客链接为必填项",
            },
          ]}
          label="博客链接"
          width="md"
          name="link"
        />
        <ProFormTextArea
          label="描述"
          width="xl"
          name="desc"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default LinkList;

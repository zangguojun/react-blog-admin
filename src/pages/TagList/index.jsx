import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { tag, addTag, updateTag, removeTag } from '@/services/tag';

const handleAdd = async (fields) => {
  const hide = message.loading('添加中');
  try {
    await addTag(fields);
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
    await updateTag(fields);
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
    await removeTag(selectedRows);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TagList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const actionRef = useRef();

  const columns = [
    {
      title: "ID",
      dataIndex: 'id',
      hideInSearch: true,
      editable: false,
      width: 48,
    },
    {
      title: "标签名",
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
      title: '被引用数',
      dataIndex: 'count',
      editable: false,
    },
    {
      title: '操作',
      hideInForm: true,
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          type="link"
          key="edit"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        headerTitle="标签列表"
        request={tag}
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
            新标签
          </Button>,
        ]}
      />
      <ModalForm
        title="新标签"
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
              message: "标签名为必填项",
            },
          ]}
          label="标签名"
          width="md"
          name="name"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TagList;

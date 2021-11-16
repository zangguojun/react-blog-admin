import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { category, addCategory, updateCategory, removeCategory } from '@/services/category';

const handleAdd = async (fields) => {
  const hide = message.loading('添加中');
  try {
    await addCategory(fields);
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
    await updateCategory(fields);
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
    await removeCategory(selectedRows);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const CategoryList = () => {
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
      title: "分类名",
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
      dataIndex: 'option',
      valueType: 'option',
      render: (val, record, _, action) => [
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
        headerTitle="分类列表"
        request={category}
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
            新分类
          </Button>,
        ]}
      />
      <ModalForm
        title="新分类"
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
              message: "分类名为必填项",
            },
          ]}
          label="分类名"
          width="md"
          name="name"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default CategoryList;

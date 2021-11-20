
import React, { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Input, message, Form, DatePicker, Select, Spin, Button, Divider } from 'antd';
import { marked } from 'marked'
import { useParams } from 'umi';
import moment from 'moment';
import { article, updateArticle, addArticle } from '@/services/article';
import { category } from '@/services/category';
import { tag } from '@/services/tag';
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css';

const handleUpdate = async (fields) => {
  const hide = message.loading('修改中');
  try {
    await updateArticle(fields);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败，请重试');
    return false;
  }
};


const handleAdd = async (fields) => {
  const hide = message.loading('添加中');
  try {
    await addArticle(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试');
    return false;
  }
};


const DetailCard = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [categoryList, setCategoryList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [articleDetail, setArticleDetail] = useState([]);
  const [articleContent, setArticleContent] = useState()

  useEffect(() => {
    hljs.configure({
      tabReplace: '',
      classPrefix: 'hljs-',
      languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown'],
    });
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: code => hljs.highlightAuto(code).value,
      gfm: true,
      tables: true,
      breaks: true,
    });

    id && article({ id }).then(res => {
      setArticleDetail(res)
      setArticleContent(res?.content)
    })
    tag().then(res => {
      setTagList(res?.data?.map(item => ({ label: item?.name, value: item?.id + '' })))
    })
    category().then(res => {
      setCategoryList(res?.data?.map(item => ({ label: item?.name, value: item?.id })))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onReset = () => {
    form.resetFields();
  }

  const onFinish = async (data) => {
    id ? await handleUpdate(data) : await handleAdd(data)
  }

  if (id && !articleDetail?.id) return <Spin />;
  console.log('🚀 ~ DetailCard ~ categoryList', categoryList)
  console.log('🚀 ~ DetailCard ~ tagList', tagList)
  console.log('🚀 ~ DetailCard ~ tagList', articleDetail?.tags)
  console.log('🚀 ~ DetailCard', { ...articleDetail, createdAt: moment(articleDetail?.createdAt), updatedAt: moment(articleDetail?.updatedAt) })
  return (
    <Form Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 16 }}
      initialValues={id && { ...articleDetail, createdAt: moment(articleDetail?.createdAt), updatedAt: moment(articleDetail?.updatedAt) }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="标题"
        name="title"
        required
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="分类"
        name="category"
        required
      >
        <Select options={categoryList} />
      </Form.Item>

      <Form.Item
        label="标签"
        name="tags"
        required
      >
        <Select mode="tags" options={tagList} />
      </Form.Item>

      {
        id
          ? (
            <>
              <Form.Item
                label="创建时间"
                name="createdAt"
                required
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" />
              </Form.Item>

              <Form.Item
                label="更新时间"
                name="updatedAt"
                required
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" />
              </Form.Item>
            </>
          )
          :
          null
      }

      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Button htmlType="button" onClick={onReset}>
          重置
        </Button>
        <Divider type="vertical" />
        <Button type="primary" htmlType="submit">
          {id ? '保存' : '新建'}
        </Button>
      </Form.Item>
      <ProCard style={{ margin: 3 }}>
        <ProCard colSpan="50%" layout="center" bordered>
          <Form.Item
            name="content"
            required
            noStyle
          >
            <Input.TextArea
              autoSize
              bordered={false}
              onChange={(event) => { setArticleContent(event?.target?.value) }}
            />
          </Form.Item>
        </ProCard>
        <ProCard layout="center" bordered>
          <div
            style={{ width: '100%' }}
            dangerouslySetInnerHTML={{
              __html: marked(articleContent || '').replace(
                /<pre>/g,
                "<pre id='hljs'>"
              ),
            }}
          />
        </ProCard>
      </ProCard>
    </Form >
  );
};

export default DetailCard;

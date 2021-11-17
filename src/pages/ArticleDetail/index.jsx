import React, { useState, useEffect } from 'react';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Input } from 'antd';
import { marked } from 'marked'
import { useParams } from 'umi';
import { article } from '@/services/article';
import { category } from '@/services/category';
import { tag } from '@/services/tag';
import hljs from 'highlight.js'
import 'highlight.js/styles/magula.css';

const DetailCard = () => {
  const { id } = useParams()
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  }
  const [articleDetail, setArticleDetail] = useState()
  const [categoryList, setCategoryList] = useState([]);
  const [tagList, setTagList] = useState([]);

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

    article({ id }).then(res => {
      setArticleDetail(res.data[0])
    })
    tag().then(res => {
      setTagList(res?.data?.map(item => ({ label: item?.name, value: item?.id })))
    })
    category().then(res => {
      setCategoryList(res?.data?.map(item => ({ label: item?.name, value: item?.id })))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProForm
      {...formItemLayout}
      layout="horizontal"
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values);
        message.success('提交成功');
      }}
      params={{ id }}
      request={article()}
    >
      <ProFormText
        width="md"
        name="title"
        label="标题"
      />
      <ProFormSelect
        width="md"
        name="category"
        label="分类"
        fieldProps={{
          options: categoryList
        }}
      />
      <ProFormSelect
        width="md"
        name="tag"
        label="标签"
        mode="tags"
        fieldProps={{
          options: tagList
        }}
      />

      <ProCard style={{ margin: 3 }}>
        <ProCard colSpan="50%" layout="center" bordered>
          <Input.TextArea
            autoSize
            value={articleDetail?.content || ''}
            onChange={({ target: { value } }) => { setArticleDetail({ ...articleDetail, content: value }) }}
          />
        </ProCard>
        <ProCard layout="center" bordered>
          <div
            dangerouslySetInnerHTML={{
              __html: marked(articleDetail?.content || '').replace(
                /<pre>/g,
                "<pre id='hljs'>"
              ),
            }}
          />
        </ProCard>
      </ProCard>
    </ProForm>
  );
};

export default DetailCard;

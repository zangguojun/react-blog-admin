import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { useParams } from 'umi';
import ProDescriptions from '@ant-design/pro-descriptions';
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/magula.css';
import { article } from '@/services/article';

const DetailCard = () => {
  const { id } = useParams()
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  }

  const [articleDetail, setArticleDetail] = useState()
  useEffect(() => {
    article({ id }).then(res => {
      setArticleDetail(res)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // 配制marked和highlight
  useEffect(() => {
    // 配置highlight
    hljs.configure({
      tabReplace: '',
      classPrefix: 'hljs-',
      languages: ['CSS', 'HTML', 'JavaScript', 'Python', 'TypeScript', 'Markdown'],
    });
    // 配置marked
    marked.setOptions({
      renderer: new marked.Renderer(),
      highlight: code => hljs.highlightAuto(code).value,
      gfm: true, //默认为true。 允许 Git Hub标准的markdown.
      tables: true, //默认为true。 允许支持表格语法。该选项要求 gfm 为true。
      breaks: true, //默认为false。 允许回车换行。该选项要求 gfm 为true。
    });
  }, []);

  return (
    // <ProDescriptions
    //   column={1}
    //   title={currentRow?.title}
    //   request={async () => ({
    //     data: currentRow || {},
    //   })}
    //   params={{
    //     id: currentRow?.name,
    //   }}
    //   columns={columns}
    // />
    ''
  );
};

export default DetailCard;
{/* <Card>
  <div
    className="meContent markdownStyle"
    dangerouslySetInnerHTML={{
      __html: marked('+ 你').replace(
        /<pre>/g,
        "<pre id='hljs'>"
      ),
    }}
  />
</Card> */}
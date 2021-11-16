import React from 'react';
import { Card } from 'antd';
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/magula.css';

const DetailCard = (props) => {
  const { } = props
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
    <Card>
      <div
        className="meContent markdownStyle"
        dangerouslySetInnerHTML={{
          __html: marked().replace(
            /<pre>/g,
            "<pre id='hljs'>"
          ),
        }}
      />
    </Card>
  );
};

export default DetailCard;

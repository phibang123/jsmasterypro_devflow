// components/editor/Preview.tsx
import { Code } from 'bright';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

Code.theme = {
  light: 'github-dark',
  dark: 'github-dark',
  lightSelector: 'html.light',
  darkSelector: 'html.dark',
};

const Preview = ({ content }: { content: string }) => {
  const formattedContent = content.replace(/\\/g, '').replace(/&#x20;/g, ' ');

  return (
    <div className="card-wrapper relative ">
      <section className="markdown prose max-w-none p-4 dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: (props) => (
              <div className="relative">
                <Code
                  {...props}
                  lineNumbers
                  className="border-neutral-200 shadow-light-200  dark:border-neutral-800 dark:shadow-dark-200"
                />
              </div>
            ),
          }}
        >
          {formattedContent}
        </ReactMarkdown>
      </section>
    </div>
  );
};

export default Preview;

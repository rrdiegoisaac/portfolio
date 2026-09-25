import { Highlight, themes } from 'prism-react-renderer'
import './CodeBlock.css'

function CodeBlock({ code, language = 'python', file }) {
  return (
    <figure className="code-block">
      {file && <figcaption className="code-block__file">{file}</figcaption>}
      <Highlight code={code.trim()} language={language} theme={themes.vsDark}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`code-block__pre ${className}`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </figure>
  )
}

export default CodeBlock

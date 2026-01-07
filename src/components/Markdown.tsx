import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import { cn } from '../lib/cn'

export function Markdown({ value, className }: { value: string; className?: string }) {
  return (
    <div className={cn('prose prose-slate max-w-none', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeHighlight]}>
        {value}
      </ReactMarkdown>
    </div>
  )
}


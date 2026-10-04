import NotionText from './NotionText';

// 定義輕量介面並排除 ESLint any 檢查
interface NotionBlockProps {
  block: {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export default function NotionBlock({ block }: NotionBlockProps) {
  const { type } = block;
  const value = block[type];

  switch (type) {
    case 'heading_1':
      return (
        <h1 className="text-2xl font-bold text-zinc-900 mt-6 mb-3 tracking-tight">
          <NotionText text={value.rich_text} />
        </h1>
      );

    case 'heading_2':
      return (
        <h2 className="text-xl font-bold text-zinc-800 mt-5 mb-2 tracking-tight">
          <NotionText text={value.rich_text} />
        </h2>
      );

    case 'heading_3':
      return (
        <h3 className="text-lg font-semibold text-zinc-800 mt-4 mb-2">
          <NotionText text={value.rich_text} />
        </h3>
      );

    case 'paragraph':
      return (
        <p className="text-zinc-600 text-sm leading-relaxed mb-3">
          <NotionText text={value.rich_text} />
        </p>
      );

    case 'bulleted_list_item':
      return (
        <li className="text-zinc-600 text-sm leading-relaxed list-disc ml-5 mb-1">
          <NotionText text={value.rich_text} />
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className="text-zinc-600 text-sm leading-relaxed list-decimal ml-5 mb-1">
          <NotionText text={value.rich_text} />
        </li>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-zinc-300 pl-4 py-1 my-3 text-zinc-600 italic text-sm bg-zinc-50 rounded-r-lg">
          <NotionText text={value.rich_text} />
        </blockquote>
      );

    case 'divider':
      return <hr className="my-6 border-zinc-200" />;

    case 'image':
      const src = value.type === 'external' ? value.external.url : value.file.url;
      const caption = value.caption?.[0]?.plain_text;
      return (
        <figure className="my-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={caption || 'Notion Image'} className="rounded-xl w-full border border-zinc-200 object-cover" />
          {caption && <figcaption className="text-center text-xs text-zinc-400 mt-1.5">{caption}</figcaption>}
        </figure>
      );

    default:
      return null;
  }
}
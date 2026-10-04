interface RichTextItem {
  plain_text: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
}

const colorMap: Record<string, string> = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  green: 'text-green-500',
  yellow: 'text-yellow-600',
  gray: 'text-zinc-400',
  purple: 'text-purple-500',
  pink: 'text-pink-500',
  red_background: 'bg-red-100 text-red-800 px-1 rounded',
  blue_background: 'bg-blue-100 text-blue-800 px-1 rounded',
  yellow_background: 'bg-yellow-100 text-yellow-800 px-1 rounded',
};

export default function NotionText({ text }: { text: RichTextItem[] }) {
  if (!text || text.length === 0) return null;

  return (
    <>
      {text.map((item, index) => {
        const { bold, italic, strikethrough, underline, code, color } = item.annotations;

        const classes = [];
        if (bold) classes.push('font-bold');
        if (italic) classes.push('italic');
        if (strikethrough) classes.push('line-through');
        if (underline) classes.push('underline');
        if (code) classes.push('font-mono bg-zinc-100 text-red-500 px-1.5 py-0.5 rounded text-xs');
        if (color && colorMap[color]) classes.push(colorMap[color]);

        return (
          <span key={index} className={classes.join(' ')}>
            {item.plain_text}
          </span>
        );
      })}
    </>
  );
}
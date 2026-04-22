import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, FontFamily, FontSize } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import styles from "../styles/TiptapRTE.module.css";

const FONTS = [
  { label: "Default", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Sans-serif", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Monospace", value: "'Courier New', Courier, monospace" },
  { label: "Segoe UI", value: "'Segoe UI', Tahoma, sans-serif" },
  { label: "Roboto", value: "'Roboto', sans-serif" },
  { label: "Open Sans", value: "'Open Sans', sans-serif" },
  { label: "Lato", value: "'Lato', sans-serif" },
];

const SIZES = [
  { label: "Size", value: "" },
  { label: "8", value: "8px" },
  { label: "10", value: "10px" },
  { label: "12", value: "12px" },
  { label: "14", value: "14px" },
  { label: "16", value: "16px" },
  { label: "18", value: "18px" },
  { label: "20", value: "20px" },
  { label: "22", value: "22px" },
  { label: "24", value: "24px" },
  { label: "26", value: "26px" },
  { label: "28", value: "28px" },
  { label: "30", value: "30px" },
  { label: "32", value: "32px" },
  { label: "34", value: "34px" },
  { label: "36", value: "36px" },
  { label: "38", value: "38px" },
  { label: "40", value: "40px" },
  { label: "42", value: "42px" },
  { label: "44", value: "44px" },
  { label: "46", value: "46px" },
  { label: "48", value: "48px" },
];

const ToolbarButton = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    title={title}
    className={`${styles.btn}${active ? " " + styles.btnActive : ""}`}
  >
    {children}
  </button>
);

const TiptapRTE = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  const currentFont = editor.getAttributes("textStyle").fontFamily || "";
  const currentSize = editor.getAttributes("textStyle").fontSize || "";
  const currentColor = editor.getAttributes("textStyle").color || "#000000";
  const currentHighlight = editor.getAttributes("highlight").color || "#ffffff";

  const handleFontChange = (e) => {
    const val = e.target.value;
    if (!val) {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(val).run();
    }
  };

  const handleSizeChange = (e) => {
    const val = e.target.value;
    if (!val) {
      editor.chain().focus().unsetFontSize().run();
    } else {
      editor.chain().focus().setFontSize(val).run();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <b>B</b>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <i>I</i>
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>
        <span className={styles.divider} />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
        <span className={styles.divider} />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          &#8226;&#8212;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          1&#8212;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          &#10077;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          &#8212;
        </ToolbarButton>
        <span className={styles.divider} />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          &#8630;
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          &#8631;
        </ToolbarButton>
        <span className={styles.divider} />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <i className="fa-solid fa-align-left" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <i className="fa-solid fa-align-center" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <i className="fa-solid fa-align-right" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <i className="fa-solid fa-align-justify" />
        </ToolbarButton>
        <span className={styles.divider} />
        <span className={styles.divider} />
        <label className={styles.colorLabel} title="Text color">
          <i className="fa-solid fa-font" />
          <input
            type="color"
            className={styles.colorInput}
            value={currentColor}
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
          <span
            className={styles.colorSwatch}
            style={{ background: currentColor }}
          />
        </label>
        <button
          type="button"
          className={styles.btn}
          title="Remove text color"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetColor().run();
          }}
        >
          <i className="fa-solid fa-droplet-slash" />
        </button>
        <label className={styles.colorLabel} title="Highlight color">
          <i className="fa-solid fa-highlighter" />
          <input
            type="color"
            className={styles.colorInput}
            value={currentHighlight}
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setHighlight({ color: e.target.value })
                .run()
            }
          />
          <span
            className={styles.colorSwatch}
            style={{ background: currentHighlight }}
          />
        </label>
        <button
          type="button"
          className={styles.btn}
          title="Remove highlight"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetHighlight().run();
          }}
        >
          <i className="fa-solid fa-eraser" />
        </button>
        <span className={styles.divider} />
        <select
          className={styles.select}
          value={currentFont}
          onChange={handleFontChange}
          title="Font family"
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={currentSize}
          onChange={handleSizeChange}
          title="Font size"
        >
          {SIZES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <EditorContent editor={editor} className={styles.editor} />
    </div>
  );
};

export default TiptapRTE;

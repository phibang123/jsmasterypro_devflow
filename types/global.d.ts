import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";

interface Tags {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

interface QuestionIF {
  _id: string;
  title: string;
  description: string;
  tags: Tags[];
  author: Author;
  upVotes: number;
  answers: number;
  views: number;
  createdAt: Date;
}

interface TagIF {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValue: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_UP" | "SIGN_IN";
}

interface MetricIF {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string;
  href?: string;
  textStyles?: string;
  imgStyles?: string;
  isAuthor?: boolean;
}

interface EditorIF extends MDXEditorProps {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  value: string;
  fieldChange: (value: string) => void;
}

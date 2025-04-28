import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";

interface Tags {
  id: string;
  name: string;
}

interface Author {
  id: string;
  name: string;
  image: string;
}

interface QuestionIF {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: Tags[];
  author: Author;
  upVotes: number;
  downVotes: number;
  answers: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TagIF {
  id: string;
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
  onSubmit: (data: T) => Promise<APIResponse<unknown | T>>;
  formType: "SIGN_UP" | "SIGN_IN";
}

interface MetricIF {
  imgUrl: string;
  alt: string;
  value: string | number;
  title: string | React.ReactNode;
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

interface PaginationSearchParamsIF {
  page?: number;
  pageSize?: number;
  query?: string;
  sort?: string;
  filter?: string;
}

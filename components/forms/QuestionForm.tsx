'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { MDXEditorMethods } from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from '@/hooks/use-toast';
import { createQuestion, editQuestion } from '@/lib/actions/question.action';
import { cn } from '@/lib/utils';
import { AskQuestionSchema } from '@/lib/validations';
import { QuestionIF } from '@/types/global';

import TagCard from '../cards/TagCard';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
});

interface QuestionFormProps {
  isEdit?: boolean;
  question?: QuestionIF;
}

const QuestionForm = ({ isEdit = false, question }: QuestionFormProps) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [inputValues, setInputValues] = useState('');
  const router = useRouter();

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || '',
      description: question?.description || '',
      content: question?.content || '',
      tags: question?.tags?.map((tag) => tag.name) || [],
    },
  });

  const handleCreateOrEditQuestion = async () => {
    const { title, description, content, tags } = form.getValues();
    const questionData = {
      title,
      description,
      content,
      tags,
    };
    let result;

    if (isEdit) {
      if (!question?.id) throw new Error('Question not found');
      result = await editQuestion({
        ...questionData,
        questionId: question.id as string,
      });
    } else {
      result = await createQuestion(questionData);
    }

    const toastMessage = `Question ${isEdit ? 'updated' : 'created'} ${result.success ? 'successfully' : 'with error'}`;
    if (!result.success) {
      toast({
        title: `Error`,
        description: toastMessage,
        variant: 'destructive',
      });
    } else if (result.success && result.data) {
      toast({
        title: 'Success',
        description: toastMessage,
      });
      form.reset();
      router.push(`/question/${result.data.id}`);
    } else {
      toast({
        title: 'Error',
        description:
          result.message ||
          `An error occurred while ${isEdit ? 'updating' : 'creating'} the question`,
        variant: 'destructive',
      });
    }
  };

  const handleTagRemove = (tag: string, filed: { value: string[] }) => {
    const newTags = filed.value.filter((t) => t !== tag);

    form.setValue('tags', newTags);

    if (newTags.length === 0) {
      form.setError('tags', {
        type: 'manual',
        message: 'Tags are required',
      });
    }
  };

  const handleAddTag = (value: string[]) => {
    if (inputValues && inputValues.length < 15 && !value.includes(inputValues)) {
      form.setValue('tags', [...value, inputValues]);
      setInputValues('');
      form.clearErrors('tags');
    } else if (inputValues.length > 15) {
      form.setError('tags', {
        type: 'manual',
        message: 'Tag should be less than 15 characters',
      });
    } else if (value.includes(inputValues)) {
      form.setError('tags', {
        type: 'manual',
        message: 'Tag already exists',
      });
    }
  };

  const handleInputAddTagKeydown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string[] = [],
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(value);
    }
  };

  const handleInputTag = (value: string) => {
    setInputValues(value);
  };

  const handleButtonAddTag = (value: string[]) => {
    handleAddTag(value);
  };

  const renderButtonSubmit = () => {
    if (form.formState.isSubmitting) {
      return 'Submitting...';
    }
    return isEdit ? 'Update Question' : 'Ask A Question';
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateOrEditQuestion)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-light400_light500">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    'paragraph-regular background-light850_dark100 text-dark300_light700 no-focus min-h-[56px] resize-none overflow-hidden border-2',
                    form.formState.errors.title ? '!border-red-500' : 'light-border-2',
                  )}
                  style={{ height: 'auto' }}
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <FormDescription className="body-regular text-light-400">
                  Be specific and imagine you&apos;re asking a question to another person
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-light400_light500">
                Question Description <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  disabled={form.formState.isSubmitting}
                  className={cn(
                    'paragraph-regular background-light850_dark100 text-dark300_light700 no-focus min-h-[56px] resize-none overflow-hidden border-2',
                    form.formState.errors.description ? '!border-red-500' : 'light-border-2',
                  )}
                  style={{ height: 'auto' }}
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <FormDescription className="body-regular text-light-400">
                  Provide a brief description of your question
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-light400_light500">
                Detailed explanation of your problem <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor
                  value={field.value}
                  editorRef={editorRef}
                  markdown="# Hello World"
                  fieldChange={field.onChange}
                  readOnly={form.formState.isSubmitting}
                  className={form.formState.errors.content ? '!border-red-500' : 'light-border-2'}
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <FormDescription className="body-regular text-light-400">
                  Introduce the problem and expand on what you&apos;ve put in the title.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-light400_light500">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <div className="flex items-center gap-2">
                    <Input
                      disabled={form.formState.isSubmitting}
                      className={cn(
                        'paragraph-regular background-light850_dark100 text-dark300_light700 no-focus min-h-[56px] border shadow-light-100 border-2',
                        form.formState.errors.tags ? '!border-red-500' : 'light-border-2',
                      )}
                      placeholder="Add tags... (Press Enter or Add Tag button to add per tag)"
                      value={inputValues}
                      onKeyDown={(e) => handleInputAddTagKeydown(e, field.value)}
                      onChange={(e) => handleInputTag(e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={() => handleButtonAddTag(field.value)}
                      className="primary-button-gradient base-medium w-fit p-6 text-lg font-normal"
                    >
                      Add Tag
                    </Button>
                  </div>
                  {field.value.length > 0 ? (
                    <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                      {field.value.map((tag: string) => (
                        <TagCard
                          key={tag}
                          id={tag}
                          compact
                          remove
                          isButton
                          handleRemove={() => handleTagRemove(tag, field)}
                          name={tag}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5">
                      <TagCard
                        key={'anonymous'}
                        id={'anonymous'}
                        compact
                        name={'?'}
                      />
                      <FormMessage />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className="body-regular text-light-400">
                Add up to 3 tags to describe what your question is about. Press Enter or Add Tag
                button to add per tag
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="primary-button-gradient base-medium w-fit p-6 text-lg font-normal"
          >
            {renderButtonSubmit()}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;

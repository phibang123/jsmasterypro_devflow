'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SIGN_IN } from '@/configs/constance';
import ROUTES from '@/constants/routes';
import { toast } from '@/hooks/use-toast';
import { toUpperCaseTitle } from '@/lib/utils';
import { AuthFormProps } from '@/types/global';

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValue,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValue as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result?.success) {
      const description = `Signed ${formType === SIGN_IN ? 'in' : 'up'} successfully`;
      toast({
        title: 'Success',
        description,
      });
      router.push(ROUTES.HOME);
    } else {
      toast({
        title: `Error`,
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const buttonText = () => {
    if (form.formState.isSubmitting)
      return formType === SIGN_IN ? 'Signing In...' : 'Signing Up...';
    return formType === SIGN_IN ? 'Sign In' : 'Sign Up';
  };

  const handleNameLabel = (name: string) => {
    return name === 'email' ? 'Email Address' : toUpperCaseTitle(name);
  };

  const handleInputType = (name: string) => {
    return name === 'password' ? 'password' : 'text';
  };

  const renderingDirectory = () => {
    return formType === SIGN_IN ? (
      <p>
        Don&apos;t have an account?{' '}
        <Link
          className="paragraph-semibold primary-text-gradient"
          href={ROUTES.SIGN_UP}
        >
          Sign up
        </Link>
      </p>
    ) : (
      <p>
        Already have an account?{' '}
        <Link
          className="paragraph-semibold primary-text-gradient"
          href={ROUTES.SIGN_IN}
        >
          Sign in
        </Link>
      </p>
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-8"
      >
        {Object.keys(defaultValue).map((field, index) => {
          return (
            <FormField
              control={form.control}
              name={field as Path<T>}
              key={`field-${formType}-${index}`}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2.5">
                  <FormLabel className="paragraph-medium text-light400_light500">
                    {handleNameLabel(field.name)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={handleInputType(field.name)}
                      placeholder=""
                      {...field}
                      className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button
          disabled={form.formState.isSubmitting}
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
          type="submit"
        >
          {buttonText()}
        </Button>
        {renderingDirectory()}
      </form>
    </Form>
  );
};

export default AuthForm;

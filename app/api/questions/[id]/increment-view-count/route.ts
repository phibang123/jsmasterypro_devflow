import Question from '@/database/question.model';
import handleError from '@/lib/handlers/error.handler';
import handleSuccess from '@/lib/handlers/success.handler';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { viewCount } = await request.json();
  try {
    const question = await Question.findByIdAndUpdate(id, { $inc: { views: viewCount } });
    return handleSuccess({
      data: question,
      responseType: 'server',
    });
  } catch (error) {
    return handleError({ error, responseType: 'server' }) as ErrorResponse;
  }
}

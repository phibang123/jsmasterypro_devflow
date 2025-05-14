import HomeHeaderLoading from '@/components/loading/home/HomeHeaderLoading';
import QuestionsLoading from '@/components/loading/QuestionsLoading';

const HomeLoadingPage = () => {
  return (
    <div className="flex flex-col">
      <HomeHeaderLoading />
      <QuestionsLoading />
    </div>
  );
};

export default HomeLoadingPage;

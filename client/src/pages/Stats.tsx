import { useLoaderData } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import StatsContainer from '../components/StatsContainer';
import ChartsContainer from '../components/ChartsContainer';

export type DefaultStats = {
  pending: number;
  interview: number;
  declined: number;
};

export type MonthlyApplication = {
  date: string;
  count: number;
};

export type StatsResponse = {
  defaultStats: DefaultStats;
  monthlyApplications: MonthlyApplication[];
};

const Stats = () => {
  const { defaultStats, monthlyApplications } =
    useLoaderData() as StatsResponse;
  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 0 && (
        <ChartsContainer data={monthlyApplications} />
      )}
    </>
  );
};

export const loader = async () => {
  try {
    const response = await customFetch.get('/job/stats');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default Stats;

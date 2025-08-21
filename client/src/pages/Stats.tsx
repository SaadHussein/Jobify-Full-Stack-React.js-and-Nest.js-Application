import { useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import StatsContainer from '../components/StatsContainer';
import ChartsContainer from '../components/ChartsContainer';
import axios from 'axios';
import { toast } from 'react-toastify';
import { QueryClient, useQuery } from '@tanstack/react-query';

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

const statsQuery = {
  queryKey: ['stats'],
  queryFn: async () => {
    try {
      const response = await customFetch.get('/job/stats');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ||
            'An error occurred while fetching stats',
        );
        return error;
      }

      toast.error('An error occurred while fetching stats');
      return error;
    }
  },
};

export const loader = (queryClient: QueryClient) => {
  return async (_args: LoaderFunctionArgs) => {
    await queryClient.ensureQueryData(statsQuery);
    return null;
  };
};

const Stats = () => {
  const { data } = useQuery(statsQuery);
  const { defaultStats, monthlyApplications } = data;

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 0 && (
        <ChartsContainer data={monthlyApplications} />
      )}
    </>
  );
};

export default Stats;

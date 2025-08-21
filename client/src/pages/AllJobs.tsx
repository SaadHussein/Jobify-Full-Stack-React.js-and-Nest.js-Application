import { useLoaderData, type ActionFunctionArgs } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import axios from 'axios';
import SearchContainer from '../components/SearchContainer';
import JobsContainer from '../components/JobsContainer';
import { createContext, useContext } from 'react';

export type JobStatus = 'interview' | 'declined' | 'pending';
export type JobType = 'full-time' | 'part-time' | 'internship';

export interface Job {
  _id: string;
  company: string;
  position: string;
  jobStatus: JobStatus;
  jobType: JobType;
  jobLocation: string;
  createdAt: string;
  // createdBy: string;
  // updatedAt: string;
}

interface AllJobsContextType {
  data: FindAllJobsResponse;
  searchValues: Record<string, string>;
}

export interface FindAllJobsResponse {
  totalJobs: number;
  numOfPages: number;
  currentPage: number;
  jobs: Job[];
}

const AllJobsContext = createContext<AllJobsContextType | undefined>(undefined);

const AllJobs = () => {
  const { data, searchValues } = useLoaderData() as {
    data: FindAllJobsResponse;
    searchValues: Record<string, string>;
  };

  return (
    <AllJobsContext.Provider value={{ data, searchValues }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};
export default AllJobs;
export const useAllJobsContext = () => {
  const context = useContext(AllJobsContext);
  if (!context) {
    throw new Error('useAllJobsContext must be used within AllJobsProvider');
  }
  return context;
};

export const loader = async ({ request }: ActionFunctionArgs) => {
  try {
    console.log('بجرب تيست');
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    const { data } = await customFetch.get('/job', {
      params,
    });

    return {
      data,
      searchValues: { ...params },
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || 'Failed to fetch jobs');
      return error;
    }

    toast.error('Unexpected error');
    return error;
  }
};

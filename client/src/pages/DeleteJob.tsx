import { redirect, type ActionFunctionArgs } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import axios from 'axios';

export async function action({ params }: ActionFunctionArgs) {
  try {
    await customFetch.delete(`/job/${params.id}`);
    toast.success('Job deleted successfully');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error?.response?.data?.message || 'Failed to delete job');
      return error;
    }

    toast.error('Something went wrong');
    return error;
  }
  return redirect('/dashboard/all-jobs');
}

import {
  Form,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
} from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import axios from 'axios';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { FormRow } from '../components';
import FormRowSelect from '../components/FormRowSelect';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants';
import SubmitBtn from '../components/SubmitBtn';
import { useQuery, type QueryClient } from '@tanstack/react-query';

const singleJobQuery = (id: string) => {
  return {
    queryKey: ['job', id],
    queryFn: async () => {
      const { data } = await customFetch.get(`/job/${id}`);
      return data;
    },
  };
};

const EditJob = () => {
  const id = useLoaderData();
  const { data: job } = useQuery(singleJobQuery(`${id}`));

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={job.jobLocation}
          />

          <FormRowSelect
            name="jobStatus"
            labelText="job status"
            defaultValue={job.jobStatus}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={job.jobType}
            list={Object.values(JOB_TYPE)}
          />
          <SubmitBtn formBtn={true} />
        </div>
      </Form>
    </Wrapper>
  );
};
export default EditJob;

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: ActionFunctionArgs) => {
    try {
      if (!params.id) {
        toast.error('Job ID is required');
        return redirect('/dashboard/all-jobs');
      }
      await queryClient.ensureQueryData(singleJobQuery(params.id));
      return params.id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data?.message || 'Failed to load job details',
        );
      } else {
        toast.error('Something went wrong');
      }

      return redirect('/dashboard/all-jobs');
    }
  };

export const action =
  (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      await customFetch.patch(`/job/${params.id}`, data);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job edited successfully');
      return redirect('/dashboard/all-jobs');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
        return error;
      }

      toast.error('Unexpected error');
      return error;
    }
  };

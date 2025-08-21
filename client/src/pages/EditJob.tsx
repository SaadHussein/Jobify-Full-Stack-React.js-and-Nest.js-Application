import {
  Form,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
} from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import axios from 'axios';
import type { Job } from './AllJobs';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { FormRow } from '../components';
import FormRowSelect from '../components/FormRowSelect';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants';
import SubmitBtn from '../components/SubmitBtn';

const EditJob = () => {
  const job = useLoaderData() as Job;

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

export const loader = async ({ params }: ActionFunctionArgs) => {
  try {
    const { data } = await customFetch.get(`/job/${params.id}`);
    return data;
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/job/${params.id}`, data);
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

import {
  Form,
  redirect,
  useOutletContext,
  type ActionFunctionArgs,
} from 'react-router-dom';
import { FormRow } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import type { User } from './DashboardLayout';
import FormRowSelect from '../components/FormRowSelect';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import axios from 'axios';
import SubmitBtn from '../components/SubmitBtn';
import type { QueryClient } from '@tanstack/react-query';

const AddJob = () => {
  const { user } = useOutletContext() as { user: User };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">add job</h4>
        <div className="form-center">
          <FormRow type="text" name="position" />
          <FormRow type="text" name="company" />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={user.location}
          />

          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            defaultValue={JOB_STATUS.PENDING}
            list={Object.values(JOB_STATUS)}
          />
          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={JOB_TYPE.FULL_TIME}
            list={Object.values(JOB_TYPE)}
          />

          <SubmitBtn formBtn={true} />
        </div>
      </Form>
    </Wrapper>
  );
};
export default AddJob;

export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      await customFetch.post('/job', data);
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job added successfully');
      return redirect('all-jobs');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
        return error;
      }

      toast.error('Unexpected error');
      return error;
    }
  };

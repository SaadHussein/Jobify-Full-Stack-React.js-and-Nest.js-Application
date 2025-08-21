import {
  Form,
  redirect,
  Link,
  type ActionFunctionArgs,
} from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import axios from 'axios';
import SubmitBtn from '../components/SubmitBtn';

const Register = () => {
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow type="text" name="name" />
        <FormRow type="text" name="lastName" labelText="Last Name" />
        <FormRow type="text" name="location" />
        <FormRow type="email" name="email" />

        <FormRow type="password" name="password" />

        <SubmitBtn formBtn={true} />
        <p>
          Already a member?{' '}
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};

export default Register;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/register', data);
    toast.success('Registration successful');
    return redirect('/login');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || 'Something went wrong');
      return error;
    }

    toast.error('Unexpected error');
    return error;
  }
};

import {
  Link,
  Form,
  redirect,
  type ActionFunctionArgs,
  useActionData,
  useNavigate,
} from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import axios from 'axios';
import SubmitBtn from '../components/SubmitBtn';

type ActionErrors = {
  msg: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const errors: ActionErrors = { msg: '' };
  if ((data.password as string).length < 3) {
    errors.msg = 'password too short';
    return errors;
  }

  try {
    await customFetch.post('/auth/login', data);
    toast.success('Login successful');
    return redirect('/dashboard');
  } catch (error) {
    // if (axios.isAxiosError(error)) {
    //   toast.error(error.response?.data?.message || 'Something went wrong');
    //   return error;
    // }
    // toast.error('Unexpected error');
    // return error;

    if (axios.isAxiosError(error)) {
      errors.msg = error?.response?.data?.message || 'Something went wrong';
      return errors;
    }

    errors.msg = 'Unexpected error';
    return errors;
  }
};

const Login = () => {
  const errors = useActionData() as ActionErrors | null;
  const navigate = useNavigate();

  const loginDemoUser = async () => {
    const data = {
      email: 'test@test.com',
      password: 'secret123',
    };
    try {
      await customFetch.post('/auth/login', data);
      toast.success('take a test drive');
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      } else {
        toast.error('Something went wrong');
      }
    }
  };

  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />

        {errors && <p style={{ color: 'red' }}>{errors.msg}</p>}

        <SubmitBtn formBtn={true} />
        <button type="button" className="btn btn-block" onClick={loginDemoUser}>
          explore the app
        </button>

        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;

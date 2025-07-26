import { Link, useRouteError } from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import img from "../assets/images/not-found.svg";

type RouteError = {
  status: number;
  statusText?: string;
  message?: string;
};

const Error = () => {
  const error = useRouteError() as RouteError;
  console.log(error);

  if (error.status === 404) {
    return (
      <Wrapper>
        <div>
          <img src={img} alt="not found" />
          <h3>Oops! Page not found</h3>
          <p>We can't seem to find the page you're looking for.</p>
          <Link to={"/dashboard"}>Back Home</Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div>
        <h3>something went wrong</h3>
      </div>
    </Wrapper>
  );
};
export default Error;

import Wrapper from '../assets/wrappers/JobsContainer';
import { useAllJobsContext } from '../pages/AllJobs';
import Joob from './Job';
import PageBtnContainer from './PageBtnContainer';

const JobsContainer = () => {
  const { data } = useAllJobsContext();
  const { jobs, totalJobs, numOfPages } = data;
  console.log(numOfPages);
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <h5>
        {totalJobs} job{jobs.length > 1 && 's'} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Joob key={job._id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};
export default JobsContainer;

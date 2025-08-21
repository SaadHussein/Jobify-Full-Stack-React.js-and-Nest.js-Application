import { useState } from 'react';

import BarChartComponent from './BarChartComponent';
import type { MonthlyApplication } from '../pages/Stats';
import Wrapper from '../assets/wrappers/ChartsContainer';
import AreaChartComponent from './AreaChartComponent';

const ChartsContainer = ({ data }: { data: MonthlyApplication[] }) => {
  const [barChart, setBarChart] = useState(true);

  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {barChart ? 'Area Chart' : 'Bar Chart'}
      </button>
      {barChart ? (
        <BarChartComponent data={data} />
      ) : (
        <AreaChartComponent data={data} />
      )}
    </Wrapper>
  );
};

export default ChartsContainer;

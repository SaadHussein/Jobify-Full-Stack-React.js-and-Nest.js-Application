import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { BigSidebar, Navbar, SmallSidebar } from '../components';
import { createContext, useContext, useState } from 'react';
import { checkDefaultTheme } from '../App';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

interface DashboardContextType {
  user: User;
  showSidebar: boolean;
  toggleSidebar: () => void;
  isDarkTheme: boolean;
  toggleTheme: () => void;
  logoutUser: () => Promise<void>;
}

export interface User {
  name: string;
  email: string;
  lastName: string;
  location: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export const loader = async () => {
  try {
    const { data } = await customFetch('/user/me');
    console.log('آععععععععععععععععععععععع');
    return data;
  } catch (error) {
    return redirect('/');
  }
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

const DashboardLayout = () => {
  const { user } = useLoaderData() as { user: User };
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(checkDefaultTheme());

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme.toString());
  };

  const logoutUser = async () => {
    navigate('/');
    await customFetch.get('/auth/logout');
    toast.success('Logging out...');
  };
  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        toggleSidebar,
        isDarkTheme,
        toggleTheme,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      'useDashboardContext must be used within a DashboardProvider',
    );
  }
  return context;
};

export default DashboardLayout;

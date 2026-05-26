import { Navigate, Route, Routes } from 'react-router-dom';
import { DepletionsView } from './components/DepletionsView';
import { DistributionView } from './components/DistributionView';
import { LandingPage } from './pages/LandingPage';
import { MarketingPage } from './pages/MarketingPage';
import { SalesDashboardPage } from './pages/SalesDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/sales" element={<SalesDashboardPage />}>
        <Route index element={<Navigate to="distribution" replace />} />
        <Route path="distribution" element={<DistributionView />} />
        <Route path="depletions" element={<DepletionsView />} />
      </Route>
      <Route path="/marketing" element={<MarketingPage />} />
      {/* Fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;

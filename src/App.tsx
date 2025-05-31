import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout'; // Your main layout component
import IPSSQuestionnaire from '@/pages/IPSSQuestionnaire';
import MIPROQuestionnaire from '@/pages/MIPROQuestionnaire';
import EnuresisQuestionnaire from '@/pages/EnuresisQuestionnaire';
import HomePage from '@/pages/HomePage'; // Create this if missing
import NotFoundPage from '@/pages/NotFoundPage'; // Create this for 404 handling

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Main routes */}
          <Route index element={<HomePage />} />
          <Route path="ipss" element={<IPSSQuestionnaire />} />
          <Route path="mipro" element={<MIPROQuestionnaire />} />
          <Route path="enuresis" element={<EnuresisQuestionnaire />} />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

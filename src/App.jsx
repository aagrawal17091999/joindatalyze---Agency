import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Tools from './pages/Tools';
import ToolLanding from './pages/ToolLanding';
import CaseStudies from './pages/CaseStudies';
import CaseStudy from './pages/CaseStudy';
import Resources from './pages/Resources';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';
import AIAnalyticsAgent from './pages/AIAnalyticsAgent';
import MaturityGraderQuiz from './pages/MaturityGraderQuiz';
import MaturityGraderResults from './pages/MaturityGraderResults';
import { MaturityGraderProvider } from './context/MaturityGraderContext';

export default function App() {
  useEffect(() => {
    document.dispatchEvent(new Event('prerender-ready'));
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/tools" element={<Tools />} />
        <Route element={<MaturityGraderProvider />}>
          <Route path="/tools/analytics-maturity-grader" element={<MaturityGraderQuiz />} />
          <Route path="/tools/analytics-maturity-grader/results" element={<MaturityGraderResults />} />
        </Route>
        <Route path="/tools/:toolId" element={<ToolLanding />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudy />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ai-analytics-agent" element={<AIAnalyticsAgent />} />      </Routes>
    </Layout>
  );
}

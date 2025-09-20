import React, { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiSearch, FiX } from 'react-icons/fi';
import { apiService } from '../../services/apiService';
import './FAQ.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category_name?: string;
  view_count?: number;
  helpful_count?: number;
  created_at?: string;
}

const FAQ: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Load FAQs from API
  useEffect(() => {
    fetchFAQs();
    fetchCategories();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFAQs();
      setFaqs(response.results || response);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      // Fallback to hardcoded data
      setFaqs([
        {
          id: 1,
          question: 'How do I book an appointment?',
          answer: 'You can book appointments through our patient portal. Navigate to the "Appointments" section and click "Schedule New Appointment". Choose your provider, preferred date and time, and reason for visit. You\'ll receive a confirmation email with all details.',
          category_name: 'Appointments'
        },
        {
          id: 2,
          question: 'Where can I see my test results?',
          answer: 'Test results are available in the "Health Records" section of your patient portal. Most results are available within 24-48 hours after processing. You\'ll receive a notification when new results are available. For sensitive results, your provider may release them after discussing with you.',
          category_name: 'Medical Records'
        },
        {
          id: 3,
          question: 'How do I contact support?',
          answer: 'Our support team is available through multiple channels:\n\n1. Phone: (800) 555-1234 (Mon-Fri, 8am-6pm)\n2. Secure messaging in the portal (24/7)\n3. Email: support@healthcare.com (response within 24 hours)\n4. Live chat during business hours\n\nFor urgent medical concerns, please call your provider directly.',
          category_name: 'Support'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getFAQCategories();
      const categoryNames = response.results ? response.results.map((cat: any) => cat.name) : response.map((cat: any) => cat.name);
      setCategories(categoryNames);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories(['Appointments', 'Medical Records', 'Support', 'Technology', 'Medications']);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const response = await apiService.searchFAQs(searchTerm, selectedCategory);
        setFaqs(response.results || response);
      } catch (error) {
        console.error('Failed to search FAQs:', error);
      }
    } else {
      fetchFAQs();
    }
  };

  const handleFeedback = async (faqId: number, isHelpful: boolean) => {
    try {
      await apiService.submitFAQFeedback(faqId, isHelpful);
      // Optionally show a success message
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const filteredFAQs = faqs.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? item.category_name === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const toggleQuestion = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    fetchFAQs();
  };

  if (loading) {
    return (
      <section className="faq-container">
        <div className="loading">Loading FAQs...</div>
      </section>
    );
  }

  return (
    <section className="faq-container" aria-labelledby="faq-title">
      <header className="faq-header">
        <h1 id="faq-title">Frequently Asked Questions</h1>
        <p className="faq-subtitle">Find answers to common questions about our services and patient portal</p>
      </header>

      <div className="faq-controls">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
            aria-label="Search FAQs"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="clear-search"
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
          
          {(searchTerm || selectedCategory) && (
            <button onClick={clearFilters} className="clear-filters">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="faq-results">
        {filteredFAQs.length === 0 ? (
          <div className="no-results">
            <p>No FAQs found matching your criteria.</p>
            <button onClick={clearFilters} className="clear-filters">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFAQs.map((item) => (
              <div key={item.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleQuestion(item.id)}
                  aria-expanded={expandedId === item.id}
                  aria-controls={`faq-answer-${item.id}`}
                >
                  <span className="question-text">{item.question}</span>
                  <span className="question-meta">
                    {item.category_name && (
                      <span className="category-badge">{item.category_name}</span>
                    )}
                    {expandedId === item.id ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </button>
                
                {expandedId === item.id && (
                  <div 
                    id={`faq-answer-${item.id}`}
                    className="faq-answer"
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                  >
                    <div className="answer-content">
                      {item.answer.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                    
                    <div className="faq-feedback">
                      <p>Was this helpful?</p>
                      <div className="feedback-buttons">
                        <button 
                          onClick={() => handleFeedback(item.id, true)}
                          className="feedback-button helpful"
                          aria-label="Mark as helpful"
                        >
                          👍 Yes
                        </button>
                        <button 
                          onClick={() => handleFeedback(item.id, false)}
                          className="feedback-button not-helpful"
                          aria-label="Mark as not helpful"
                        >
                          👎 No
                        </button>
                      </div>
                      {item.helpful_count && (
                        <span className="helpful-count">
                          {item.helpful_count} people found this helpful
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="faq-footer">
        <p>Still have questions? <a href="/support">Contact our support team</a></p>
      </div>
    </section>
  );
};

export default FAQ;

import React from 'react';
import { Globe, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import ResultCard from './ResultCard';

const StatusCard = ({ status = 200, url = 'example.com' }) => {
  const getStatusInfo = (code) => {
    if (code >= 200 && code < 300) return { category: 'success', text: 'OK', Icon: CheckCircle2 };
    if (code >= 300 && code < 400) return { category: 'redirect', text: 'Redirect', Icon: Info };
    if (code === 404) return { category: 'not-found', text: 'Not Found', Icon: AlertTriangle };
    if (code >= 500) return { category: 'danger', text: 'Server Error', Icon: XCircle };
    return { category: 'warning', text: 'Unknown', Icon: AlertTriangle };
  };

  const { category, text, Icon: StatusIcon } = getStatusInfo(status);
  
  // Map internal categories to CSS classes
  const cssClass = category === 'redirect' ? 'redirect' : 
                   category === 'not-found' ? 'not-found' : 
                   category === 'success' ? 'success' : 
                   category === 'danger' ? 'danger' : 'warning';
                   
  const badgeClass = category === 'redirect' ? 'accent' : 
                     category === 'not-found' ? 'highlight' : 
                     category === 'success' ? 'success' : 
                     category === 'danger' ? 'danger' : 'warning';

  const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;

  return (
    <ResultCard
      icon={Globe}
      iconVariant={badgeClass}
      title="HTTP Status"
      detail={`HTTP response status for ${domain}`}
    >
      <div className="flex-between mt-16">
        <div className={`status-code ${cssClass}`}>
          {status}
        </div>
        <div className={`result-badge result-badge--${badgeClass}`}>
          <StatusIcon size={14} />
          {text}
        </div>
      </div>
    </ResultCard>
  );
};

export default StatusCard;

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

interface CalendlyWidgetProps {
  calendlyUrl: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: {
      [key: string]: string;
    };
  };
  onEventScheduled?: () => void;
}

const buildCalendlyUrl = (baseUrl: string, prefill?: CalendlyWidgetProps['prefill']): string => {
  if (!prefill) {
    console.log('[Calendly] No prefill data provided');
    return baseUrl;
  }
  
  const params = new URLSearchParams();
  
  if (prefill.name) {
    params.append('name', prefill.name);
    console.log('[Calendly] Prefilling name:', prefill.name);
  }
  if (prefill.email) {
    params.append('email', prefill.email);
    console.log('[Calendly] Prefilling email:', prefill.email);
  }
  
  // Add custom answers as a1, a2, a3, etc.
  if (prefill.customAnswers) {
    const answers = Object.values(prefill.customAnswers);
    console.log('[Calendly] Custom answers:', answers);
    answers.forEach((value, index) => {
      if (value) params.append(`a${index + 1}`, value);
    });
  }
  
  const queryString = params.toString();
  const finalUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;
  console.log('[Calendly] Final URL built:', finalUrl);
  return finalUrl;
};

const buildPopupEmbedUrl = (url: string): string => {
  const u = new URL(url);
  u.searchParams.set('embed_domain', window.location.hostname);
  u.searchParams.set('embed_type', 'PopupWidget');
  return u.toString();
};

export const CalendlyWidget: React.FC<CalendlyWidgetProps> = ({
  calendlyUrl,
  prefill,
  onEventScheduled,
}) => {
  const [showFallback, setShowFallback] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [popupOpened, setPopupOpened] = useState(false);
  const [customPopupOpen, setCustomPopupOpen] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const fullUrl = buildCalendlyUrl(calendlyUrl, prefill);
  const popupEmbedUrl = buildPopupEmbedUrl(fullUrl);
  
  // Detect if we're in a preview environment
  const isPreview = 
    window.location.hostname.includes('lovable.app') ||
    window.location.hostname.includes('lovableproject.com') ||
    window.location.hostname.startsWith('preview--');

  console.log('[Calendly] Component mounted with URL:', calendlyUrl);
  console.log('[Calendly] Prefill data:', prefill);
  console.log('[Calendly] Preview mode:', isPreview);

  useEffect(() => {
    console.log('[Calendly] useEffect triggered');
    const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
    console.log('[Calendly] Existing script found:', !!existingScript);
    
    let hasReceivedCalendlyEvent = false;
    
    const initializeWidget = () => {
      console.log('[Calendly] initializeWidget called');
      console.log('[Calendly] widgetContainerRef.current:', widgetContainerRef.current);
      console.log('[Calendly] window.Calendly exists:', !!window.Calendly);
      
      // PREVIEW MODE: Skip inline, auto-open custom popup
      if (isPreview) {
        console.log('[Calendly] Preview mode detected - opening custom popup directly');
        setIsInitializing(false);
        setShowFallback(true);
        
        if (!popupOpened) {
          setTimeout(() => {
            console.log('[Calendly] Auto-opening custom popup in preview mode');
            setCustomPopupOpen(true);
            setPopupOpened(true);
          }, 500);
        }
        return;
      }
      
      // PRODUCTION MODE: Try inline with fallbacks
      if (window.Calendly && widgetContainerRef.current) {
        try {
          console.log('[Calendly] Initializing inline widget with URL:', fullUrl);
          
          // Clear any existing content
          widgetContainerRef.current.innerHTML = '';
          
          // Manually initialize the inline widget
          window.Calendly.initInlineWidget({
            url: fullUrl,
            parentElement: widgetContainerRef.current,
          });
          
          setScriptLoaded(true);
          console.log('[Calendly] Widget initialized successfully');
          
          // Manual iframe fallback if initInlineWidget doesn't create iframe
          setTimeout(() => {
            if (widgetContainerRef.current) {
              const iframe = widgetContainerRef.current.querySelector('iframe');
              
              if (!iframe) {
                console.warn('[Calendly] No iframe created by initInlineWidget, creating manual iframe');
                const manualIframe = document.createElement('iframe');
                manualIframe.src = fullUrl;
                manualIframe.width = '100%';
                manualIframe.height = '700';
                manualIframe.style.border = '0';
                manualIframe.title = 'Schedule a consultation';
                widgetContainerRef.current.appendChild(manualIframe);
              }
            }
          }, 1500);
          
          // Check if iframe rendered within 3 seconds
          setTimeout(() => {
            if (widgetContainerRef.current) {
              const iframe = widgetContainerRef.current.querySelector('iframe');
              console.log('[Calendly] Iframe check - found:', !!iframe);
              
              if (!iframe) {
                console.warn('[Calendly] No iframe found after 3 seconds, showing fallback');
                setShowFallback(true);
                setIsInitializing(false);
              }
            }
          }, 3000);

          // Watchdog: if iframe exists but still loading after 5s, auto-open popup
          setTimeout(() => {
            if (widgetContainerRef.current) {
              const iframe = widgetContainerRef.current.querySelector('iframe');
              if (iframe && !hasReceivedCalendlyEvent) {
                console.warn('[Calendly] Iframe stalled after 5s, showing fallback and auto-opening popup');
                setIsInitializing(false);
                setShowFallback(true);
                
                // Auto-open popup as fallback
                if (window.Calendly && !popupOpened) {
                  console.log('[Calendly] Auto-opening popup as fallback');
                  window.Calendly.initPopupWidget({ url: fullUrl });
                  setPopupOpened(true);
                }
              }
            }
          }, 5000);
        } catch (error) {
          console.error('[Calendly] Error initializing widget:', error);
          setShowFallback(true);
          setIsInitializing(false);
        }
      } else {
        console.warn('[Calendly] Cannot initialize - Missing Calendly or container');
        console.log('[Calendly] window.Calendly:', window.Calendly);
        console.log('[Calendly] widgetContainerRef.current:', widgetContainerRef.current);
      }
    };
    
    if (!existingScript) {
      console.log('[Calendly] Loading script for the first time');
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        console.log('[Calendly] Script loaded successfully');
        setScriptLoaded(true);
        initializeWidget();
      };
      script.onerror = (error) => {
        console.error('[Calendly] Script failed to load:', error);
        setShowFallback(true);
        setIsInitializing(false);
      };
      document.body.appendChild(script);
    } else {
      console.log('[Calendly] Script already exists');
      // Script already loaded
      if (window.Calendly) {
        console.log('[Calendly] Calendly API ready, initializing immediately');
        setScriptLoaded(true);
        initializeWidget();
      } else {
        console.log('[Calendly] Script exists but Calendly not ready, waiting...');
        // Wait for script to be ready
        setTimeout(() => {
          console.log('[Calendly] Retrying initialization after delay');
          initializeWidget();
        }, 500);
      }
    }

    // Listen for Calendly messages - accept any calendly.com subdomain
    const handleMessage = (e: MessageEvent) => {
      try {
        const originUrl = new URL(e.origin);
        if (originUrl.hostname.endsWith('calendly.com')) {
          // Mark that we've received a Calendly event (widget loaded successfully)
          if (e.data.event === 'calendly.profile_page_viewed' || 
              e.data.event === 'calendly.event_type_viewed' ||
              e.data.event === 'calendly.date_and_time_selected') {
            console.log('[Calendly] Widget loaded successfully:', e.data.event);
            hasReceivedCalendlyEvent = true;
            setIsInitializing(false);
          }
          
          if (e.data.event === 'calendly.event_scheduled') {
            console.log('[Calendly] Event scheduled!');
            onEventScheduled?.();
          }
        }
      } catch (err) {
        // Ignore invalid origins
      }
    };
    
    window.addEventListener('message', handleMessage);

    return () => {
      console.log('[Calendly] Cleanup - removing message listener');
      window.removeEventListener('message', handleMessage);
    };
  }, [fullUrl, onEventScheduled, isPreview, popupOpened]);

  const handleOpenPopup = () => {
    // In preview, always use custom popup
    if (isPreview) {
      setCustomPopupOpen(true);
      setPopupOpened(true);
      return;
    }
    
    // In production, try Calendly script popup first, fallback to custom
    if (window.Calendly) {
      try {
        window.Calendly.initPopupWidget({ url: fullUrl });
        setPopupOpened(true);
        
        // Verify popup opened, otherwise use custom
        setTimeout(() => {
          const calendlyOverlay = document.querySelector('[data-calendly-root]');
          if (!calendlyOverlay) {
            console.log('[Calendly] Script popup failed, using custom dialog');
            setCustomPopupOpen(true);
          }
        }, 250);
      } catch {
        setCustomPopupOpen(true);
      }
    } else {
      setCustomPopupOpen(true);
    }
  };

  return (
    <>
      <Dialog open={customPopupOpen} onOpenChange={setCustomPopupOpen}>
        <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 overflow-hidden">
          <iframe 
            src={popupEmbedUrl} 
            className="w-full h-full" 
            title="Calendly Scheduler" 
            style={{ border: 0 }} 
          />
        </DialogContent>
      </Dialog>
      
      <div className="calendly-widget-container min-h-[700px] bg-background rounded-lg">
      {showFallback ? (
        <div className="flex flex-col items-center justify-center min-h-[700px] gap-6 p-8 text-center">
          <Calendar className="w-16 h-16 text-primary" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Schedule Your Consultation</h3>
            {isPreview ? (
              <>
                <p className="text-muted-foreground mb-4">
                  You're viewing a preview. {popupOpened ? 'The scheduler popup should be open.' : 'Opening scheduler popup...'}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {popupOpened ? 'Need to reopen it or prefer a new tab?' : 'Popup blocked? Use the buttons below:'}
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">
                  The inline calendar couldn't load.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Use the popup scheduler or open in a new tab:
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="default"
              size="lg"
              onClick={handleOpenPopup}
              disabled={isPreview ? false : !scriptLoaded}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {popupOpened ? 'Reopen Popup' : 'Open Popup'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
            >
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
            </Button>
          </div>
          {!isPreview && (
            <p className="text-xs text-muted-foreground mt-4 max-w-md">
              <strong>Tip:</strong> The popup keeps you on our site while scheduling your consultation.
            </p>
          )}
        </div>
      ) : (
        <div className="relative min-h-[700px]">
          {isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading calendar...</p>
                </div>
                
                <div className="pt-6 border-t border-border/40 space-y-3">
                  <p className="text-xs text-muted-foreground">Taking too long?</p>
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleOpenPopup}
                    >
                      <Calendar className="w-3 h-3 mr-1.5" />
                      Open Popup
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        New Tab
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div 
            ref={widgetContainerRef}
            className="calendly-inline-widget" 
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      )}
      </div>
    </>
  );
};

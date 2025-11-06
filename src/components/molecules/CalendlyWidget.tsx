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

const addEmbedParams = (url: string, mode: 'Inline' | 'PopupWidget'): string => {
  const u = new URL(url);
  u.searchParams.set('embed_domain', window.location.hostname);
  u.searchParams.set('embed_type', mode);
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
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeBlockWarn, setIframeBlockWarn] = useState(false);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const fullUrl = buildCalendlyUrl(calendlyUrl, prefill);
  const inlineUrl = addEmbedParams(fullUrl, 'Inline');
  const popupUrl = addEmbedParams(fullUrl, 'PopupWidget');
  const popupEmbedUrl = inlineUrl; // For custom dialog iframe
  
  // Detect if we're in a preview environment
  const isPreview = 
    window.location.hostname.includes('lovable.app') ||
    window.location.hostname.includes('lovableproject.com') ||
    window.location.hostname.startsWith('preview--');

  console.log('[Calendly] ===== Component Mounted =====');
  console.log('[Calendly] Timestamp:', new Date().toISOString());
  console.log('[Calendly] URL:', calendlyUrl);
  console.log('[Calendly] Prefill data:', prefill);
  console.log('[Calendly] Preview mode:', isPreview);
  console.log('[Calendly] Current hostname:', window.location.hostname);
  console.log('[Calendly] Current protocol:', window.location.protocol);

  useEffect(() => {
    console.log('[Calendly] ===== useEffect Triggered =====');
    console.log('[Calendly] Timestamp:', new Date().toISOString());
    
    // Check for CSP meta tag
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (cspMeta) {
      const cspContent = cspMeta.getAttribute('content');
      console.log('[Calendly] CSP meta tag found:', cspContent);
      console.log('[Calendly] CSP includes frame-src:', cspContent?.includes('frame-src'));
      console.log('[Calendly] CSP includes calendly.com:', cspContent?.includes('calendly.com'));
    } else {
      console.log('[Calendly] No CSP meta tag found in document');
    }
    
    const existingScript = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
    console.log('[Calendly] Existing Calendly script found:', !!existingScript);
    if (existingScript) {
      console.log('[Calendly] Script src:', existingScript.getAttribute('src'));
    }
    
    let hasReceivedCalendlyEvent = false;
    
    const initializeWidget = () => {
      console.log('[Calendly] ===== initializeWidget Called =====');
      console.log('[Calendly] Timestamp:', new Date().toISOString());
      console.log('[Calendly] widgetContainerRef.current exists:', !!widgetContainerRef.current);
      console.log('[Calendly] Container element:', widgetContainerRef.current);
      console.log('[Calendly] window.Calendly exists:', !!window.Calendly);
      if (window.Calendly) {
        console.log('[Calendly] Calendly API methods:', Object.keys(window.Calendly));
      }
      
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
          console.log('[Calendly] ===== Initializing Inline Widget =====');
          console.log('[Calendly] Base URL:', fullUrl);
          console.log('[Calendly] Inline URL with embed params:', inlineUrl);
          console.log('[Calendly] Container ready:', !!widgetContainerRef.current);
          
          // Clear any existing content
          const previousContent = widgetContainerRef.current.innerHTML;
          console.log('[Calendly] Previous container content:', previousContent.substring(0, 100));
          widgetContainerRef.current.innerHTML = '';
          console.log('[Calendly] Container cleared');
          
          // Manually initialize the inline widget
          console.log('[Calendly] Calling Calendly.initInlineWidget...');
          window.Calendly.initInlineWidget({
            url: inlineUrl,
            parentElement: widgetContainerRef.current,
          });
          
          setScriptLoaded(true);
          console.log('[Calendly] ✓ initInlineWidget called successfully');
          console.log('[Calendly] Waiting for iframe to be created...');
          
          // Manual iframe fallback if initInlineWidget doesn't create iframe
          setTimeout(() => {
            console.log('[Calendly] ===== 1.5s Check: Iframe Creation =====');
            if (widgetContainerRef.current) {
              const iframe = widgetContainerRef.current.querySelector('iframe');
              console.log('[Calendly] Iframe found:', !!iframe);
              
              if (!iframe) {
                console.warn('[Calendly] ⚠ No iframe created by initInlineWidget');
                console.log('[Calendly] Container HTML:', widgetContainerRef.current.innerHTML.substring(0, 200));
                console.log('[Calendly] Creating manual iframe as fallback...');
                
                const manualIframe = document.createElement('iframe');
                manualIframe.src = inlineUrl;
                manualIframe.width = '100%';
                manualIframe.height = '700';
                manualIframe.style.border = '0';
                manualIframe.title = 'Schedule a consultation';
                
                manualIframe.addEventListener('load', () => {
                  console.log('[Calendly] ✓ Manual iframe loaded successfully');
                });
                
                manualIframe.addEventListener('error', (e) => {
                  console.error('[Calendly] ✗ Manual iframe load error:', e);
                });
                
                widgetContainerRef.current.appendChild(manualIframe);
                console.log('[Calendly] Manual iframe appended to container');
              } else {
                console.log('[Calendly] ✓ Iframe created by initInlineWidget');
                console.log('[Calendly] Iframe src:', iframe.getAttribute('src'));
              }
            }
          }, 1500);
          
          // Check if iframe rendered within 3 seconds
          setTimeout(() => {
            console.log('[Calendly] ===== 3s Check: Iframe Render =====');
            if (widgetContainerRef.current) {
              const iframe = widgetContainerRef.current.querySelector('iframe');
              console.log('[Calendly] Iframe found:', !!iframe);
              console.log('[Calendly] Container children count:', widgetContainerRef.current.children.length);
              console.log('[Calendly] Container HTML preview:', widgetContainerRef.current.innerHTML.substring(0, 300));
              
              if (!iframe) {
                console.warn('[Calendly] ✗ No iframe found after 3 seconds');
                console.log('[Calendly] Showing fallback UI');
                setShowFallback(true);
                setIsInitializing(false);
              } else {
                console.log('[Calendly] ✓ Iframe present, checking load status...');
              }
            }
          }, 3000);

          // Watchdog: if iframe exists but still loading after 5s, auto-open popup
          setTimeout(() => {
            console.log('[Calendly] ===== 5s Watchdog: Stall Detection =====');
            if (widgetContainerRef.current) {
              const iframe = widgetContainerRef.current.querySelector('iframe') as HTMLIFrameElement;
              console.log('[Calendly] Iframe still exists:', !!iframe);
              console.log('[Calendly] Received Calendly event:', hasReceivedCalendlyEvent);
              
              if (iframe) {
                console.log('[Calendly] Iframe src:', iframe.src);
                console.log('[Calendly] Iframe readyState:', (iframe as any).readyState);
                
                try {
                  // Try to access iframe content (will fail for cross-origin, which is expected)
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                  console.log('[Calendly] Iframe accessible:', !!iframeDoc);
                } catch (e) {
                  console.log('[Calendly] Iframe cross-origin (expected):', (e as Error).message);
                }
              }
              
              if (iframe && !hasReceivedCalendlyEvent) {
                console.warn('[Calendly] ⚠ Iframe stalled - no Calendly events received after 5s');
                console.log('[Calendly] Possible causes: CSP block, network issue, or Calendly service issue');
                setIsInitializing(false);
                setShowFallback(true);
                
                // Auto-open popup as fallback
                if (window.Calendly && !popupOpened) {
                  console.log('[Calendly] Auto-opening popup as fallback...');
                  window.Calendly.initPopupWidget({ url: popupUrl });
                  setPopupOpened(true);
                  console.log('[Calendly] Popup opened');
                }
              }
            }
          }, 5000);
        } catch (error) {
          console.error('[Calendly] ===== INITIALIZATION ERROR =====');
          console.error('[Calendly] Error type:', error instanceof Error ? error.name : typeof error);
          console.error('[Calendly] Error message:', error instanceof Error ? error.message : String(error));
          console.error('[Calendly] Error stack:', error instanceof Error ? error.stack : 'N/A');
          console.error('[Calendly] Full error object:', error);
          setShowFallback(true);
          setIsInitializing(false);
        }
      } else {
        console.warn('[Calendly] ===== INITIALIZATION BLOCKED =====');
        console.warn('[Calendly] Cannot initialize - Missing required dependencies');
        console.log('[Calendly] window.Calendly available:', !!window.Calendly);
        console.log('[Calendly] widgetContainerRef.current available:', !!widgetContainerRef.current);
        
        if (!window.Calendly) {
          console.log('[Calendly] Calendly API not loaded - script may have failed');
        }
        if (!widgetContainerRef.current) {
          console.log('[Calendly] Container ref not available - component may not be mounted');
        }
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
        console.log('[Calendly] Message received from:', e.origin);
        console.log('[Calendly] Message data:', e.data);
        
        if (originUrl.hostname.endsWith('calendly.com')) {
          console.log('[Calendly] ✓ Valid Calendly message');
          
          // Mark that we've received a Calendly event (widget loaded successfully)
          if (e.data.event === 'calendly.profile_page_viewed' || 
              e.data.event === 'calendly.event_type_viewed' ||
              e.data.event === 'calendly.date_and_time_selected') {
            console.log('[Calendly] ===== WIDGET LOADED SUCCESSFULLY =====');
            console.log('[Calendly] Event type:', e.data.event);
            console.log('[Calendly] Timestamp:', new Date().toISOString());
            hasReceivedCalendlyEvent = true;
            setIsInitializing(false);
          }
          
          if (e.data.event === 'calendly.event_scheduled') {
            console.log('[Calendly] ===== EVENT SCHEDULED =====');
            console.log('[Calendly] Timestamp:', new Date().toISOString());
            console.log('[Calendly] Event data:', e.data);
            onEventScheduled?.();
          }
        } else {
          console.log('[Calendly] Non-Calendly message from:', originUrl.hostname);
        }
      } catch (err) {
        console.log('[Calendly] Invalid message origin or data:', err);
      }
    };
    
    window.addEventListener('message', handleMessage);

    // Listen for CSP violations
    const handleCSPViolation = (e: SecurityPolicyViolationEvent) => {
      if (e.violatedDirective.includes('frame') || e.blockedURI.includes('calendly')) {
        console.error('[Calendly] ===== CSP VIOLATION DETECTED =====');
        console.error('[Calendly] Violated directive:', e.violatedDirective);
        console.error('[Calendly] Blocked URI:', e.blockedURI);
        console.error('[Calendly] Original policy:', e.originalPolicy);
        console.error('[Calendly] This explains why Calendly iframe is blocked!');
      }
    };
    
    document.addEventListener('securitypolicyviolation', handleCSPViolation);

    return () => {
      console.log('[Calendly] ===== Component Cleanup =====');
      console.log('[Calendly] Removing message listener');
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('securitypolicyviolation', handleCSPViolation);
    };
  }, [fullUrl, onEventScheduled, isPreview, popupOpened]);

  const handleOpenPopup = () => {
    // Reset iframe state
    setIframeLoaded(false);
    setIframeBlockWarn(false);
    
    // Start watchdog timer
    const watchdogTimer = setTimeout(() => {
      if (!iframeLoaded) {
        setIframeBlockWarn(true);
      }
    }, 3000);
    
    // In preview, always use custom popup
    if (isPreview) {
      setCustomPopupOpen(true);
      setPopupOpened(true);
      return;
    }
    
    // In production, try Calendly script popup first, fallback to custom
    if (window.Calendly) {
      try {
        window.Calendly.initPopupWidget({ url: popupUrl });
        setPopupOpened(true);
        clearTimeout(watchdogTimer);
        
        // Verify popup opened, otherwise use custom
        setTimeout(() => {
          const calendlyOverlay = document.querySelector('[data-calendly-root]');
          if (!calendlyOverlay) {
            console.log('[Calendly] Script popup failed, using custom dialog');
            setCustomPopupOpen(true);
          }
        }, 250);
      } catch {
        clearTimeout(watchdogTimer);
        setCustomPopupOpen(true);
      }
    } else {
      setCustomPopupOpen(true);
    }
  };

  const trySystemPopup = () => {
    const w = 1040, h = 820;
    const y = window.top ? (window.top.outerHeight - h) / 2 + window.top.screenY : 100;
    const x = window.top ? (window.top.outerWidth - w) / 2 + window.top.screenX : 100;
    window.open(popupUrl, 'calendly_popup', `popup=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${w},height=${h},top=${y},left=${x}`);
    setCustomPopupOpen(false);
  };

  const handleOpenNewTab = () => {
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
    setCustomPopupOpen(false);
  };

  return (
    <>
      <Dialog open={customPopupOpen} onOpenChange={setCustomPopupOpen}>
        <DialogContent className="max-w-3xl w-[95vw] h-[85vh] p-0 overflow-hidden">
          <div className="relative w-full h-full">
            <iframe 
              src={popupEmbedUrl} 
              className="w-full h-full" 
              title="Calendly Scheduler" 
              style={{ border: 0 }}
              allow="geolocation; microphone; camera; payment; clipboard-read; clipboard-write; autoplay"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setIframeLoaded(true)}
            />
            
            {iframeBlockWarn && (
              <div className="absolute inset-0 bg-background/95 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Content Blocked</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Your browser blocked the embedded scheduler. This is common in preview or with strict privacy settings.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleOpenNewTab} variant="default" size="lg">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button onClick={trySystemPopup} variant="outline" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Try System Popup
                  </Button>
                </div>
              </div>
            )}
          </div>
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

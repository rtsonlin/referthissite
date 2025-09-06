// Tracking utility for analytics events
interface TrackingEvent {
  event: string;
  data?: Record<string, any>;
}

export async function trackEvent(event: string, data?: Record<string, any>): Promise<void> {
  try {
    // Log to console for development
    console.log("Tracking event:", event, data);
    
    // Send to backend API
    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, data }),
    });

    if (!response.ok) {
      throw new Error("Failed to track event");
    }

    // TODO: Add Google Analytics integration here
    // Example:
    // if (window.gtag) {
    //   window.gtag('event', event, {
    //     custom_parameter: data,
    //   });
    // }

  } catch (error) {
    console.error("Tracking error:", error);
  }
}

// Common tracking events
export const trackingEvents = {
  SEARCH: "search",
  TAB_SWITCH: "tab_switch", 
  AFFILIATE_CLICK: "affiliate_click",
  CODE_COPY: "code_copy",
  REVIEW_VIEW: "review_view",
  MAILING_LIST_SUBSCRIBE: "mailing_list_subscribe",
  CARD_VIEW: "card_view",
} as const;

export type TrackingEventType = typeof trackingEvents[keyof typeof trackingEvents];

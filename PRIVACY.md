# Privacy Policy

**Data Controller:** wraeclast.cards

**Last Updated:** July 11, 2026

wraeclast.cards is an open-source website for Path of Exile divination card data. It is primarily a static site delivered through Cloudflare. This privacy policy explains what data we collect, how we use it, and your rights.

---

## What We Collect

### Crash Reports (Sentry)

The production site uses Sentry for crash and error reporting. Anonymous error reports are sent to Sentry when something goes wrong. These may include:

- **Error type and message**
- **Stack traces**
- **Browser type and version**
- **Operating system type and version**
- **App or site version**
- **Breadcrumb timeline** a sequence of events leading up to the error

Crash reports are intended to exclude personal information. The site is configured not to collect user information or HTTP request/response bodies through Sentry.

### Usage Analytics (Umami)

The production site uses a hosted [Umami](https://umami.is/) instance for privacy-focused usage analytics. Anonymous page views and feature usage events are tracked to help us understand which pages and features are used most so we can prioritize development.

Usage analytics do **not** include personal identifiers. We see aggregated counts like "50 users opened the Cards page today", not who they are.

### Web Performance Analytics (Cloudflare Web Analytics)

The production site uses [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) for web performance analytics, including Core Web Vitals. Cloudflare Web Analytics measures real user performance data such as page load time, Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS).

Cloudflare Web Analytics is intended to be privacy-first and cookie-free. It uses browser performance data to help identify performance problems on the site.

### Website Delivery and Security (Cloudflare)

wraeclast.cards is deployed on Cloudflare. As the infrastructure and delivery provider, Cloudflare may process standard web request data needed to serve, cache, secure, and route traffic to this site. That processing is governed by [Cloudflare's Privacy Policy](https://www.cloudflare.com/privacypolicy/).

### Stacked Deck Data Source

Stacked deck drop-rate data shown on wraeclast.cards is derived from community uploads contributed through the Soothsayer desktop application.

Those uploads are governed by Soothsayer's own privacy policy: [Soothsayer Privacy Policy](https://github.com/navali-creations/soothsayer/blob/master/PRIVACY.md).

wraeclast.cards displays aggregated drop-rate data derived from those uploads. It does not operate the Soothsayer desktop application's local data collection, telemetry settings, account linking, or upload controls.

### OAuth Relay Route

The `/soothsayer/auth` route acts only as an OAuth callback relay for the Soothsayer desktop application.

When that route is used:

- the page may receive callback parameters such as `code`, `state`, `error`, and `error_description`
- the page will construct a `soothsayer://` deep link and attempt to hand control back to the desktop app
- the route is intended only as a browser relay surface and is **not** meant to exchange tokens or store account data in wraeclast.cards itself

---

## What We Do NOT Collect

- User accounts or profile data for wraeclast.cards
- Game data, stash contents, or trade history
- Keystroke or input data
- OAuth tokens on the wraeclast.cards site itself
- Personal identifiers in site telemetry

---

## How We Use Your Data

- **Crash reports** to fix bugs and edge cases across different browsers, devices, and operating systems
- **Usage analytics** to understand which pages and features matter most and prioritize development
- **Web performance analytics** to measure production page speed, responsiveness, and layout stability
- **Cloudflare infrastructure processing** to deliver, cache, and protect the website
- **Stacked deck data display** to publish aggregated drop-rate data derived from Soothsayer community uploads
- **OAuth relay route** to forward OAuth callback parameters back to the Soothsayer desktop app without handling token exchange on this site

---

## Where Data Is Processed

| Service | Purpose | Region |
|---|---|---|
| [Sentry](https://sentry.io/) | Crash reporting | EU (Frankfurt) |
| [Umami](https://umami.is/) hosted instance | Usage analytics | According to the hosting configuration for the analytics endpoint |
| [Cloudflare](https://www.cloudflare.com/) | Website hosting, caching, delivery, security, and Web Analytics/Core Web Vitals | According to Cloudflare infrastructure and policy |

---

## Data Retention

| Data | Retention |
|---|---|
| Sentry crash reports | 30 days (auto-deleted) |
| Umami analytics | 90 days (aggregated, no personal data) |
| Cloudflare request, infrastructure, and Web Analytics data | According to Cloudflare's systems and policies |

---

## Your Choices

### Site Telemetry

The production site uses anonymous telemetry for crash reporting, usage analytics, and web performance analytics.

The site does not currently provide a built-in opt-out control for this telemetry. Telemetry is intended to be anonymous or aggregated and is not used to identify individual visitors.

### Browser Data

wraeclast.cards does not maintain user accounts or collect personal profile data for normal site usage. Any local browser data, cache, or storage remains under your browser and device controls.

---

## Your Rights (GDPR)

Under the General Data Protection Regulation (GDPR), you have the right to:

1. **Access** Request a copy of all data we hold about you (Article 15)
2. **Erasure** Request deletion of all your data (Article 17 — "right to be forgotten")
3. **Rectification** Request correction of inaccurate data (Article 16)
4. **Portability** Receive your data in a machine-readable format (Article 20)
5. **Object** Object to processing of your data (Article 21)

These rights apply where data can be reasonably linked to you. wraeclast.cards does not maintain user accounts or stable visitor identifiers for normal site usage. Site telemetry is intended to be anonymous or aggregated, so we may be unable to identify, export, correct, or delete telemetry records for a specific visitor.

We are not required to collect or retain additional identifying information solely to identify a requester for anonymous or aggregated telemetry data.

### How to Make a Request

Contact **`@ailundefined`** on Discord with **`[GDPR Access Removal]`** in the message.

Requests are processed within **30 days**.

If your request relates to a specific crash report, include any Sentry event ID or other concrete reference you have. Without a stable identifier or event reference, we may not be able to locate records that relate to you without affecting data that may belong to other visitors.

### Important Notes

- wraeclast.cards does not operate end-user accounts for normal site usage.
- Sentry, Umami, and Cloudflare Web Analytics are intended to operate on anonymous or aggregated data only.
- Requests involving anonymous or aggregated telemetry can only be actioned when the relevant data can be reasonably linked to the requester.
- Cloudflare may process standard request data as part of serving and securing the site under its own privacy policy.
- Stacked deck data is derived from Soothsayer desktop app community uploads, which are covered by the [Soothsayer Privacy Policy](https://github.com/navali-creations/soothsayer/blob/master/PRIVACY.md).
- The OAuth relay route is intended to pass callback parameters through to the desktop app rather than become a standalone auth backend.

---

## Third-Party Services

| Service | Provider | Purpose |
|---|---|---|
| Sentry | Functional Software GmbH | Crash and error reporting |
| Hosted Umami instance | Umami analytics software, hosted for this site | Privacy-focused usage analytics |
| Cloudflare | Cloudflare, Inc. | Website hosting, caching, delivery, security, and Web Analytics/Core Web Vitals |

Each third-party service has its own privacy policy. We encourage you to review them.

---

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be committed to this repository and noted in release changelogs. The "Last Updated" date at the top of this document reflects the most recent revision.

---

## Contact

- **Discord:** `@ailundefined` (for GDPR requests, use `[GDPR Access Removal]` prefix)
- **GitHub:** [Issues](https://github.com/navali-creations/wraeclast-cards/issues) or [Discussions](https://github.com/navali-creations/wraeclast-cards/discussions) on `navali-creations/wraeclast-cards`

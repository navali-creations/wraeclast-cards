# Privacy Policy

**Data Controller:** Wraeclast Cards

**Last Updated:** April 23, 2026

Wraeclast Cards is an open-source website for Path of Exile divination card data. It is primarily a static site delivered through Cloudflare. This privacy policy explains what data we collect, how we use it, and your rights.

---

## What We Collect

### Crash Reports (Sentry)

When crash reporting is enabled, anonymous error reports are sent when something goes wrong. These may include:

- **Error type and message**
- **Stack traces**
- **Browser type and version**
- **Operating system type and version**
- **App or site version**
- **Breadcrumb timeline** a sequence of events leading up to the error

Crash reports are intended to exclude personal information.

### Usage Analytics (Umami)

When usage analytics are enabled, anonymous page views and feature usage events are tracked via [Umami Cloud](https://umami.is/), a privacy-focused analytics platform. This helps us understand which pages and features are used most so we can prioritize development.

Usage analytics do **not** include personal identifiers. We see aggregated counts like "50 users opened the Cards page today", not who they are.

### Website Delivery and Security (Cloudflare)

Wraeclast Cards is deployed on Cloudflare. As the infrastructure and delivery provider, Cloudflare may process standard web request data needed to serve, cache, secure, and route traffic to this site. That processing is governed by [Cloudflare's Privacy Policy](https://www.cloudflare.com/privacypolicy/).

### OAuth Relay Route (Planned)

A planned future route, `/soothsayer/auth`, will act only as an OAuth callback relay for the Soothsayer desktop application.

When that route is introduced:

- the page may receive callback parameters such as `code`, `state`, `error`, and `error_description`
- the page will construct a `soothsayer://` deep link and attempt to hand control back to the desktop app
- the route is intended only as a browser relay surface and is **not** meant to exchange tokens or store account data in Wraeclast Cards itself

This privacy policy will be updated again when that feature ships if the actual behavior changes.

---

## What We Do NOT Collect

- User accounts or profile data for Wraeclast Cards
- Game data, stash contents, or trade history
- Keystroke or input data
- OAuth tokens on the Wraeclast Cards site itself
- Any telemetry data when telemetry is disabled

---

## How We Use Your Data

- **Crash reports** to fix bugs and edge cases across different browsers, devices, and operating systems
- **Usage analytics** to understand which pages and features matter most and prioritize development
- **Cloudflare infrastructure processing** to deliver, cache, and protect the website
- **Future relay route** to forward OAuth callback parameters back to the Soothsayer desktop app without handling token exchange on this site

---

## Where Data Is Processed

| Service | Purpose | Region |
|---|---|---|
| [Sentry](https://sentry.io/) | Crash reporting | EU (Frankfurt) |
| [Umami Cloud](https://umami.is/) | Usage analytics | EU |
| [Cloudflare](https://www.cloudflare.com/) | Website hosting, caching, delivery, and security | According to Cloudflare infrastructure and policy |

---

## Data Retention

| Data | Retention |
|---|---|
| Sentry crash reports | 30 days (auto-deleted) |
| Umami analytics | 90 days (aggregated, no personal data) |
| Cloudflare request and infrastructure data | According to Cloudflare's systems and policies |

---

## Your Choices

### Opt Out of Telemetry

You can disable crash reporting and/or usage analytics at any time if telemetry controls are provided by the site.

The site is intended to remain usable without telemetry. No feature should be gated behind telemetry consent.

### Browser Data

Wraeclast Cards does not maintain user accounts or collect personal profile data for normal site usage. Any local browser data, cache, or storage remains under your browser and device controls.

---

## Your Rights (GDPR)

Under the General Data Protection Regulation (GDPR), you have the right to:

1. **Access** Request a copy of all data we hold about you (Article 15)
2. **Erasure** Request deletion of all your data (Article 17 � "right to be forgotten")
3. **Rectification** Request correction of inaccurate data (Article 16)
4. **Portability** Receive your data in a machine-readable format (Article 20)
5. **Object** Object to processing of your data (Article 21)

### How to Make a Request

Contact **`@ailundefined`** on Discord with **`[GDPR Access Removal]`** in the message.

Requests are processed within **30 days**.

### Important Notes

- Wraeclast Cards does not operate end-user accounts for normal site usage.
- Sentry and Umami are intended to operate on anonymous or aggregated data only.
- Cloudflare may process standard request data as part of serving and securing the site under its own privacy policy.
- If the future OAuth relay route ships, it is intended to pass callback parameters through to the desktop app rather than become a standalone auth backend.

---

## Third-Party Services

| Service | Provider | Purpose |
|---|---|---|
| Sentry | Functional Software GmbH | Crash and error reporting |
| Umami Cloud | Umami Software Inc. | Privacy-focused usage analytics |
| Cloudflare | Cloudflare, Inc. | Website hosting, caching, delivery, and security |

Each third-party service has its own privacy policy. We encourage you to review them.

---

## Changes to This Policy

We may update this privacy policy from time to time. Changes will be committed to this repository and noted in release changelogs. The "Last Updated" date at the top of this document reflects the most recent revision.

---

## Contact

- **Discord:** `@ailundefined` (for GDPR requests, use `[GDPR Access Removal]` prefix)
- **GitHub:** [Issues](https://github.com/navali-creations/wraeclast-cards/issues) or [Discussions](https://github.com/navali-creations/wraeclast-cards/discussions) on `navali-creations/wraeclast-cards`

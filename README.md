# NETVISION — Network Monitoring System

**A premium dark-themed, responsive Network Operations Center (NOC) dashboard.**  
Designed and developed by **Annas Shakeel**.

## Features

- Responsive NOC dashboard for desktop, tablet and mobile.
- Network KPI cards: availability, connected devices, latency and active incidents.
- Canvas-based inbound/outbound bandwidth chart with 6h, 12h and 24h ranges.
- Network health score and infrastructure breakdown.
- Clickable network topology map — select a node to inspect its device.
- Device inventory with search and status filters.
- Device inspector modal with simulated ping test.
- Simulated network scan that refreshes device metrics.
- Incident acknowledgement workflow.
- Activity/audit log and CSV device report export.
- No build tools, frameworks or package installation required.

## Run locally

1. Download and extract `netvision-project.zip`.
2. Open the extracted `netvision` folder.
3. Double-click `index.html`, or use VS Code with the **Live Server** extension.
4. If using Live Server, right-click `index.html` and choose **Open with Live Server**.

The project uses Google Fonts when internet access is available. It still works without them, using fallback fonts.

## Publish on GitHub Pages

1. Sign in to GitHub and create a new **public** repository, for example `netvision-network-monitor`.
2. Upload `index.html`, `styles.css`, `app.js` and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then click **Save**.
6. Wait for GitHub Pages to publish. Your site URL will look like:
   `https://YOUR-USERNAME.github.io/netvision-network-monitor/`

## Project structure

```text
netvision/
├── index.html    # Dashboard structure and accessible controls
├── styles.css    # Theme, responsive layout, charts and components
├── app.js        # Demo data, interactions and chart rendering
└── README.md     # Setup and deployment guide
```

## Important: simulation, not live monitoring

This is a front-end portfolio simulator. Device addresses, status, latency, CPU load, incidents, ping results and scan results are demonstration data generated in the browser. It does **not** send ICMP packets, connect to routers/switches, poll SNMP, or monitor real infrastructure.

For production monitoring, add a secure backend service that collects real telemetry (for example SNMP, ICMP, NetFlow or device APIs), authenticates administrators, and exposes authorized data to the frontend. Never put network credentials or private API keys in browser JavaScript.

## Customization

- Edit the `devices` array near the top of `app.js` to change demo devices.
- Adjust colors in the `:root` section at the top of `styles.css`.
- Update branding in `index.html` and this README.

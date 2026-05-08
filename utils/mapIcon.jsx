const createIconHTML = (svgContent) => {
  const html = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    ">
      <div style="transform: rotate(45deg);">
        ${svgContent}
      </div>
    </div>
  `;
  // encode to base64 to avoid JSON/quote escaping issues
  return btoa(unescape(encodeURIComponent(html)));
};

export const barangayHallHTML = createIconHTML(`
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
    <g fill="blue">
      <path fill-rule="evenodd" d="M4.286 8L12 2l7.714 6H21v3H3V8zm6.964 1V7.75H10v-1.5h1.25V5h1.5v1.25H14v1.5h-1.25V9z" clip-rule="evenodd"/>
      <path d="M21 17v3H3v-3h2v-4.5h2V17h2v-4.5h2V17h2v-4.5h2V17h2v-4.5h2V17z"/>
    </g>
  </svg>
`);

export const healthCenterHTML = createIconHTML(
  `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" color="#fb542b" viewBox="0 0 24 24"><path fill="currentColor" d="M4 22h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2m12-7h-3v3h-2v-3H8v-2h3v-3h2v3h3zM9 4h6v2H9z"/></svg>`,
);

export const shelterHTML = createIconHTML(
  `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" color="#328315" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" d="M12.5 20v-2.5s-1.5-1-4-1s-4 1-4 1V20m15 0v-2.5s-1.5-1-4-1a9 9 0 0 0-1.5.124m8.5-6.374l-.247-.113a20 20 0 0 1-8.942-8.104L13 1.5h-2l-.311.533a20 20 0 0 1-8.942 8.104l-.247.113V22.5h21zM8.35 14.5s-1.6-1-1.6-2.25a1.747 1.747 0 1 1 3.496 0c0 1.25-1.596 2.25-1.596 2.25zm7 0s-1.6-1-1.6-2.25a1.747 1.747 0 1 1 3.496 0c0 1.25-1.596 2.25-1.596 2.25z" stroke-width="1"/></svg>`,
);

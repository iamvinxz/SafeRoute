export const webViewStyles = {
  popup: {
    container: `

      min-width: 70px'
      max-width: 180px;
    `,
    description: `
      font-size: 10px;
      color: #636363;
      line-height: 2.3;
      word-break: break-word;
      display: block;
    `,
    date: `
      font-size: 8px;
      color: #797878;
      display: block;
    `,
    column: `
      display: flex;
      flex-direction: column;
      gap: 2px;
    `,
  },

  segment: {
    container: `
        min-width: 100px;
        max-width: 150px;
      `,
    header: `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      `,
    titleBase: `
        font-weight: 700;
        color: #303030;
        line-height: 1.3;
        word-break: break-word;
      `,
    titleSizes: {
      small: "12px",
      medium: "14px",
      large: "18px",
    },
    badge: `
        font-size: 10px;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 999px;
        white-space: nowrap;
        text-transform: capitalize;
      `,
    description: `
        font-size: 10px;
        color: #797878;
        line-height: 1.5;
        display: inline-block;
        margin-top: 4px;
      `,
    date: `
        color: #797878;
        font-size: 8px;
        margin-top: 4px;
        margin-bottom: 0;
      `,
    depthColors: {
      "knee-deep": {
        badge: "background-color:#fef9c3;",
        text: "color:#ca8a04;",
      },
      "ankle-deep": {
        badge: "background-color:#dcfce7;",
        text: "color:#16a34a;",
      },
      "waist-deep": {
        badge: "background-color:#fee2e2;",
        text: "color:#dc2626;",
      },
      "neck-deep": {
        badge: "background-color:#fae8ff;",
        text: "color:#a21caf;",
      },
      default: { badge: "background-color:#f3f4f6;", text: "color:#6b7280;" },
    },
  },
};

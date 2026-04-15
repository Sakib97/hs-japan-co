export const PAGES = ["Homepage", 
    "Gallery", 
    "Team Page", 
    // "Contact Page"
];

export const STORAGE_USED_GB = 6.5;
export const STORAGE_TOTAL_GB = 10;
export const storagePercent = Math.round(
  (STORAGE_USED_GB / STORAGE_TOTAL_GB) * 100,
);

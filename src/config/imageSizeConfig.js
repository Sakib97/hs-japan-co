// All values are in bytes.
// Use the label fields for display strings in UI hints/toasts.

export const IMAGE_SIZES = {
  // Profile avatar (dashboard profile page)
  PROFILE_AVATAR: {
    maxBytes: 150 * 1024, // 150 KB
    label: "150 KB",
  },

  // Team/staff member photos (assets management – Team Staff Panel)
  TEAM_STAFF: {
    maxBytes: 500 * 1024, // 500 KB
    label: "500 KB",
  },

  // About page – chairman section image
  ABOUT_PAGE: {
    maxBytes: 2 * 1024 * 1024, // 2 MB
    label: "2 MB",
  },

  // Why Japan page – section images (BetterFuture, Technology)
  WHY_JAPAN_PAGE: {
    maxBytes: 2 * 1024 * 1024, // 2 MB
    label: "2 MB",
  },

  // Course cover image (create / edit course form + schema)
  COURSE_COVER: {
    maxBytes: 2 * 1024 * 1024, // 2 MB
    label: "2 MB",
  },

  // Homepage carousel slides (assets management – Homepage Panel)
  HOMEPAGE_CAROUSEL: {
    maxBytes: 3 * 1024 * 1024, // 3 MB
    label: "3 MB",
  },

  // Gallery images (assets management – Gallery Panel)
  GALLERY: {
    maxBytes: 3 * 1024 * 1024, // 3 MB
    label: "3 MB",
  },

  // Events page cover images
  EVENTS_COVER: {
    maxBytes: 300 * 1024, // 300 KB
    label: "300 KB",
  },

  // Activities page cover images
  ACTIVITIES_COVER: {
    maxBytes: 300 * 1024, // 300 KB
    label: "300 KB",
  },
};

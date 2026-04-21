import { useState } from "react";
import { Popover, Input } from "antd";
import pickerStyles from "../styles/FAIconPicker.module.css";

const FA_ICONS = [
  // Work & Business
  "fa-solid fa-industry",
  "fa-solid fa-briefcase",
  "fa-solid fa-building",
  "fa-solid fa-building-columns",
  "fa-solid fa-store",
  "fa-solid fa-shop",
  "fa-solid fa-cash-register",
  "fa-solid fa-chart-line",
  "fa-solid fa-chart-bar",
  "fa-solid fa-chart-pie",
  "fa-solid fa-chart-area",
  "fa-solid fa-coins",
  "fa-solid fa-yen-sign",
  "fa-solid fa-dollar-sign",
  "fa-solid fa-money-bill",
  "fa-solid fa-money-bill-wave",
  "fa-solid fa-credit-card",
  "fa-solid fa-file-contract",
  "fa-solid fa-clipboard",
  "fa-solid fa-pen-to-square",
  "fa-solid fa-signature",
  "fa-solid fa-suitcase",
    "fa-solid fa-briefcase-medical",
  // Education
  "fa-solid fa-graduation-cap",
  "fa-solid fa-school",
  "fa-solid fa-chalkboard-teacher",
  "fa-solid fa-book",
  "fa-solid fa-book-open",
  "fa-solid fa-book-reader",
  "fa-solid fa-newspaper",
  "fa-solid fa-scroll",
  "fa-solid fa-certificate",
  "fa-solid fa-award",
  "fa-solid fa-medal",
  "fa-solid fa-trophy",
  "fa-solid fa-pencil",
  "fa-solid fa-pen",
  "fa-solid fa-ruler",
  "fa-solid fa-ruler-combined",
  "fa-solid fa-microscope",
  "fa-solid fa-flask",
  "fa-solid fa-atom",
  "fa-solid fa-brain",
  "fa-solid fa-lightbulb",
  "fa-solid fa-magnifying-glass",

  // Technology
  "fa-solid fa-laptop",
  "fa-solid fa-desktop",
  "fa-solid fa-mobile-screen",
  "fa-solid fa-tablet-screen-button",
  "fa-solid fa-code",
  "fa-solid fa-terminal",
  "fa-solid fa-database",
  "fa-solid fa-server",
  "fa-solid fa-network-wired",
  "fa-solid fa-wifi",
  "fa-solid fa-satellite",
  "fa-solid fa-satellite-dish",
  "fa-solid fa-robot",
  "fa-solid fa-microchip",
  "fa-solid fa-memory",
  "fa-solid fa-hard-drive",
  "fa-solid fa-cloud",
  "fa-solid fa-cloud-arrow-up",
  "fa-solid fa-cloud-arrow-down",
  "fa-solid fa-bolt",
  "fa-solid fa-plug",
  "fa-solid fa-battery-full",
  "fa-solid fa-print",
  "fa-solid fa-camera",
  "fa-solid fa-video",
  "fa-solid fa-tv",
  "fa-solid fa-radio",

  // People & Social
  "fa-solid fa-user",
  "fa-solid fa-user-tie",
  "fa-solid fa-user-gear",
  "fa-solid fa-user-graduate",
  "fa-solid fa-user-doctor",
  "fa-solid fa-user-nurse",
  "fa-solid fa-users",
  "fa-solid fa-people-group",
  "fa-solid fa-person",
  "fa-solid fa-child",
  "fa-solid fa-baby",
  "fa-solid fa-handshake",
  "fa-solid fa-hands-helping",
  "fa-solid fa-heart",
  "fa-solid fa-face-smile",
  "fa-solid fa-comments",
  "fa-solid fa-language",
  "fa-solid fa-id-card",
  "fa-solid fa-id-badge",
  "fa-solid fa-passport",

  // Travel & Transport
  "fa-solid fa-plane",
  "fa-solid fa-plane-departure",
  "fa-solid fa-plane-arrival",
  "fa-solid fa-train",
  "fa-solid fa-train-subway",
  "fa-solid fa-bus",
  "fa-solid fa-car",
  "fa-solid fa-car-side",
  "fa-solid fa-truck",
  "fa-solid fa-ship",
  "fa-solid fa-bicycle",
  "fa-solid fa-motorcycle",
  "fa-solid fa-taxi",
  "fa-solid fa-map",
  "fa-solid fa-map-location-dot",
  "fa-solid fa-location-dot",
  "fa-solid fa-location-pin",
  "fa-solid fa-compass",
  "fa-solid fa-route",
  "fa-solid fa-road",
  "fa-solid fa-signs-post",
  "fa-solid fa-suitcase-rolling",

  // Japan & Culture
  "fa-solid fa-torii-gate",
  "fa-solid fa-mountain-sun",
  "fa-solid fa-mountain",
  "fa-solid fa-volcano",
  "fa-solid fa-fish",
  "fa-solid fa-bowl-rice",
  "fa-solid fa-utensils",
  "fa-solid fa-mug-hot",
  "fa-solid fa-mug-saucer",
  "fa-solid fa-wine-glass",
  "fa-solid fa-bottle-water",
  "fa-solid fa-tree",
  "fa-solid fa-seedling",
  "fa-solid fa-leaf",
  "fa-solid fa-spa",
  "fa-solid fa-yin-yang",

  // Healthcare & Wellbeing
  "fa-solid fa-hospital",
  "fa-solid fa-hospital-user",
  "fa-solid fa-stethoscope",
  "fa-solid fa-pills",
  "fa-solid fa-syringe",
  "fa-solid fa-heart-pulse",
  "fa-solid fa-kit-medical",
  "fa-solid fa-weight-scale",
  "fa-solid fa-dumbbell",
  "fa-solid fa-person-running",
  "fa-solid fa-person-swimming",
  "fa-solid fa-soccer-ball",
  "fa-solid fa-baseball-bat-ball",
  "fa-solid fa-table-tennis-paddle-ball",

  // Home & Living
  "fa-solid fa-house",
  "fa-solid fa-house-user",
  "fa-solid fa-city",
  "fa-solid fa-hotel",
  "fa-solid fa-building-circle-check",
  "fa-solid fa-couch",
  "fa-solid fa-bed",
  "fa-solid fa-chair",
  "fa-solid fa-kitchen-set",
    "fa-solid fa-bath",
  "fa-solid fa-key",
  "fa-solid fa-lock",

  // Nature & Environment
  "fa-solid fa-sun",
  "fa-solid fa-moon",
  "fa-solid fa-cloud-sun",
  "fa-solid fa-cloud-rain",
  "fa-solid fa-snowflake",
  "fa-solid fa-wind",
  "fa-solid fa-fire",
  "fa-solid fa-water",
  "fa-solid fa-earth-asia",
  "fa-solid fa-globe",
  "fa-solid fa-tractor",
  "fa-solid fa-wheat-awn",
  "fa-solid fa-apple-whole",

  // Industry & Tools
  "fa-solid fa-gear",
  "fa-solid fa-gears",
  "fa-solid fa-wrench",
  "fa-solid fa-screwdriver-wrench",
  "fa-solid fa-hammer",
  "fa-solid fa-hard-hat",
  "fa-solid fa-helmet-safety",
  "fa-solid fa-toolbox",
  "fa-solid fa-trowel",
  "fa-solid fa-warehouse",
  "fa-solid fa-tower-cell",
  "fa-solid fa-tower-broadcast",
  "fa-solid fa-anchor",
  "fa-solid fa-oil-can",
  "fa-solid fa-gas-pump",

  // Icons & Symbols
  "fa-solid fa-star",
  "fa-solid fa-circle-check",
  "fa-solid fa-circle-info",
  "fa-solid fa-rocket",
  "fa-solid fa-shield-halved",
  "fa-solid fa-shield-heart",
  "fa-solid fa-flag",
  "fa-solid fa-flag-checkered",
  "fa-solid fa-fire-flame-curved",
  "fa-solid fa-infinity",
  "fa-solid fa-crown",
  "fa-solid fa-gem",
  "fa-solid fa-diamond",
  "fa-solid fa-tag",
  "fa-solid fa-tags",
  "fa-solid fa-list-check",
  "fa-solid fa-square-check",
  "fa-solid fa-thumbs-up",
  "fa-solid fa-hand-holding-heart",
  "fa-solid fa-hand-holding-dollar",
  "fa-solid fa-gift",
  "fa-solid fa-bell",
  "fa-solid fa-envelope",
  "fa-solid fa-paper-plane",
  "fa-solid fa-share-nodes",
];

// Extract a readable label from the class name for search
const getLabel = (cls) => cls.replace("fa-solid fa-", "").replace(/-/g, " ");

const FAIconPicker = ({ value, onChange, children }) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = FA_ICONS.filter((icon) =>
    getLabel(icon).includes(search.toLowerCase()),
  );

  const handleSelect = (icon) => {
    onChange(icon);
    setOpen(false);
    setSearch("");
  };

  const content = (
    <div className={pickerStyles.picker}>
      <Input
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={pickerStyles.search}
        prefix={<i className="fa-solid fa-magnifying-glass" />}
        autoFocus
      />
      <div className={pickerStyles.grid}>
        {filtered.map((icon) => (
          <button
            key={icon}
            type="button"
            title={getLabel(icon)}
            className={`${pickerStyles.iconBtn} ${value === icon ? pickerStyles.active : ""}`}
            onClick={() => handleSelect(icon)}
          >
            <i className={icon} />
          </button>
        ))}
        {filtered.length === 0 && (
          <p className={pickerStyles.empty}>No icons found</p>
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSearch("");
      }}
      placement="bottom"
    >
      {children}
    </Popover>
  );
};

export default FAIconPicker;

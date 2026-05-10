import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Lock } from "lucide-react";

/**
 * Accessible custom dropdown.
 *
 * Props:
 *   value     – currently selected value (string)
 *   onChange  – (value) => void
 *   options   – Array<{ value, label, group?, description?, disabled? }>
 *   placeholder
 *   triggerClassName
 *   align     – "start" | "end" – which edge of the trigger to align the menu to
 */
const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select…",
  triggerClassName = "",
  align = "start",
  size = "md",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = options.find((o) => o.value === value);

  const grouped = options.reduce((acc, o) => {
    const k = o.group || "_";
    (acc[k] = acc[k] || []).push(o);
    return acc;
  }, {});

  const sizing = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-3.5 py-2.5 text-sm",
  }[size];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center justify-between gap-2 rounded-lg border border-border-soft bg-white text-text-primary font-medium hover:border-text-muted/40 transition-colors ${sizing} ${triggerClassName}`}
      >
        <span className="truncate">
          {current ? current.label : (
            <span className="text-text-muted">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          size={14}
          className={`text-text-muted transition-transform ${open ? "rotate-180" : ""} shrink-0`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute top-[calc(100%+6px)] ${
            align === "end" ? "right-0" : "left-0"
          } min-w-full max-w-[320px] bg-white border border-border-soft rounded-xl shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] py-1.5 z-50 animate-dropdown-in max-h-[320px] overflow-y-auto`}
        >
          {Object.entries(grouped).map(([groupKey, items]) => (
            <div key={groupKey}>
              {groupKey !== "_" && (
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-text-muted px-3 pt-2 pb-1">
                  {groupKey}
                </div>
              )}
              {items.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => {
                      if (opt.disabled) return;
                      onChange?.(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left flex items-start gap-2 px-3 py-2 transition-colors ${
                      opt.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-bg-soft"
                    } ${isSelected ? "bg-bg-soft" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary flex items-center gap-1.5">
                        {opt.label}
                        {opt.disabled && (
                          <Lock size={11} className="text-text-muted" />
                        )}
                      </div>
                      {opt.description && (
                        <div className="text-xs text-text-muted mt-0.5 leading-snug">
                          {opt.description}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check
                        size={14}
                        className="text-brand-primary mt-0.5 shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;

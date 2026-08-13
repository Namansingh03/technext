/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, MapPin } from "lucide-react";

import {
  resolveLocation,
  searchLocations,
  type PlaceSuggestion,
  type ResolvedLocation,
} from "@/src/features/location/actions/places-actions";

import { type locationSchemaType } from "../schema/locationSchema";

type Props = {
  value?: locationSchemaType | null;
  defaultValue?: string;
  placeholder?: string;
  onSelect: (location: ResolvedLocation) => void;
  hasError?: boolean;
};

export function LocationAutocomplete({
  value,
  defaultValue = "",
  placeholder = "Search city…",
  onSelect,
  hasError = false,
}: Props) {
  const [query, setQuery] = useState(value?.label ?? defaultValue);

  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [isPending, startTransition] = useTransition();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestIdRef = useRef(0);

  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Sync the input when the parent changes the selected location.
   *
   * Important:
   * Don't call setState during render.
   */
  useEffect(() => {
    setQuery(value?.label ?? defaultValue);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  }, [value?.placeId, value?.label, defaultValue]);

  /*
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Cleanup debounce timer.
   */
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function handleChange(inputValue: string) {
    setQuery(inputValue);
    setActiveIndex(-1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmedQuery = inputValue.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const requestId = ++requestIdRef.current;

      startTransition(async () => {
        const results = await searchLocations(trimmedQuery);

        /*
         * Ignore an old request if a newer request
         * has already been started.
         */
        if (requestId !== requestIdRef.current) {
          return;
        }

        setSuggestions(results);
        setOpen(results.length > 0);
      });
    }, 300);
  }

  async function handleSelect(suggestion: PlaceSuggestion) {
    /*
     * Immediately show selected text.
     */
    const selectedLabel = suggestion.secondaryText
      ? `${suggestion.mainText}, ${suggestion.secondaryText}`
      : suggestion.mainText;

    setQuery(selectedLabel);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);

    /*
     * Only resolve the full place after selection.
     */
    const resolved = await resolveLocation(suggestion.placeId);

    if (resolved) {
      onSelect(resolved);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (!open || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((index) => Math.max(index - 1, 0));

      return;
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      const suggestion = suggestions[activeIndex];

      if (suggestion) {
        void handleSelect(suggestion);
      }
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
          aria-hidden="true"
        />

        <input
          type="text"
          value={query}
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setOpen(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          className={`w-full rounded-lg border bg-white py-2 pl-9 pr-9 text-sm text-neutral-900 outline-none transition dark:bg-neutral-800 dark:text-neutral-300 ${
            hasError
              ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-neutral-300 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500"
          }`}
        />

        {isPending && (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-neutral-400"
            aria-hidden="true"
          />
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800"
        >
          {suggestions.map((suggestion, index) => {
            const isActive = index === activeIndex;

            return (
              <li
                key={suggestion.placeId}
                role="option"
                aria-selected={isActive}
                onMouseDown={(event) => {
                  /*
                   * Prevent input blur before selection.
                   */
                  event.preventDefault();
                  void handleSelect(suggestion);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  isActive ? "bg-neutral-100 dark:bg-neutral-700" : ""
                }`}
              >
                <div className="font-medium text-neutral-900 dark:text-neutral-100">
                  {suggestion.mainText}
                </div>

                {suggestion.secondaryText && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {suggestion.secondaryText}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

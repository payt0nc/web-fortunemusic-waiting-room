import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData, useFetcher } from "@remix-run/react";
import { renderToReadableStream } from "react-dom/server";
import { json } from "@remix-run/node";
import * as React from "react";
import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { parseISO, isAfter, subMinutes, isBefore, differenceInSeconds, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";
import { Clock, RefreshCw, Users, ChevronDownIcon, Monitor, Sun, Moon, InfoIcon, LifeBuoyIcon, BookOpenIcon, MenuIcon, XIcon, CircleAlert } from "lucide-react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Slot } from "@radix-ui/react-slot";
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  const body = await renderToReadableStream(
    /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url }),
    {
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      }
    }
  );
  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "icon", href: "/assets/logo.svg", type: "image/svg+xml" },
  { rel: "canonical", href: "https://status.meet.oshi-katsu.app" },
  { rel: "alternate", href: "https://status.meet.oshi-katsu.app", hrefLang: "en" },
  { rel: "alternate", href: "https://status.meet.oshi-katsu.app", hrefLang: "ja" },
  { rel: "alternate", href: "https://status.meet.oshi-katsu.app", hrefLang: "x-default" },
  { rel: "preconnect", href: "https://www.googletagmanager.com" },
  { rel: "dns-prefetch", href: "https://www.googletagmanager.com" }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }),
      /* @__PURE__ */ jsx("title", { children: "46◢ Online Meet Waiting Room | Sakamichi 46 Events" }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: "Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide." }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: "46, Sakamichi, online meet, waiting room, idol events, Nogizaka46, 乃木坂46, Sakurazaka46, 桜坂46, Hinatazaka46, 日向坂46, virtual events, オンラインミート, ミグリト" }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: "46 Online Meet" }),
      /* @__PURE__ */ jsx("meta", { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }),
      /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#000000" }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: "https://status.meet.oshi-katsu.app" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: "46◢ Online Meet Waiting Room" }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: "Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide." }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: "https://status.meet.oshi-katsu.app/assets/logo.svg" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "en_US" }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale:alternate", content: "ja_JP" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "46◢ Online Meet" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:url", content: "https://status.meet.oshi-katsu.app" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: "46◢ Online Meet Waiting Room" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: "Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide." }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: "https://status.meet.oshi-katsu.app/assets/logo.svg" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image:alt", content: "46◢ Online Meet Waiting Room Logo" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "46◢ Online Meet Waiting Room",
          "description": "Join the Sakamichi Online Meet for exclusive 46 online meet events. Track live statistics and connect with fellow fans worldwide.",
          "url": "https://status.meet.oshi-katsu.app/",
          "applicationCategory": "EntertainmentApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY"
          },
          "inLanguage": ["en", "ja"],
          "audience": {
            "@type": "Audience",
            "audienceType": "Fans of Nogizaka46, Sakurazaka46, Hinatazaka46 groups"
          }
        })
      } }),
      /* @__PURE__ */ jsx("script", { async: true, src: "https://www.googletagmanager.com/gtag/js?id=G-6LV8MY8RLD" }),
      /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: {
        __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-6LV8MY8RLD');
          `
      } })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
async function fetchWaitingRooms(eventID) {
  const link = "https://meets.fortunemusic.app/lapi/v5/app/dateTimezoneMessages";
  try {
    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Host header might be needed or handled automatically.
        // In Bun/Node, Host is usually set from URL.
        // "Host": "meets.fortunemusic.app", 
      },
      body: JSON.stringify({ "eventId": "e" + eventID })
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch waiting rooms: ${response.status} ${response.statusText}`);
    }
    let resp = await response.json();
    let waitingRooms = flattenWaitingRooms(resp);
    return waitingRooms;
  } catch (error) {
    console.error("Error fetching waiting rooms:", error);
    throw new Error(`Failed to fetch waiting rooms: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
function flattenWaitingRooms(data) {
  let waitingRooms = /* @__PURE__ */ new Map();
  data.timezones.forEach((timezone) => {
    let eventIDStr = timezone.e_id;
    let eventID = +eventIDStr.slice(1);
    let rooms = waitingRooms.get(eventID) || [];
    Object.keys(timezone.members).forEach((key) => {
      const memberInfo = timezone.members[key];
      rooms.push({
        ticketCode: key,
        peopleCount: memberInfo.totalCount,
        waitingTime: memberInfo.totalWait
      });
    });
    waitingRooms.set(eventID, rooms);
  });
  let wr = { message: data.dateMessage, waitingRooms };
  return wr;
}
async function loader$1({ request }) {
  const url = new URL(request.url);
  const eventId = url.searchParams.get("eventId");
  if (!eventId) {
    return json({ error: "Missing eventId" }, { status: 400 });
  }
  try {
    const data = await fetchWaitingRooms(Number(eventId));
    const serializedWaitingRooms = Array.from(data.waitingRooms.entries());
    return json({
      message: data.message,
      waitingRooms: serializedWaitingRooms
    });
  } catch (error) {
    console.error(error);
    return json({ error: "Failed to fetch waiting rooms" }, { status: 500 });
  }
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function concatUniqueEventID(eventId, sessionId) {
  return `${eventId}-${sessionId}`;
}
const targetArtistNames = ["乃木坂46", "櫻坂46", "日向坂46", "=LOVE"];
async function fetchEvents() {
  const link = "https://api.fortunemusic.app/v1/appGetEventData/";
  try {
    const response = await fetch(link);
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    const data = await response.json();
    let results = /* @__PURE__ */ new Map();
    for (const artist of data.appGetEventResponse.artistArray) {
      if (targetArtistNames.includes(artist.artName)) {
        let events = flatternEventArray(artist.artName, artist.eventArray);
        events.forEach((event, id) => {
          results.set(id, event);
        });
      }
      ;
    }
    return results;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error(`Failed to fetch events: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
function concatEventTime(dt, t) {
  const dateTimeString = dt ? `${dt} ${t}` : dt;
  const jstDate = parseISO(`${dateTimeString}+09:00`);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return toZonedTime(jstDate, tz);
}
function flatternMemberArray(memberArray) {
  let membersMap = /* @__PURE__ */ new Map();
  memberArray.forEach((member) => {
    membersMap.set(member.shCode, {
      order: member.mbSortNo,
      name: member.mbName,
      thumbnailUrl: member.mbPhotoUrl,
      ticketCode: member.shCode
    });
  });
  return membersMap;
}
function flatternTimezoneArray(dateDate, timezoneArray) {
  let sessions = /* @__PURE__ */ new Map();
  timezoneArray.forEach((timezone) => {
    let startAt = concatEventTime(dateDate, timezone.tzStart);
    let endAt = concatEventTime(dateDate, timezone.tzEnd);
    let session = {
      id: timezone.tzId,
      name: timezone.tzName,
      sessionName: timezone.tzName,
      startTime: startAt,
      endTime: endAt,
      members: flatternMemberArray(timezone.memberArray)
    };
    sessions.set(timezone.tzId, session);
  });
  return sessions;
}
function flatternEventArray(artistName, eventArray) {
  let eventMap = /* @__PURE__ */ new Map();
  eventArray.forEach((event) => {
    let events = [];
    let eventName = event.evtName;
    let eventPhotoUrl = event.evtPhotUrl;
    event.dateArray.forEach((date) => {
      let eventDt = parseISO(date.dateDate);
      const now = /* @__PURE__ */ new Date();
      if (isAfter(eventDt, now) || eventDt.toDateString() === now.toDateString()) {
        let sessions = flatternTimezoneArray(date.dateDate, date.timeZoneArray);
        if (sessions.size > 0) {
          let firstSession = Array.from(sessions.values())[0];
          let currentEvent = {
            id: event.evtId,
            uniqueId: concatUniqueEventID(event.evtId, firstSession.id),
            name: eventName,
            artistName,
            photoUrl: eventPhotoUrl,
            date: parseISO(date.dateDate),
            sessions
          };
          events.push(currentEvent);
        }
      }
    });
    eventMap.set(event.evtId, events);
  });
  return eventMap;
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn("h-full w-full bg-purple-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border border-gray-300 dark:border-gray-700", className),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { "data-slot": "card-header", className: cn("flex flex-col gap-1.5 p-6", className), ...props });
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { "data-slot": "card-title", className: cn("leading-none font-semibold tracking-tight", className), ...props });
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { "data-slot": "card-content", className: cn("p-6 pt-0", className), ...props });
}
function SessionSelector({
  id,
  sessions,
  onEventSelect
}) {
  const getDisplayName = (sessionID) => {
    var _a;
    return ((_a = sessions.get(sessionID)) == null ? void 0 : _a.sessionName) || "Unknown Session";
  };
  if (sessions.size === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(CardTitle, { children: "Sessions" }) }) }) }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3", children: Array.from(sessions.entries()).map(([sessionID]) => /* @__PURE__ */ jsxs(
      "label",
      {
        className: `flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all min-w-[180px] ${id === sessionID ? "bg-primary/10 border-primary text-primary" : "border-border hover:bg-accent hover:text-accent-foreground"}`,
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "radio",
              name: "selectedSession",
              value: sessionID,
              checked: id === sessionID,
              onChange: () => onEventSelect(sessionID),
              className: "sr-only"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: `w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${id === sessionID ? "bg-primary border-primary" : "border-border"}`, children: id === sessionID && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-primary-foreground rounded-full" }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("div", { className: "font-medium truncate", children: getDisplayName(sessionID) }) })
        ]
      },
      sessionID
    )) }) })
  ] });
}
function findNearestEvent(eventMap, targetTime) {
  let nearestEvent = null;
  let smallestTimeDiff = Number.MAX_SAFE_INTEGER;
  eventMap.forEach((events) => {
    events.forEach((event) => {
      const sessionTimes = Array.from(event.sessions.values()).map((session) => session.startTime);
      if (sessionTimes.length > 0) {
        const earliestSessionTime = new Date(Math.min(...sessionTimes.map((t) => t.getTime())));
        const timeDiff = Math.abs(earliestSessionTime.getTime() - targetTime.getTime());
        if (timeDiff < smallestTimeDiff) {
          smallestTimeDiff = timeDiff;
          nearestEvent = event;
        }
      }
    });
  });
  return nearestEvent;
}
function ShimmeringText({
  text,
  duration = 1,
  transition,
  wave = false,
  className,
  color,
  shimmeringColor,
  ...props
}) {
  var _a;
  const finalColor = color || "var(--color-shimmering-text)";
  const finalShimmeringColor = shimmeringColor || "var(--color-shimmering-text)";
  return /* @__PURE__ */ jsx(
    motion.span,
    {
      className: cn("relative inline-block [perspective:500px]", className),
      style: {
        "--shimmering-color": finalShimmeringColor,
        "--color": finalColor
      },
      ...props,
      children: (_a = text == null ? void 0 : text.split("")) == null ? void 0 : _a.map((char, i) => /* @__PURE__ */ jsx(
        motion.span,
        {
          className: "inline-block whitespace-pre [transform-style:preserve-3d]",
          style: {
            animation: `shimmer ${duration}s ease-in-out infinite`,
            animationDelay: `${i * duration / text.length}s`
          },
          initial: {
            ...wave ? {
              scale: 1,
              rotateY: 0
            } : {}
          },
          animate: {
            ...wave ? {
              x: [0, 5, 0],
              y: [0, -5, 0],
              scale: [1, 1.1, 1],
              rotateY: [0, 15, 0]
            } : {}
          },
          transition: {
            duration,
            repeat: Infinity,
            repeatType: "loop",
            repeatDelay: text.length * 0.05,
            delay: i * duration / text.length,
            ease: "easeInOut",
            ...transition
          },
          children: char
        },
        i
      ))
    }
  );
}
function EventCard({ name, date }) {
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start justify-center gap-2 p-6 text-left", children: [
    /* @__PURE__ */ jsx("div", { className: "text-left", children: /* @__PURE__ */ jsx(
      ShimmeringText,
      {
        text: name,
        duration: 2,
        wave: true,
        shimmeringColor: "hsl(var(--primary))"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "text-left text-muted-foreground", children: /* @__PURE__ */ jsx(
      ShimmeringText,
      {
        text: date,
        duration: 2,
        wave: false,
        shimmeringColor: "hsl(var(--primary))"
      }
    ) })
  ] }) });
}
function getTimerColors(variant) {
  switch (variant) {
    case "event":
      return {
        icon: "text-red-500",
        time: "text-red-500"
      };
    case "refresh":
      return {
        icon: "text-orange-500",
        time: "text-orange-500"
      };
    default:
      return {
        icon: "text-gray-500",
        time: "text-gray-500"
      };
  }
}
function EventTimer({ startAt, endAt, variant = "event" }) {
  const [timerState, setTimerState] = useState({
    label: "Event Timer",
    timeText: "--:--:--",
    isActive: false,
    remainingSeconds: 0,
    progressPercentage: 0,
    startTime: /* @__PURE__ */ new Date(),
    showProgressBar: false
  });
  useEffect(() => {
    const calculateTimer = () => {
      const current = /* @__PURE__ */ new Date();
      const preEventStart = subMinutes(startAt, 15);
      let targetTime;
      let label;
      let startTime;
      if (isBefore(current, preEventStart)) {
        const totalSeconds2 = differenceInSeconds(startAt, current);
        const hours2 = Math.floor(totalSeconds2 / 3600);
        const minutes2 = Math.floor(totalSeconds2 % 3600 / 60);
        const seconds2 = totalSeconds2 % 60;
        const timeText2 = `${hours2.toString().padStart(2, "0")}:${minutes2.toString().padStart(2, "0")}:${seconds2.toString().padStart(2, "0")}`;
        setTimerState({
          label: "Time to Start",
          timeText: timeText2,
          isActive: true,
          remainingSeconds: totalSeconds2,
          progressPercentage: 0,
          startTime: preEventStart,
          showProgressBar: false
        });
        return;
      } else if (isBefore(current, startAt)) {
        targetTime = startAt;
        startTime = preEventStart;
        label = "Time to Start";
      } else if (!isBefore(current, startAt) && isBefore(current, endAt)) {
        targetTime = endAt;
        startTime = startAt;
        label = "Time to End";
      } else {
        setTimerState({
          label: "Event Ended",
          timeText: "00:00:00",
          isActive: false,
          remainingSeconds: 0,
          progressPercentage: 0,
          startTime: endAt,
          showProgressBar: false
        });
        return;
      }
      const totalSeconds = differenceInSeconds(targetTime, current);
      if (totalSeconds <= 0) {
        setTimerState({
          label: "Event Ended",
          timeText: "00:00:00",
          isActive: false,
          remainingSeconds: 0,
          progressPercentage: 0,
          startTime: endAt,
          showProgressBar: false
        });
        return;
      }
      const totalDuration = differenceInSeconds(targetTime, startTime);
      const progressPercentage = Math.min(Math.max(totalSeconds / totalDuration * 100, 0), 100);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor(totalSeconds % 3600 / 60);
      const seconds = totalSeconds % 60;
      const timeText = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      setTimerState({
        label,
        timeText,
        isActive: true,
        remainingSeconds: totalSeconds,
        progressPercentage,
        startTime,
        showProgressBar: true
      });
    };
    calculateTimer();
    const interval = setInterval(calculateTimer, 100);
    return () => clearInterval(interval);
  }, [startAt, endAt]);
  const getProgressColor = (percentage) => {
    if (percentage > 50) {
      return "bg-green-500";
    } else if (percentage > 20) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };
  const getTextColor = (percentage) => {
    if (percentage > 50) {
      return "text-green-500";
    } else if (percentage > 20) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };
  const colors = getTimerColors(variant);
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-card-foreground flex flex-auto items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx(Clock, { className: `h-5 w-5 ${colors.icon}` }),
        timerState.label
      ] }),
      /* @__PURE__ */ jsx("span", { className: `text-2xl font-bold ${!timerState.isActive ? "text-red-400" : getTextColor(timerState.progressPercentage)}`, children: timerState.timeText })
    ] }) }),
    timerState.showProgressBar && /* @__PURE__ */ jsx(CardContent, { className: "pt-0 pb-6 w-full", children: /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx("div", { className: "relative h-3 w-full overflow-hidden rounded-full bg-gray-700/50", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: `h-full transition-all duration-100 ease-linear ${getProgressColor(timerState.progressPercentage)}`,
        style: { width: `${timerState.progressPercentage}%` }
      }
    ) }) }) })
  ] });
}
function TimerProgress({
  targetTime,
  startTime,
  onRefreshClick,
  variant = "refresh",
  eventStartTime,
  eventEndTime
}) {
  const [progressState, setProgressState] = useState({
    remainingSeconds: 0,
    progressPercentage: 0,
    isExpired: false,
    showProgressBar: false
  });
  useEffect(() => {
    const calculateProgress = () => {
      const now = /* @__PURE__ */ new Date();
      const target = targetTime;
      const start = startTime;
      let shouldShowProgressBar = false;
      if (eventStartTime && eventEndTime) {
        const preEventStart = subMinutes(eventStartTime, 15);
        shouldShowProgressBar = !isBefore(now, preEventStart) && isBefore(now, eventEndTime);
      } else {
        shouldShowProgressBar = true;
      }
      if (!isAfter(target, now)) {
        setProgressState({
          remainingSeconds: 0,
          progressPercentage: 100,
          isExpired: true,
          showProgressBar: shouldShowProgressBar
        });
        return;
      }
      const totalDuration = differenceInSeconds(target, start);
      const remaining = differenceInSeconds(target, now);
      const percentage = Math.min(Math.max(remaining / totalDuration * 100, 0), 100);
      setProgressState({
        remainingSeconds: Math.max(remaining, 0),
        progressPercentage: percentage,
        isExpired: false,
        showProgressBar: shouldShowProgressBar
      });
    };
    calculateProgress();
    const interval = setInterval(calculateProgress, 100);
    return () => clearInterval(interval);
  }, [targetTime, startTime, eventStartTime, eventEndTime]);
  const formatTime = (seconds) => {
    if (seconds <= 0) return "0s";
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  const getProgressColor = (percentage) => {
    if (percentage > 50) {
      return "bg-green-500";
    } else if (percentage > 20) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };
  const getTextColor = (percentage) => {
    if (percentage > 50) {
      return "text-green-500";
    } else if (percentage > 20) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };
  const colors = getTimerColors(variant);
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-card-foreground flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx(
          RefreshCw,
          {
            className: `h-5 w-5 ${colors.icon} ${onRefreshClick ? "cursor-pointer hover:scale-110 transition-transform" : ""}`,
            onClick: onRefreshClick
          }
        ),
        "Next Update"
      ] }),
      /* @__PURE__ */ jsx("span", { className: `text-2xl font-bold ${progressState.isExpired ? "text-red-400" : getTextColor(progressState.progressPercentage)}`, children: formatTime(progressState.remainingSeconds) })
    ] }) }),
    progressState.showProgressBar && /* @__PURE__ */ jsx(CardContent, { className: "pt-0 pb-6 w-full", children: /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx("div", { className: "relative h-3 w-full overflow-hidden rounded-full bg-gray-700/50", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: `h-full transition-all duration-100 ease-linear ${getProgressColor(progressState.progressPercentage)}`,
        style: { width: `${progressState.progressPercentage}%` }
      }
    ) }) }) })
  ] });
}
function StatsCards({ session, lastUpdate, nextRefreshTime, loading, onManualRefresh, participant }) {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4", children: [
    !loading && session && /* @__PURE__ */ jsx(
      EventTimer,
      {
        startAt: session.startTime,
        endAt: session.endTime,
        variant: "event"
      }
    ),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-card-foreground flex flex-auto items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-blue-500" }),
        "Participants"
      ] }),
      /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-blue-500", children: participant.toLocaleString() })
    ] }) }) }),
    !loading && session && /* @__PURE__ */ jsx(
      TimerProgress,
      {
        targetTime: nextRefreshTime,
        startTime: lastUpdate,
        variant: "refresh",
        onRefreshClick: onManualRefresh,
        eventStartTime: session.startTime,
        eventEndTime: session.endTime
      }
    )
  ] });
}
function getThresholdColors(value, lowThreshold, highThreshold) {
  if (value < lowThreshold) {
    return { text: "text-emerald-400" };
  } else if (value >= lowThreshold && value < highThreshold) {
    return { text: "text-yellow-400" };
  } else {
    return { text: "text-red-400" };
  }
}
function getPeopleCountColors(peopleCount) {
  return getThresholdColors(peopleCount, 10, 30);
}
function getWaitingTimeColors(waitingDuration) {
  return getThresholdColors(waitingDuration, 600, 1800);
}
function joinMemberWaitingRoom(currentSessionID, waitingRooms, members) {
  let result = [];
  for (let [sessionID, rooms] of waitingRooms) {
    if (currentSessionID === sessionID) {
      for (let room of rooms) {
        let roomId = room.ticketCode;
        if (members.has(roomId)) {
          let member = members.get(roomId);
          result.push({
            id: roomId,
            order: member.order,
            name: member.name,
            thumbnailUrl: member.thumbnailUrl,
            waitingCount: room.peopleCount,
            waitingTime: room.waitingTime
          });
        }
      }
    }
  }
  return result;
}
function WaitingRoomGrid({ currentSessionID, waitingRooms, members }) {
  console.log("WaitingRoomGrid Props:", { currentSessionID, waitingRooms, members });
  const rooms = joinMemberWaitingRoom(currentSessionID, waitingRooms, members);
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4", children: rooms.map((room) => /* @__PURE__ */ jsxs(
    Card,
    {
      className: "hover:shadow-md transition-all min-w-[200px] p-[5px]",
      children: [
        /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-2", children: /* @__PURE__ */ jsx(CardTitle, { className: "text-card-foreground text-sm truncate", children: room.name }) }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "pt-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-3", children: [
            /* @__PURE__ */ jsx("div", { className: `text-3xl font-bold ${getPeopleCountColors(room.waitingCount).text}`, children: room.waitingCount }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "people" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-center gap-1 ${getWaitingTimeColors(room.waitingTime).text}`, children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold font-mono", children: (() => {
                const totalSeconds = Math.floor(room.waitingTime);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
              })() })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "wait time" })
          ] })
        ] })
      ]
    },
    room.id
  )) });
}
function formatDate(date) {
  return format(date, "yyyy-MM-dd");
}
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    NavigationMenuPrimitive.Root,
    {
      "data-slot": "navigation-menu",
      "data-viewport": viewport,
      className: cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      ),
      ...props,
      children: [
        children,
        viewport && /* @__PURE__ */ jsx(NavigationMenuViewport, {})
      ]
    }
  );
}
function NavigationMenuList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    NavigationMenuPrimitive.List,
    {
      "data-slot": "navigation-menu-list",
      className: cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      ),
      ...props
    }
  );
}
function NavigationMenuItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    NavigationMenuPrimitive.Item,
    {
      "data-slot": "navigation-menu-item",
      className: cn("relative", className),
      ...props
    }
  );
}
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1"
);
function NavigationMenuTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    NavigationMenuPrimitive.Trigger,
    {
      "data-slot": "navigation-menu-trigger",
      className: cn(navigationMenuTriggerStyle(), "group", className),
      ...props,
      children: [
        children,
        " ",
        /* @__PURE__ */ jsx(
          ChevronDownIcon,
          {
            className: "relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180",
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
}
function NavigationMenuContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    NavigationMenuPrimitive.Content,
    {
      "data-slot": "navigation-menu-content",
      className: cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      ),
      ...props
    }
  );
}
function NavigationMenuViewport({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "absolute top-full left-0 isolate z-50 flex justify-center"
      ),
      children: /* @__PURE__ */ jsx(
        NavigationMenuPrimitive.Viewport,
        {
          "data-slot": "navigation-menu-viewport",
          className: cn(
            "origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
            className
          ),
          ...props
        }
      )
    }
  );
}
function NavigationMenuLink({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    NavigationMenuPrimitive.Link,
    {
      "data-slot": "navigation-menu-link",
      className: cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function Popover({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Root, { "data-slot": "popover", ...props });
}
function PopoverTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Trigger, { "data-slot": "popover-trigger", ...props });
}
function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    PopoverPrimitive.Content,
    {
      "data-slot": "popover-content",
      align,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
        className
      ),
      ...props
    }
  ) });
}
const themes = [
  {
    key: "system",
    icon: Monitor,
    label: "System theme"
  },
  {
    key: "light",
    icon: Sun,
    label: "Light theme"
  },
  {
    key: "dark",
    icon: Moon,
    label: "Dark theme"
  }
];
const ThemeSwitcher = ({
  value,
  onChange,
  defaultValue = "system",
  className
}) => {
  const [theme, setTheme] = useControllableState({
    defaultProp: defaultValue,
    prop: value,
    onChange
  });
  const [mounted, setMounted] = useState(false);
  const handleThemeClick = useCallback(
    (themeKey) => {
      setTheme(themeKey);
    },
    [setTheme]
  );
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border",
        className
      ),
      children: themes.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            "aria-label": label,
            className: "relative h-6 w-6 rounded-full",
            onClick: () => handleThemeClick(key),
            type: "button",
            children: [
              isActive && /* @__PURE__ */ jsx(
                motion.div,
                {
                  className: "absolute inset-0 rounded-full bg-secondary",
                  layoutId: "activeTheme",
                  transition: { type: "spring", duration: 0.5 }
                }
              ),
              /* @__PURE__ */ jsx(
                Icon,
                {
                  className: cn(
                    "relative z-10 m-auto h-4 w-4",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )
                }
              )
            ]
          },
          key
        );
      })
    }
  );
};
function GithubIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className,
      ...props,
      children: [
        /* @__PURE__ */ jsx("path", { d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5c.08-1.25-.27-2.48-1-3.5c.28-1.15.28-2.35 0-3.5c0 0-1 0-3 1.5c-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5c-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" }),
        /* @__PURE__ */ jsx("path", { d: "M9 18c-4.51 2-5-2-7-2" })
      ]
    }
  );
}
const sizes = {
  default: "size-8 [&_svg]:size-5",
  sm: "size-6 [&_svg]:size-4",
  md: "size-10 [&_svg]:size-6",
  lg: "size-12 [&_svg]:size-7"
};
function IconButton({
  icon: Icon,
  className,
  active = false,
  animate = true,
  size = "default",
  color = [59, 130, 246],
  transition = { type: "spring", stiffness: 300, damping: 15 },
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    motion.button,
    {
      "data-slot": "icon-button",
      className: cn(
        `group/icon-button cursor-pointer relative inline-flex size-10 shrink-0 rounded-full hover:bg-[var(--icon-button-color)]/10 active:bg-[var(--icon-button-color)]/20 text-[var(--icon-button-color)]`,
        sizes[size],
        className
      ),
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      style: {
        "--icon-button-color": `rgb(${color[0]}, ${color[1]}, ${color[2]})`
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 stroke-muted-foreground group-hover/icon-button:stroke-[var(--icon-button-color)]",
            "aria-hidden": "true",
            children: React.createElement(Icon, {
              className: active ? "fill-[var(--icon-button-color)]" : "fill-transparent"
            })
          }
        ),
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: active && /* @__PURE__ */ jsx(
          motion.div,
          {
            className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--icon-button-color)] fill-[var(--icon-button-color)]",
            "aria-hidden": "true",
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0 },
            transition,
            children: React.createElement(Icon)
          }
        ) }),
        /* @__PURE__ */ jsx(AnimatePresence, { children: animate && active && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute inset-0 z-10 rounded-full ",
              style: {
                background: `radial-gradient(circle, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0) 70%)`
              },
              initial: { scale: 1.2, opacity: 0 },
              animate: { scale: [1.2, 1.8, 1.2], opacity: [0, 0.3, 0] },
              transition: { duration: 1.2, ease: "easeInOut" }
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute inset-0 z-10 rounded-full",
              style: {
                boxShadow: `0 0 10px 2px rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`
              },
              initial: { scale: 1, opacity: 0 },
              animate: { scale: [1, 1.5], opacity: [0.8, 0] },
              transition: { duration: 0.8, ease: "easeOut" }
            }
          ),
          [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(
            motion.div,
            {
              className: "absolute w-1 h-1 rounded-full bg-[var(--icon-button-color)]",
              initial: { x: "50%", y: "50%", scale: 0, opacity: 0 },
              animate: {
                x: `calc(50% + ${Math.cos(i * Math.PI / 3) * 30}px)`,
                y: `calc(50% + ${Math.sin(i * Math.PI / 3) * 30}px)`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              },
              transition: { duration: 0.8, delay: i * 0.05, ease: "easeOut" }
            },
            i
          ))
        ] }) })
      ]
    }
  );
}
const getArtistColorClasses = (artistName) => {
  const colorMap = {
    "乃木坂46": "text-purple-600 hover:bg-purple-50 dark:text-purple-600 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5 dark:bg-card",
    "櫻坂46": "text-pink-300 hover:bg-pink-50 dark:text-pink-300 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5 dark:bg-card",
    "日向坂46": "text-sky-400 hover:bg-sky-50 dark:text-sky-400 dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5 dark:bg-card"
  };
  return colorMap[artistName] || "text-black hover:bg-gray-50 dark:text-white dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/5 dark:bg-card";
};
function convertEventsToNavigationLinks(events) {
  const items = /* @__PURE__ */ new Map();
  events.forEach((eventList, artistId) => {
    eventList.forEach((event) => {
      var _a;
      let artistName = event.artistName;
      if (items.has(artistName)) {
        (_a = items.get(artistName)) == null ? void 0 : _a.push(event);
      } else {
        items.set(artistName, [event]);
      }
    });
  });
  const artistOrder = ["乃木坂46", "櫻坂46", "日向坂46", "=LOVE"];
  let barItems = [];
  items.forEach((eventList, artistName) => {
    let list = eventList.sort((a, b) => a.date.getTime() - b.date.getTime());
    let listItems = [];
    list.map((event) => {
      listItems.push({
        href: `${event.uniqueId}`,
        label: `${event.name}`,
        description: formatDate(event.date)
      });
    });
    let menuItem = {
      label: artistName,
      submenu: true,
      type: "simple",
      sortOrder: artistOrder.indexOf(artistName),
      items: listItems
    };
    barItems.push(menuItem);
  });
  barItems.sort((a, b) => {
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
  return barItems;
}
const Navbar02 = ({
  className,
  logo = null,
  logoHref = "#",
  events = /* @__PURE__ */ new Map(),
  onSignInClick,
  onCtaClick,
  onEventSelect,
  ...props
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [navigationLinks, setNavigationLinks] = useState([]);
  const containerRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "system";
  });
  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setIsMobile(width < 768);
      }
    };
    checkWidth();
    const resizeObserver = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  useEffect(() => {
    let availableNavigationLinks = convertEventsToNavigationLinks(events);
    setNavigationLinks(availableNavigationLinks);
  }, [events]);
  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem("theme", theme);
    const applyTheme = (themeToApply) => {
      root.classList.remove("light", "dark");
      root.classList.add(themeToApply);
    };
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      applyTheme(systemTheme);
      const handleChange = (e) => {
        applyTheme(e.matches ? "dark" : "light");
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      applyTheme(theme);
    }
  }, [theme]);
  return /* @__PURE__ */ jsx(
    "header",
    {
      ref: containerRef,
      className: cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur px-4 md:px-6 [&_*]:no-underline",
        "bg-background/95 supports-[backdrop-filter]:bg-background/60",
        "dark:!bg-black/85 dark:supports-[backdrop-filter]:!bg-black/85",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          isMobile && /* @__PURE__ */ jsxs(Popover, { children: [
            /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
              "button",
              {
                className: "inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
                "aria-label": "Open menu",
                children: /* @__PURE__ */ jsx(MenuIcon, { className: "h-5 w-5" })
              }
            ) }),
            /* @__PURE__ */ jsx(PopoverContent, { align: "start", className: "w-64 p-1 max-h-[80vh] overflow-y-auto", children: /* @__PURE__ */ jsx(NavigationMenu, { className: "max-w-none", children: /* @__PURE__ */ jsx(NavigationMenuList, { className: "flex-col items-start gap-0 select-none", children: navigationLinks.map((link, index) => {
              var _a;
              const colorClasses = getArtistColorClasses(link.label);
              return /* @__PURE__ */ jsx(NavigationMenuItem, { className: "w-full", children: link.submenu ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("div", { className: cn(
                  "px-2 py-1.5 text-xs font-medium border rounded-md mb-1",
                  colorClasses
                ), children: link.label }),
                /* @__PURE__ */ jsx("ul", { children: (_a = link.items) == null ? void 0 : _a.map((item, itemIndex) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.preventDefault();
                      if (onEventSelect && item.href) {
                        onEventSelect(item.href);
                      }
                    },
                    className: "flex w-full items-left rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline",
                    children: item.label
                  }
                ) }, itemIndex)) })
              ] }) : /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: (e) => e.preventDefault(),
                  className: "flex w-full items-left rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline",
                  children: link.label
                }
              ) }, index);
            }) }) }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: (e) => e.preventDefault(),
                className: "flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "text-2xl", children: logo }),
                  /* @__PURE__ */ jsx("span", { className: "hidden font-bold text-xl sm:inline-block", children: "Online Meet Dashboard" })
                ]
              }
            ),
            !isMobile && /* @__PURE__ */ jsx(NavigationMenu, { className: "flex", children: /* @__PURE__ */ jsx(NavigationMenuList, { className: "gap-1", children: navigationLinks.map((link, index) => {
              var _a, _b;
              const colorClasses = getArtistColorClasses(link.label);
              return /* @__PURE__ */ jsx(NavigationMenuItem, { children: link.submenu ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(NavigationMenuTrigger, { className: cn(
                  "border transition-all",
                  colorClasses
                ), children: link.label }),
                /* @__PURE__ */ jsx(NavigationMenuContent, { children: link.type === "simple" ? /* @__PURE__ */ jsx("div", { className: "grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px] text-left", children: (_a = link.items) == null ? void 0 : _a.map((item, itemIndex) => /* @__PURE__ */ jsx(
                  ListItem,
                  {
                    title: item.label,
                    href: item.href,
                    type: link.type,
                    onEventSelect,
                    children: item.description
                  },
                  itemIndex
                )) }) : /* @__PURE__ */ jsx("div", { className: "grid gap-3 p-4", children: (_b = link.items) == null ? void 0 : _b.map((item, itemIndex) => /* @__PURE__ */ jsx(
                  ListItem,
                  {
                    title: item.label,
                    href: item.href,
                    type: link.type,
                    onEventSelect,
                    children: item.description
                  },
                  itemIndex
                )) }) })
              ] }) : /* @__PURE__ */ jsx(
                NavigationMenuLink,
                {
                  href: link.href,
                  className: cn(navigationMenuTriggerStyle(), "cursor-pointer"),
                  onClick: (e) => e.preventDefault(),
                  children: link.label
                }
              ) }, index);
            }) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(ThemeSwitcher, { defaultValue: "system", onChange: setTheme, value: theme }),
          /* @__PURE__ */ jsx(
            IconButton,
            {
              icon: GithubIcon,
              color: [0, 0, 0],
              onClick: () => window.open("https://github.com/payt0nc/web-fortunemusic-waiting-room", "_blank"),
              size: "md"
            }
          )
        ] })
      ] })
    }
  );
};
const ListItem = React.forwardRef(({ className, title, children, icon, type, href, onEventSelect, ...props }, ref) => {
  const renderIconComponent = (iconName) => {
    if (!iconName) return null;
    switch (iconName) {
      case "BookOpenIcon":
        return /* @__PURE__ */ jsx(BookOpenIcon, { className: "h-5 w-5" });
      case "LifeBuoyIcon":
        return /* @__PURE__ */ jsx(LifeBuoyIcon, { className: "h-5 w-5" });
      case "InfoIcon":
        return /* @__PURE__ */ jsx(InfoIcon, { className: "h-5 w-5" });
      default:
        return null;
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (onEventSelect && href) {
      onEventSelect(href);
    }
  };
  return /* @__PURE__ */ jsx(NavigationMenuLink, { asChild: true, children: /* @__PURE__ */ jsx(
    "a",
    {
      ref,
      onClick: handleClick,
      className: cn(
        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer",
        className
      ),
      ...props,
      children: type === "icon" && icon ? /* @__PURE__ */ jsxs("div", { className: "flex items-start space-x-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted", children: renderIconComponent(icon) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-base font-medium leading-tight", children: title }),
          children && /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-sm leading-snug text-muted-foreground", children })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "text-base font-medium leading-none", children: title }),
        children && /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-sm leading-snug text-muted-foreground", children })
      ] })
    }
  ) });
});
ListItem.displayName = "ListItem";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
const BannerContext = createContext({
  show: true,
  setShow: () => {
  }
});
const Banner = ({
  children,
  visible,
  defaultVisible = true,
  onClose,
  className,
  inset = false,
  ...props
}) => {
  const [show, setShow] = useControllableState({
    defaultProp: defaultVisible,
    prop: visible,
    onChange: onClose
  });
  if (!show) {
    return null;
  }
  return /* @__PURE__ */ jsx(BannerContext.Provider, { value: { show, setShow }, children: /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "flex w-full items-center justify-between gap-2 bg-primary px-4 py-2 text-primary-foreground",
        inset && "rounded-lg",
        className
      ),
      ...props,
      children
    }
  ) });
};
const BannerIcon = ({
  icon: Icon,
  className,
  ...props
}) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn(
      "rounded-full border border-background/20 bg-background/10 p-1 shadow-sm",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(Icon, { size: 16 })
  }
);
const BannerTitle = ({ className, ...props }) => /* @__PURE__ */ jsx("p", { className: cn("flex-1 text-sm", className), ...props });
const BannerClose = ({
  variant = "ghost",
  size = "icon",
  onClick,
  className,
  ...props
}) => {
  const { setShow } = useContext(BannerContext);
  const handleClick = (e) => {
    setShow(false);
    onClick == null ? void 0 : onClick(e);
  };
  return /* @__PURE__ */ jsx(
    Button,
    {
      className: cn(
        "shrink-0 bg-transparent hover:bg-background/10 hover:text-background",
        className
      ),
      onClick: handleClick,
      size,
      variant,
      ...props,
      children: /* @__PURE__ */ jsx(XIcon, { size: 18 })
    }
  );
};
function serializeEvents(events) {
  return Array.from(events.entries()).map(([k, v]) => [k, v.map((e) => ({
    ...e,
    sessions: Array.from(e.sessions.entries()).map(([sk, sv]) => [sk, {
      ...sv,
      members: Array.from(sv.members.entries())
    }])
  }))]);
}
function deserializeEvents(data) {
  if (!data) return /* @__PURE__ */ new Map();
  return new Map(data.map(([k, v]) => [k, v.map((e) => ({
    ...e,
    date: new Date(e.date),
    sessions: new Map(e.sessions.map(([sk, sv]) => [sk, {
      ...sv,
      startTime: new Date(sv.startTime),
      endTime: new Date(sv.endTime),
      members: new Map(sv.members)
    }]))
  }))]));
}
function serializeWaitingRooms(wr) {
  return {
    message: wr.message,
    waitingRooms: Array.from(wr.waitingRooms.entries())
  };
}
function deserializeWaitingRooms(data) {
  if (!data) return { message: "", waitingRooms: /* @__PURE__ */ new Map() };
  return {
    message: data.message,
    waitingRooms: new Map(data.waitingRooms)
  };
}
const meta = () => {
  return [
    { title: "46◢ Online Meet Waiting Room" }
  ];
};
async function loader() {
  try {
    const eventsMap = await fetchEvents();
    const current = /* @__PURE__ */ new Date();
    const defaultEvent = findNearestEvent(eventsMap, current);
    let defaultWaitingRooms = null;
    let initialError = null;
    if (defaultEvent) {
      const k = defaultEvent.sessions.keys().next().value;
      if (k !== void 0) {
        const defaultSession = defaultEvent.sessions.get(k);
        if (defaultSession) {
          try {
            const wr = await fetchWaitingRooms(defaultSession.id);
            defaultWaitingRooms = serializeWaitingRooms(wr);
          } catch (e) {
            console.error("Failed to fetch initial waiting rooms", e);
            initialError = "Failed to fetch initial waiting rooms";
          }
        }
      }
    }
    return json({
      events: serializeEvents(eventsMap),
      defaultWaitingRooms,
      initialError
    });
  } catch (error) {
    console.error("Failed to load events", error);
    throw new Response("Failed to load events", { status: 500 });
  }
}
function extractMembers(sessions) {
  let members = /* @__PURE__ */ new Map();
  sessions.forEach((session) => {
    session.members.forEach((member, memberId) => {
      members.set(memberId, member);
    });
  });
  return members;
}
function getArtistLogo(artistName) {
  const logoMap = {
    "乃木坂46": "/assets/nogizaka46_logo.svg",
    "櫻坂46": "/assets/sakurazaka46_logo.svg",
    "日向坂46": "/assets/hinatazaka46_logo.svg"
  };
  return logoMap[artistName] || null;
}
function updateBackgroundImage(logoUrl) {
  if (logoUrl) {
    document.documentElement.style.setProperty("--background-logo", `url("${logoUrl}")`);
  } else {
    document.documentElement.style.setProperty("--background-logo", "none");
  }
}
function Index() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();
  const [events] = useState(() => deserializeEvents(loaderData.events));
  const [selectedEvent, setSelectedEvent] = useState(() => {
    const current = /* @__PURE__ */ new Date();
    return findNearestEvent(events, current) || null;
  });
  const [sessions, setSessions] = useState(() => {
    return selectedEvent ? selectedEvent.sessions : /* @__PURE__ */ new Map();
  });
  const [selectedSession, setSelectedSession] = useState(() => {
    if (selectedEvent) {
      const k = selectedEvent.sessions.keys().next().value;
      return k !== void 0 ? selectedEvent.sessions.get(k) || null : null;
    }
    return null;
  });
  const [members, setMembers] = useState(() => {
    return selectedEvent ? extractMembers(selectedEvent.sessions) : /* @__PURE__ */ new Map();
  });
  const [waitingRooms, setWaitingRooms] = useState(() => {
    return loaderData.defaultWaitingRooms ? deserializeWaitingRooms(loaderData.defaultWaitingRooms).waitingRooms : /* @__PURE__ */ new Map();
  });
  const [notice, setNotice] = useState(() => {
    return loaderData.defaultWaitingRooms ? deserializeWaitingRooms(loaderData.defaultWaitingRooms).message : null;
  });
  const [participant, setParticipant] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(/* @__PURE__ */ new Date());
  const [nextRefreshTime, setNextRefreshTime] = useState(new Date(Date.now() + 20 * 1e3));
  const [error, setError] = useState(loaderData.initialError || null);
  useEffect(() => {
    if (selectedSession) {
      const thisRoom = waitingRooms.get(selectedSession.id) || [];
      const count = thisRoom.reduce((sum, room) => sum + room.peopleCount, 0);
      setParticipant(count);
    }
  }, [waitingRooms, selectedSession]);
  const handleEventSelect = (uniqueId) => {
    let foundEvent = null;
    events.forEach((eventList) => {
      const event = eventList.find((e) => e.uniqueId === uniqueId);
      if (event) foundEvent = event;
    });
    if (foundEvent) {
      const selectedEventData = foundEvent;
      setSelectedEvent(selectedEventData);
      setSessions(selectedEventData.sessions);
      setMembers(extractMembers(selectedEventData.sessions));
      const firstSessionKey = selectedEventData.sessions.keys().next().value;
      if (firstSessionKey !== void 0) {
        const firstSession = selectedEventData.sessions.get(firstSessionKey);
        if (firstSession) {
          setSelectedSession(firstSession);
          fetcher.load(`/api/waiting-rooms?eventId=${firstSession.id}`);
        }
      }
    }
  };
  useEffect(() => {
    if (selectedEvent) {
      const logoFileName = getArtistLogo(selectedEvent.artistName);
      updateBackgroundImage(logoFileName);
    }
  }, [selectedEvent == null ? void 0 : selectedEvent.id]);
  useEffect(() => {
    const checkRefresh = () => {
      const now = /* @__PURE__ */ new Date();
      if (now >= nextRefreshTime && selectedSession && fetcher.state === "idle") {
        fetcher.load(`/api/waiting-rooms?eventId=${selectedSession.id}`);
        setNextRefreshTime(new Date(Date.now() + 20 * 1e3));
      }
    };
    const interval = setInterval(checkRefresh, 1e3);
    return () => clearInterval(interval);
  }, [nextRefreshTime, selectedSession, fetcher.state]);
  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data;
      if (data.error) {
        console.error(data.error);
      } else {
        const wrMap = new Map(data.waitingRooms);
        setWaitingRooms(wrMap);
        if (data.message) setNotice(data.message);
        else setNotice(null);
        setLastUpdate(/* @__PURE__ */ new Date());
      }
    }
  }, [fetcher.data]);
  const manualRefresh = () => {
    if (selectedSession) {
      fetcher.load(`/api/waiting-rooms?eventId=${selectedSession.id}`);
      setNextRefreshTime(new Date(Date.now() + 20 * 1e3));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen relative", children: [
    /* @__PURE__ */ jsx(Navbar02, { events, onEventSelect: handleEventSelect }),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Error loading events:" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: error })
      ] }),
      notice && /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxs(Banner, { children: [
        /* @__PURE__ */ jsx(BannerIcon, { icon: CircleAlert }),
        /* @__PURE__ */ jsx(BannerTitle, { children: notice }),
        /* @__PURE__ */ jsx(BannerClose, {})
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
        EventCard,
        {
          name: selectedEvent == null ? void 0 : selectedEvent.name,
          date: (selectedEvent == null ? void 0 : selectedEvent.date) ? formatDate(selectedEvent.date) : ""
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
        SessionSelector,
        {
          id: (selectedSession == null ? void 0 : selectedSession.id) || null,
          sessions,
          onEventSelect: (eventId) => {
            const session = sessions.get(eventId);
            setSelectedSession(session || null);
            if (session) {
              fetcher.load(`/api/waiting-rooms?eventId=${session.id}`);
            }
          }
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
        StatsCards,
        {
          session: selectedSession,
          lastUpdate,
          nextRefreshTime,
          loading: fetcher.state !== "idle",
          onManualRefresh: manualRefresh,
          participant
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 mb-8", children: /* @__PURE__ */ jsx(
        WaitingRoomGrid,
        {
          currentSessionID: (selectedSession == null ? void 0 : selectedSession.id) || 0,
          waitingRooms,
          members
        }
      ) })
    ] })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-AwWdpHUn.js", "imports": ["/assets/components-BiU42yhg.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-QwPitN3c.js", "imports": ["/assets/components-BiU42yhg.js"], "css": ["/assets/root-DRjYo-vX.css"] }, "routes/api.waiting-rooms": { "id": "routes/api.waiting-rooms", "parentId": "root", "path": "api/waiting-rooms", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/api.waiting-rooms-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-g_dU1wEd.js", "imports": ["/assets/components-BiU42yhg.js"], "css": [] } }, "url": "/assets/manifest-ad77b1cd.js", "version": "ad77b1cd" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/api.waiting-rooms": {
    id: "routes/api.waiting-rooms",
    parentId: "root",
    path: "api/waiting-rooms",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};

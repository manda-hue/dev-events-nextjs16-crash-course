export type EventType = "conference" | "hackathon" | "meetup";

export type Event = {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
    type: EventType;
    description: string;
};

export const events: Event[] = [
    {
        title: "React Summit 2026",
        image: "/images/event1.png",
        slug: "react-summit-2026",
        location: "Amsterdam, Netherlands",
        date: "June 15, 2026",
        time: "9:00 AM",
        type: "conference",
        description:
            "One of the biggest React conferences in the world, bringing together developers to explore the latest in React, Next.js, and the broader ecosystem.",
    },
    {
        title: "JSNation 2026",
        image: "/images/event2.png",
        slug: "jsnation-2026",
        location: "Amsterdam, Netherlands",
        date: "June 16, 2026",
        time: "9:30 AM",
        type: "conference",
        description:
            "A JavaScript-focused conference covering everything from frontend frameworks to backend runtimes and tooling.",
    },
    {
        title: "Global Game Jam Hackathon",
        image: "/images/event3.png",
        slug: "global-game-jam",
        location: "Worldwide (Hybrid)",
        date: "January 24, 2026",
        time: "6:00 PM",
        type: "hackathon",
        description:
            "A 48-hour hackathon where developers, designers, and artists team up to build games from scratch around a surprise theme.",
    },
    {
        title: "AI Builders Hackathon",
        image: "/images/event4.png",
        slug: "ai-builders-hackathon",
        location: "San Francisco, CA",
        date: "March 8, 2026",
        time: "10:00 AM",
        type: "hackathon",
        description:
            "A weekend hackathon focused on building practical AI-powered applications using the latest LLM tools and APIs.",
    },
    {
        title: "Next.js Conf 2026",
        image: "/images/event5.png",
        slug: "nextjs-conf-2026",
        location: "San Francisco, CA",
        date: "October 22, 2026",
        time: "9:00 AM",
        type: "conference",
        description:
            "Vercel's official Next.js conference, featuring deep dives into the framework's latest features and the future of the React ecosystem.",
    },
    {
        title: "Frontend Meetup Berlin",
        image: "/images/event6.png",
        slug: "frontend-meetup-berlin",
        location: "Berlin, Germany",
        date: "February 12, 2026",
        time: "7:00 PM",
        type: "meetup",
        description:
            "A monthly community meetup for frontend developers to share knowledge, network, and discuss the latest trends in web development.",
    },
    {
        title: "DevOps Days NYC",
        image: "/images/event-full.png",
        slug: "devopsdays-nyc",
        location: "New York, NY",
        date: "May 19, 2026",
        time: "8:30 AM",
        type: "conference",
        description:
            "A community-driven conference covering CI/CD, cloud infrastructure, observability, and modern DevOps practices.",
    },

];
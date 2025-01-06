![Litany logo](public/assets/logo-readme.png)
# Litany
This is Litany, a productivity app designed to break down the litany of things in life into smaller steps.

## Premise
This is not your garden variety to-do app! Litany lets you create tasks and subtasks within to help achieve your goals. Tasks manifest the big picture of what you want to do, and subtasks allow you to break down this vision into incremental steps.

Tasks have a title and description to help you stay organized, and you can define urgency with a low, medium, or high priority.

Subtasks help break down the tasks into smaller steps, as mentioned. The following types are available:
- Manual: It's like a to-do item, check when completed or you can reset progress if it still needs work!
- Timed: Timeboxing option where there is a timer specified, and completion of timer constitutes success.

## Roadmap items
- More robust authentication with identity providers (i.e. Apple, Google, GitHub, etc). Sign in through e-mail is temporary.
- More comprehensive home page that shows tasks and/or subtasks that should be completed, as well as material to enable end users to work with Litany.

## Credits
This full-stack productivity application was created with TypeScript, Next.js, React, Tailwind CSS, PostgreSQL, and Supabase at the core framework.

### Additional libraries that make the magic happen:
- Motion (https://motion.dev): Formerly Framer Motion, this animation library is responsible for subtask reordering and enter animations, such as the one in the authentication page.
- Headless UI (https://headlessui.com): Unstyled components / headless UI system that works with Tailwind CSS.
- react-icons (https://react-icons.github.io/react-icons/): Popular React icon library that provides the icons for the dashboard in Litany.
- SWR (https://swr.vercel.app/): From the folks that brought you Next.js, SWR (stale-while-revalidate) is responsible for the client-side data fetching and revalidation across most, if not all client components in Litany.
- react-hot-toast (https://react-hot-toast.com/): React toast library that is used to notify the end user when an action was performed in Litany.
